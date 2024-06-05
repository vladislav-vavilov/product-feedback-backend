import jwt from 'jsonwebtoken'
import { secretKey } from './config.js'
import { setTokens } from './helpers.js'

export const authMiddleware = (req, res) => {
	try {
		const { access, refresh } = req.cookies
		const userAgent = req.get('user-agent')

		const { id } = jwt.verify(access, secretKey)
		if (id) return { userId: id }

		const result = jwt.verify(refresh, secretKey)
		if (result.id && result.userAgent === userAgent) {
			const newTokens = generateTokens(result.id, result.userAgent)
			setTokens(res, newTokens)

			return { userId: result.id }
		}

		return { userId: null }
	} catch (error) {
		if (error.name === 'JsonWebTokenError') {
			return { userId: null }
		}
	}
}
