import express from 'express';
import createCodeExchange from '../auth/gmailAPIAuth.js';

const router = express.Router();

router.post('/code-exchange', createCodeExchange);

export default router;