import express from "express";
import CampaignsController from "../controllers/campaignsController.js";

const router = express.Router();

router.post("/create-campaign", CampaignsController.createCampaign);
router.get("/get-campaign-creator/:id", CampaignsController.getCampaignCreator);
router.get("/get-campaign-recipients/:id", CampaignsController.getCampaignRecipients);
router.get("/get-campaign-segment/:id", CampaignsController.getCampaignSegment);
router.get("/get-campaigns", CampaignsController.getAllCampaigns);
router.get("/get-campaign/:id", CampaignsController.getCampaignById);
router.put("/update-campaign/:id", CampaignsController.updateCampaign);
router.delete("/delete-campaign/:id", CampaignsController.deleteCampaign);

export default router;