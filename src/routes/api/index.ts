import express from 'express';

const router = express.Router();

router.get('/', function(req, res, next) { 
	res.json("Express Server for Gifty")
});

export default router;