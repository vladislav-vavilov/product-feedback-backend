import jwt from 'jsonwebtoken'
import { secretKey } from './config.js'
import { Response } from 'express'

export const generateTokens = (id: string, userAgent: string) => {
	const accessToken = jwt.sign({ userId: id }, secretKey, { expiresIn: '1h' })
	const refreshToken = jwt.sign({ userId: id, userAgent }, secretKey, {
		expiresIn: '7d',
	})

	return { accessToken, refreshToken }
}

export const setTokens = (
	res: Response,
	tokens: { accessToken: string; refreshToken: string }
) => {
	res.cookie('access_token', tokens.accessToken, {
		httpOnly: true,
		maxAge: 1000 * 60 * 60,
	})
	res.cookie('refresh_token', tokens.refreshToken, {
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	})
}
