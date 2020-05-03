import express from 'express';
import passport from 'passport'

const router = express.Router();

router.get('/auth', function(req, res, next) {
	res.send('Authenticate')
});

// Google Login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile']}));

router.get('/auth/google/callback', passport.authenticate('google', {
	failureRedirect: '/auth',
	successRedirect: '/'
}));

// Facebook Login
router.get('/auth/facebook', function(req, res, next) {
	res.send('Continue with Facebook');
});

export default router;