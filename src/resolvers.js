import { generateTokens } from './jwt.js'
import { setTokens } from './helpers.js'
import User from './models/User.js'
import bcrypt from 'bcryptjs'

const resolvers = {
	Query: {},
	Mutation: {
		register: async (_, { email, password, username }, context) => {
			const passwordHash = bcrypt.hashSync(password, 6)
			const user = new User({
				email,
				password: passwordHash,
				username,
			})

			const tokens = generateTokens(user._id, context.req.get('user-agent'))
			setTokens(context.res, tokens)

			return await user.save()
		},
		login: async (_, { email, password }, context) => {
			const user = await User.findOne({ email })
			if (!user) throw new Error('User not found')

			if (!bcrypt.compareSync(password, user.password)) {
				throw new Error('Invalid password')
			}

			const tokens = generateTokens(user._id, context.req.get('user-agent'))
			setTokens(context.res, tokens)

			return user
		},
	},
}

export default resolvers
