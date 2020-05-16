import express from 'express';

const router = express.Router();

router.get('/auth', function(req, res, next) {
	res.send('Authenticate')
});

export default router;