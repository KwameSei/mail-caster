import express from "express";
import SegmentsController from "../controllers/segmentsController.js";

const router = express.Router();

router.post("/create-segment", SegmentsController.createSegment);
router.get("/get-segment/:id", SegmentsController.getSegmentById);
router.get("/get-segments", SegmentsController.getSegments);
router.put("/update-segment/:id", SegmentsController.updateSegment);
router.delete("/delete-segment/:id", SegmentsController.deleteSegment);
router.get("/get-segment-users/:id", SegmentsController.getSegmentUsers);
router.get("/get-segment-campaigns/:id", SegmentsController.getSegmentCampaigns);
router.get("/get-segment-contacts/:id", SegmentsController.getSegmentContacts);
router.get("/get-segment-leads/:id", SegmentsController.getSegmentLeads);
router.get("/get-segment-contacts/:id", SegmentsController.getSegmentContacts);

export default router;