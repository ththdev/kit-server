import passport from 'passport'
// import GoogleStrategy from './google'
import User from './entity/User'
import GoogleStrategy from 'passport-google-oauth20'

passport.use(new GoogleStrategy({
		clientID: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: GOOGLE_CLIENT_URL
	},
	function(accessToken, refreshToken, profile, cb) {
		return cb(null, profile);
	}
));