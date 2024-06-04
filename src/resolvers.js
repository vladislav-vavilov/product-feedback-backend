import { generateTokens } from './jwt.js'
import { setTokens } from './helpers.js'
import User from './models/User.js'
import Post from './models/Post.js'
import bcrypt from 'bcryptjs'
import { GraphQLError } from 'graphql'

const resolvers = {
	Query: {
		getUser: async (_, { id }) => {
			const user = await User.findById(id).populate('posts')
			if (!user) {
				throw new GraphQLError('User does not exist', {
					extensions: { code: 'GRAPHQL_NOT_FOUND' },
				})
			}

			return user
		},
	},
	Mutation: {
		registration: async (_, { data }, context) => {
			if (await User.findOne({ email: data.email })) {
				throw new GraphQLError('User already exists', {
					extensions: { code: 'MONGODB_VALIDATION_FAILED' },
				})
			}

			const passwordHash = bcrypt.hashSync(data.password, 6)
			const user = new User({
				...data,
				password: passwordHash,
			})

			const tokens = generateTokens(user._id, context.req.get('user-agent'))
			setTokens(context.res, tokens)

			return await user.save()
		},
		login: async (_, { email, password }, context) => {
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
		createPost: async (_, { title, content, userId }) => {
			const post = new Post({ title, content, userId })
			const user = await User.findById(userId)
			user.posts.push(post._id)

			await post.save()
			await user.save()

			return post
		},
	},
}

export default resolvers
