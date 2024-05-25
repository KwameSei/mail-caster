import express from "express";
import CampaignRecipientsController from "../controllers/campaignRecipientsController.js";

const router = express.Router();

router.post("/create-campaign-recipient", CampaignRecipientsController.createCampaignRecipient);
router.get("/get-campaign-by-recipient/:id", CampaignRecipientsController.getCampaignByRecipient);
router.get("/get-user-by-campaign-recipient/:id", CampaignRecipientsController.getUserByCampaignRecipient);
router.get("/get-campaign-recipients-by-campaign/:id", CampaignRecipientsController.getCampaignRecipientsByCampaignId);
router.get("/get-campaign-recipients-by-user/:id", CampaignRecipientsController.getCampaignRecipientsByUserId);

export default router;