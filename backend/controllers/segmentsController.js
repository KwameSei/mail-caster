import Segments from "../models/segmentsSchema.js";

// Create a new segment
class SegmentsController {
  static async createSegment(req, res) {
    const { name, description } = req.body;

    try {
      const result = await Segments.createSegment(name, description);

      if (!result) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Segment not created",
        });
      }

      return res.status(201).json({
        success: true,
        status: 201,
        message: "Segment created",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  }

  // Get segment by ID
  static async getSegmentById(req, res) {
    const { id } = req.params;

    try {
      const segment = await Segments.getSegmentById(id);

      if (!segment) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Segment not found",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Segment",
        data: segment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  }
  
  // Get all segments
  static async getSegments(req, res) {
    try {
      const segments = await Segments.getSegments();

      if (!segments) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Segments not found",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Segments",
        data: segments,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  }

  // Update segment
  static async updateSegment(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
      const result = await Segments.updateSegment(id, name, description);

      if (!result) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Segment not updated",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Segment updated",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  }

  // Delete segment
  static async deleteSegment(req, res) {
    const { id } = req.params;

    try {
      const result = await Segments.deleteSegment(id);

      if (!result) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Segment not deleted",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Segment deleted",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  }

  // Get segment users
  static async getSegmentUsers(req, res) {
    const { id } = req.params;

    try {
      const users = await Segments.getSegmentUsers(id);

      if (!users) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Users not found",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Segment users",
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  }

  // Get segment campaigns
  static async getSegmentCampaigns(req, res) {
    const { id } = req.params;

    try {
      const campaigns = await Segments.getSegmentCampaigns(id);

      if (!campaigns) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Campaigns not found",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Segment campaigns",
        data: campaigns,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  }

  // Get segment contacts
  static async getSegmentContacts(req, res) {
    const { id } = req.params;

    try {
      const contacts = await Segments.getSegmentContacts(id);

      if (!contacts) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Contacts not found",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Segment contacts",
        data: contacts,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  }

  // Get segment leads
  static async getSegmentLeads(req, res) {
    const { id } = req.params;

    try {
      const leads = await Segments.getSegmentLeads(id);

      if (!leads) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Leads not found",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Segment leads",
        data: leads,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  }
}

export default SegmentsController;