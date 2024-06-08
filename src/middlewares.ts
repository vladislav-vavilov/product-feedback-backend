import jwt from 'jsonwebtoken'
import { secretKey } from './config.js'
import { generateTokens, setTokens } from './tokens.js'
import type { Request, Response } from 'express'

const verifyToken = (token: string) => {
	const result = jwt.verify(token, secretKey)
	const userId = typeof result === 'object' && result.id
	const userAgent = typeof result === 'object' && result.userAgent

	return { userId: userId || null, userAgent: userAgent || null }
}

export const authMiddleware = (req: Request, res: Response) => {
	const { access_token, refresh_token } = req.cookies
	const userAgent = req.get('user-agent')

	try {
		const { userId } = verifyToken(access_token)
		return { userId }
	} catch (error) {
		if (!(error instanceof jwt.JsonWebTokenError)) throw error
	}

	try {
		const { userId, userAgent: tokenUserAgent } = verifyToken(refresh_token)

		if (userId && tokenUserAgent === userAgent) {
			const newTokens = generateTokens(userId, tokenUserAgent)
			setTokens(res, newTokens)
		}

		return { userId }
	} catch (error) {
		return { userId: null }
	}
}
