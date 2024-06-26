import { generateTokens, setTokens } from './tokens.js'
import User from './models/User.js'
import Post from './models/Post.js'
import Comment from './models/Comment.js'
import bcrypt from 'bcryptjs'
import { GraphQLError } from 'graphql'
import type {
	Resolvers,
	Post as PostType,
	User as UserType,
	Comment as CommentType,
} from './types.js'

const resolvers: Resolvers = {
	Query: {
		user: async (_, { id }) => {
			const user = await User.findById(id).populate('posts')
			if (!user) {
				throw new GraphQLError('User does not exist', {
					extensions: { code: 'GRAPHQL_NOT_FOUND' },
				})
			}

			return user.populate('posts')
		},
		posts: async (_, { filters }) => {
			const titleQuery = { title: { $regex: filters?.title } }
			const contentQuery = { content: { $regex: filters?.content } }
			const authorQuery = { author: filters?.author }

			const query = {
				...(filters?.title && titleQuery),
				...(filters?.content && contentQuery),
				...(filters?.author && authorQuery),
			}
			const posts = await Post.find(query).populate<{
				author: UserType
				comments: CommentType[]
			}>(['author', 'comments'])

			return posts as PostType[]
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

			const tokens = generateTokens(user.id, context.req.get('user-agent'))
			setTokens(context.res, tokens)

			await user.save()
			return user.populate('posts')
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

			const tokens = generateTokens(user.id, context.req.get('user-agent'))
			setTokens(context.res, tokens)

			return user.populate('posts')
		},
		updateUser: async (_, { input: { id, password, ...data } }, context) => {
			if (context.userId !== id) {
				throw new GraphQLError('Access denied', {
					extensions: { code: 'ACCESS_DENIED' },
				})
			}

			const user = await User.findById(id)
			if (!user) {
				throw new GraphQLError('User does not exist', {
					extensions: { code: 'GRAPHQL_NOT_FOUND' },
				})
			}

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

			return user.populate('posts')
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
			if (!user) {
				throw new GraphQLError('User does not exist', {
					extensions: { code: 'GRAPHQL_NOT_FOUND' },
				})
			}
			user.posts.push(post._id)
			await user.save()

			return post.populate('posts')
		},
		updatePost: async (_, { input }, context) => {
			const post = await Post.findById(input.id)
			if (!post) {
				throw new GraphQLError('Post does not exist', {
					extensions: { code: 'GRAPHQL_NOT_FOUND' },
				})
			}

			const isCreator = post.author.toString() === context.userId

			if (!isCreator) {
				throw new GraphQLError('Access denied', {
					extensions: { code: 'ACCESS_DENIED' },
				})
			}

			Object.assign(post, input)
			await post.save()

			return post.populate(['author', 'comments'])
		},
		deletePost: async (_, { id }, context) => {
			const post = await Post.findById(id)
			if (!post) {
				throw new GraphQLError('Post does not exist', {
					extensions: { code: 'GRAPHQL_NOT_FOUND' },
				})
			}

			const isCreator = post.author.toString() === context.userId

			if (!isCreator) {
				throw new GraphQLError('Access denied', {
					extensions: { code: 'ACCESS_DENIED' },
				})
			}

			await post.deleteOne()
			return post.id
		},
		createComment: async (_, { input: { postId, userId, content } }) => {
			const comment = new Comment({ post: postId, author: userId, content })
			await comment.save()

			const post = await Post.findById(postId)
			if (!post) {
				throw new GraphQLError('Post does not exist', {
					extensions: { code: 'GRAPHQL_NOT_FOUND' },
				})
			}

			post.comments.push(comment._id)
			await post.save()

			return comment.populate('author')
		},
		updateComment: async (_, { input }, context) => {
			const comment = await Comment.findById(input.id)
			if (!comment) {
				throw new GraphQLError('Comment does not exist', {
					extensions: { code: 'GRAPHQL_NOT_FOUND' },
				})
			}

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
			if (!comment) {
				throw new GraphQLError('Comment does not exist', {
					extensions: { code: 'GRAPHQL_NOT_FOUND' },
				})
			}
			const isCreator = comment.author.toString() === context.userId

			if (!isCreator) {
				throw new GraphQLError('Access denied', {
					extensions: { code: 'ACCESS_DENIED' },
				})
			}

			await comment.deleteOne()
			return comment.id
		},
	},
}

export default resolvers
