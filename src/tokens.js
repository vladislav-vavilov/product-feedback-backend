import jwt from 'jsonwebtoken'
import { secretKey } from './config.js'

export const generateTokens = (id, userAgent) => {
	const accessToken = jwt.sign({ id }, secretKey, { expiresIn: '1h' })
	const refreshToken = jwt.sign({ id, userAgent }, secretKey, {
		expiresIn: '7d',
	})

	return { accessToken, refreshToken }
}

export const setTokens = (res, tokens) => {
	res.cookie('access', tokens.accessToken, {
		httpOnly: true,
		maxAge: 1000 * 60 * 60,
	})
	res.cookie('refresh', tokens.refreshToken, {
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	})
}
