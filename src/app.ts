import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import schema from './graphql/schema'
import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'

import indexRouter from './routes/api'
import authRouter from './routes/api/auth'

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())
app.use(morgan("dev"))
app.use(session({ secret: 'mysecret' }))
app.use(passport.initialize())
app.use(passport.session())

// routes
app.use('/', indexRouter);
app.use('/', authRouter);

// passport
const googleLogin = (accessToken, refreshToken, profile, done) => {
	console.log(profile)
	return done(null, profile)
}

passport.use(
	new GoogleStrategy({
		clientID: "493563361431-g4bar57i9uudnp5oih3a53jom7bn42qu.apps.googleusercontent.com",
		clientSecret: "wEVpK6tJsAnhGBfISoR9RTXD",
		callbackURL: "https://node-server-fwqtf.run.goorm.io/auth/google/callback"
	}, googleLogin
));

passport.serializeUser(function(user, done) {
	console.log("Serializer" + user)
  	done(null, user);
});

passport.deserializeUser(function(user, done) {
	console.log("Deserializer" + user)
  	done(null, user);
});

// ApolloServer
const apollo = new ApolloServer({
	schema,
});

apollo.applyMiddleware({ app, cors: false });

export default app;




