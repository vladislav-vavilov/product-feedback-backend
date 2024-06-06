import jwt from 'jsonwebtoken'
import { secretKey } from './config.js'
import { setTokens } from './helpers.js'
import { generateTokens } from './jwt.js'

export const authMiddleware = (req, res) => {
	const { access, refresh } = req.cookies
	const userAgent = req.get('user-agent')

	try {
		const { id } = jwt.verify(access, secretKey)
		if (id) return { userId: id }
	} catch (error) {
		if (error.name !== 'JsonWebTokenError') throw error
	}

	try {
		const result = jwt.verify(refresh, secretKey)

		if (result.id && result.userAgent === userAgent) {
			const newTokens = generateTokens(result.id, result.userAgent)
			setTokens(res, newTokens)
		}

		return { userId: result.id }
	} catch (error) {
		return { userId: null }
	}
}
