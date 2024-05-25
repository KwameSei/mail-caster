import Campaigns from "../models/campaignsSchema.js";
import BroadcastMail from "../mail/Email.js";
import Segments from "../models/segmentsSchema.js";

class CampaignsController {
  // Create campaign
  static async createCampaign(req, res) {
    const { name, content, scheduled_time, segment_id, user_id } = req.body;

    try {
      const result = await Campaigns.createCampaign(name, content, scheduled_time, segment_id, user_id);

      if (!result) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Campaign not created",
        });
      }

      return res.status(201).json({
        success: true,
        status: 201,
        message: "Campaign created",
        data: result,
      });

      // Fetch the users in the segment
      // const segmentUsers = await Segments.getSegmentUsers(segment_id);

      // // Fetch the segment
      // const segment = await Segments.getSegmentById(segment_id);

      // // Send email to the users in the segment
      // segmentUsers.forEach(async (user) => {
      //   const { email, first_name, last_name } = user;
      //   const subject = `New Campaign: ${name}`;
      //   const text = `Dear ${first_name} ${last_name}, \n\n${content}`;
      //   const html = `<p>Hello ${first_name} ${last_name}, <br><br>${content}</p>`;

      //   try {
      //     await BroadcastMail(email, subject, text, html);
      //   } catch (error) {
      //     console.error(error);
      //     throw new Error(error.message);
      //   }
      // })
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  }
  // Get campaign creator
  static async getCampaignCreator(req, res) {
    const { id } = req.params;

    try {
      const user = await Campaigns.getCampaignCreator(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "User not found for this campaign",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Campaign creator",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  }

  // Get campaign segment
  static async getCampaignSegment(req, res) {
    const { id } = req.params;

    try {
      const segment = await Campaigns.getCampaignSegment(id);

      if (!segment) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Segment not found for this campaign",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Campaign segment",
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

  // Get campaign recipients
  static async getCampaignRecipients(req, res) {
    const { id } = req.params;

    try {
      const recipients = await Campaigns.getCampaignRecipients(id);

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Campaign recipients",
        data: recipients,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  }

  // Get all campaigns
  static async getAllCampaigns(req, res) {
    try {
      const campaigns = await Campaigns.getAllCampaigns();

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
        message: "All campaigns",
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

  // Get campaign by ID
  static async getCampaignById(req, res) {
    const { id } = req.params;

    try {
      const campaign = await Campaigns.getCampaignById(id);

      if (!campaign) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Campaign not found",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Campaign",
        data: campaign,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  }

  // Update campaign
  static async updateCampaign(req, res) {
    const { id } = req.params;
    const { name, content, scheduled_time, segment_id } = req.body;

    try {
      const result = await Campaigns.updateCampaign(id, name, content, scheduled_time, segment_id);

      if (!result) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Campaign not updated",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Campaign updated",
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

  // Delete campaign
  static async deleteCampaign(req, res) {
    const { id } = req.params;

    try {
      const result = await Campaigns.deleteCampaign(id);

      if (!result) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Campaign not deleted",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Campaign deleted",
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

export default CampaignsController;