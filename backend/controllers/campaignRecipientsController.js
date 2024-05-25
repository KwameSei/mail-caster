import CampaignRecipients from "../models/campaignRecipientsSchema.js";

class CampaignRecipientsController {
  // Create campaign recipient
  static async createCampaignRecipient(req, res) {
    const { campaign_id, user_id } = req.body;

    try {
      const result = await CampaignRecipients.createCampaignRecipient(campaign_id, user_id);

      if (!result) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Campaign recipient not created",
        });
      }

      return res.status(201).json({
        success: true,
        status: 201,
        message: "Campaign recipient created",
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
  // Get campaign recipients by campaign id
  static async getCampaignRecipientsByCampaignId(req, res) {
    const { id } = req.params;

    try {
      const campaignRecipients = await CampaignRecipients.getCampaignRecipientsByCampaignId(id);

      if (!campaignRecipients) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Campaign recipients not found for this campaign",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Campaign recipients",
        data: campaignRecipients,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  }

  // Get campaign recipients by user id
  static async getCampaignRecipientsByUserId(req, res) {
    const { id } = req.params;

    try {
      const campaignRecipients = await CampaignRecipients.getCampaignRecipientsByUserId(id);

      if (!campaignRecipients) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Campaign recipients not found for this user",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Campaign recipients",
        data: campaignRecipients,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  }

  // Get campaign by recipient
  static async getCampaignByRecipient(req, res) {
    const { id } = req.params;

    try {
      const campaign = await CampaignRecipients.getCampaignByRecipient(id);

      if (!campaign) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Campaign not found for this recipient",
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

  // Get user by campaign recipient
  static async getUserByCampaignRecipient(req, res) {
    const { id } = req.params;

    try {
      const user = await CampaignRecipients.getUserByCampaignRecipient(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "User not found for this recipient",
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: "User",
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
}

export default CampaignRecipientsController;