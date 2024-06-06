import jwt from 'jsonwebtoken'
import { secretKey } from './config.js'
import { generateTokens, setTokens } from './tokens.js'

export const authMiddleware = (req, res) => {
	const { access_token, refresh_token } = req.cookies
	const userAgent = req.get('user-agent')

	try {
		const { id } = jwt.verify(access_token, secretKey)
		if (id) return { userId: id }
	} catch (error) {
		if (error.name !== 'JsonWebTokenError') throw error
	}

	try {
		const result = jwt.verify(refresh_token, secretKey)

		if (result.id && result.userAgent === userAgent) {
			const newTokens = generateTokens(result.id, result.userAgent)
			setTokens(res, newTokens)
		}

		return { userId: result.id }
	} catch (error) {
		return { userId: null }
	}
}
