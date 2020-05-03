import GoogleStrategy from 'passport-google-oauth20'

export default new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.GOOGLE_REDIRECT_URL
	}, GoogleStrategyCallback
);

const GoogleStrategyCallback = (accessToken, refreshToken, profile, done) => done(null, {
	accessToken,
	refreshToken,
	profile
})

