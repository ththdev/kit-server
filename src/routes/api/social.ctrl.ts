import { getRepository } from 'typeorm'
import passport from 'passport'

const googleLogin = async () => {
	passport.authentication('google', { scope: "profile" });
}