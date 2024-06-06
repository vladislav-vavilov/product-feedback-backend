import { generateTokens } from './jwt.js'
import { setTokens } from './helpers.js'
import User from './models/User.js'
import Post from './models/Post.js'
import Comment from './models/Comment.js'
import bcrypt from 'bcryptjs'
import { GraphQLError } from 'graphql'
import { categoriesEnum } from './constants.js'

const resolvers = {
	Category: categoriesEnum,
	Query: {
		user: async (_, { id }) => {
			const user = await User.findById(id).populate('posts')
			if (!user) {
				throw new GraphQLError('User does not exist', {
					extensions: { code: 'GRAPHQL_NOT_FOUND' },
				})
			}

			return user
		},
		posts: async (_, { filters }) => {
			const query = {}
			if (filters?.title) query.title = { $regex: filters.title }
			if (filters?.content) query.content = { $regex: filters.content }
			if (filters?.author) query.author = filters.author

			return await Post.find(query).populate(['author', 'comments'])
		},
	},
	Mutation: {
		register: async (_, { input }, context) => {
			if (await User.findOne({ email: input.email })) {
				throw new GraphQLError('User already exists', {
					extensions: { code: 'MONGODB_VALIDATION_FAILED' },
				})
			}

			const passwordHash = bcrypt.hashSync(input.password, 6)
			const user = new User({ ...input, password: passwordHash })

			const tokens = generateTokens(user._id, context.req.get('user-agent'))
			setTokens(context.res, tokens)

			return await user.save()
		},
		login: async (_, { input: { email, password } }, context) => {
			const user = await User.findOne({ email })
			if (!user) {
				throw new GraphQLError('User not found', {
					extensions: { code: 'MONGODB_NOT_FOUND' },
				})
			}

			if (!bcrypt.compareSync(password, user.password)) {
				throw new GraphQLError('Invalid password', {
					extensions: { code: 'INVALID_CREDENTIALS' },
				})
			}

			const tokens = generateTokens(user._id, context.req.get('user-agent'))
			setTokens(context.res, tokens)

			return user
		},
		updateUser: async (_, { input: { id, password, ...data } }, context) => {
			if (context.userId !== id) {
				throw new GraphQLError('Access denied', {
					extensions: { code: 'ACCESS_DENIED' },
				})
			}

			const user = await User.findById(id)

			if (password) {
				const { currentPassword, newPassword } = password
				const isMatch = bcrypt.compareSync(currentPassword, user.password)

				if (!isMatch) {
					throw new GraphQLError('Current password is invalid', {
						extensions: { code: 'INVALID_CREDENTIALS' },
					})
				}

				const newPasswordHash = bcrypt.hashSync(newPassword, 6)
				user.password = newPasswordHash
			}

			Object.assign(user, data)
			await user.save()

			return user
		},
		deleteUser: async (_, { id }, { res, userId }) => {
			if (userId !== id) {
				throw new GraphQLError('Access denied', {
					extensions: { code: 'ACCESS_DENIED' },
				})
			}

			await User.findByIdAndDelete(id)

			res.clearCookie('access')
			res.clearCookie('refresh')

			return id
		},
		createPost: async (_, { input: { userId, title, content, category } }) => {
			const post = new Post({ author: userId, title, content, category })
			await post.save()

			const user = await User.findById(userId)
			user.posts.push(post._id)
			await user.save()

			return post
		},
		updatePost: async (_, { input }, context) => {
			const post = await Post.findById(input.id)
			const isCreator = post.author.toString() === context.userId

			if (!isCreator) {
				throw new GraphQLError('Access denied', {
					extensions: { code: 'ACCESS_DENIED' },
				})
			}

			Object.assign(post, input)
			await post.save()

			return post
		},
		deletePost: async (_, { id }, context) => {
			const post = await Post.findById(id)
			const isCreator = post.author.toString() === context.userId

			if (!isCreator) {
				throw new GraphQLError('Access denied', {
					extensions: { code: 'ACCESS_DENIED' },
				})
			}

			await post.deleteOne()
			return post._id
		},
		createComment: async (_, { input: { postId, userId, content } }) => {
			const comment = new Comment({ post: postId, author: userId, content })
			await comment.save()

			const post = await Post.findById(postId)
			post.comments.push(comment)
			await post.save()

			return comment.populate('author')
		},
		updateComment: async (_, { input }, context) => {
			const comment = await Comment.findById(input.id)
			const isCreator = comment.author.toString() === context.userId

			if (!isCreator) {
				throw new GraphQLError('Access denied', {
					extensions: { code: 'ACCESS_DENIED' },
				})
			}

			Object.assign(comment, input)
			await comment.save()

			return comment.populate('author')
		},
		deleteComment: async (_, { id }, context) => {
			const comment = await Comment.findById(id)
			const isCreator = comment.author.toString() === context.userId

			if (!isCreator) {
				throw new GraphQLError('Access denied', {
					extensions: { code: 'ACCESS_DENIED' },
				})
			}

			await comment.deleteOne()
			return comment._id
		},
	},
}

export default resolvers
