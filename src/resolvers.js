import { generateTokens } from './jwt.js'
import { setTokens } from './helpers.js'

const resolvers = {
	Query: {},
	Mutation: {
		register: async (_, __, context) => {
			const userId = '123'
			const tokens = generateTokens(userId, context.req.get('user-agent'))
			setTokens(context.res, tokens)

			return {
				id: '123',
				username: 'John',
				email: 'fjdskl',
			}
		},
	},
}

export default resolvers
