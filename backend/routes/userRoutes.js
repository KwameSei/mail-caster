import express from 'express';
import UserController from '../controllers/userController.js';

const router = express.Router();

router.post('/signup-user', UserController.signUp);
router.post('/login-user', UserController.signIn);
router.get('/get-user-segment/:id', UserController.getUserSegment);
router.get('/get-user-campaigns/:id', UserController.getUserCampaigns);
router.get('/get-user-campaign-recipients/:id', UserController.getUserCampaignRecipients);
router.get('/get-users', UserController.getUsers);

export default router;