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
