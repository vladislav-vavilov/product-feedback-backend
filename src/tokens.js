import jwt from 'jsonwebtoken'
import { secretKey } from './config.js'

export const generateTokens = (id, userAgent) => {
	const accessToken = jwt.sign({ id }, secretKey, { expiresIn: '1h' })
	const refreshToken = jwt.sign({ id, userAgent }, secretKey, {
		expiresIn: '7d',
	})

	return { accessToken, refreshToken }
}

export const setTokens = (res, { accessToken, refreshToken }) => {
	res.cookie('access_token', accessToken, {
		httpOnly: true,
		maxAge: 1000 * 60 * 60,
	})
	res.cookie('refresh_token', refreshToken, {
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	})
}
