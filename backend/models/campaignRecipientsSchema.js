import connection from "../database/mysql_connect.js";
import * as yup from "yup";

// Define the schema for the campaign_recipients model
const campaignRecipientsSchema = yup.object().shape({
  id: yup.number(),
  campaign_id: yup.number().required(),
  user_id: yup.number().required(),
  created_at: yup.date(),
  updated_at: yup.date(),
});

// Define the model for the campaign_recipients
class CampaignRecipients {
  static async createCampaignRecipient(campaign_id, user_id) {
    const campaignRecipient = {
      campaign_id,
      user_id,
    };

    try {
      await campaignRecipientsSchema.validate(campaignRecipient);
      const result = await connection("campaign_recipients").insert(campaignRecipient);
      return result;
    } catch (error) {
      // Handle validation errors
      if (error.name === "ValidationError") {
        const validationErrors = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        }));
        throw {
          status: 400,
          message: "Validation error",
          errors: validationErrors,
        };
      }
      throw error;
    }
  }

  static async getCampaignRecipientsByCampaignId(campaign_id) {
    try {
      const campaignRecipients = await connection("campaign_recipients").where({ campaign_id });
      return campaignRecipients;
    } catch (error) {
      throw error;
    }
  }

  static async getCampaignRecipientsByUserId(user_id) {
    try {
      const campaignRecipients = await connection("campaign_recipients").where({ user_id });
      return campaignRecipients;
    } catch (error) {
      throw error;
    }
  }

  // Relationship: CampaignRecipient belongs to a Campaign
  static async getCampaignByRecipient(id) {
    try {
      const campaign = await connection("campaigns")
        .join("campaign_recipients", "campaign_recipients.campaign_id", "campaigns.id")
        .where("campaign_recipients.id", id)
        .select("campaigns.*")
        .first();

      if (!campaign) {
        throw {
          status: 404,
          message: "Campaign not found for this recipient",
        };
      }
      
      return campaign;
    } catch (error) {
      throw error;
    }
  }
  
  // Relationship: CampaignRecipient belongs to a User
  static async getUserByCampaignRecipient(id) {
    try {
      const user = await connection("users")
        .join("campaign_recipients", "campaign_recipients.user_id", "users.id")
        .where("campaign_recipients.id", id)
        .select("users.*")
        .first();

      if (!user) {
        throw {
          status: 404,
          message: "User not found for this recipient",
        };
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async deleteCampaignRecipient(campaign_id, user_id) {
    try {
      const result = await connection("campaign_recipients").where({ campaign_id, user_id }).del();
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async deleteCampaignRecipientsByCampaignId(campaign_id) {
    try {
      const result = await connection("campaign_recipients").where({ campaign_id }).del();
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async deleteCampaignRecipientsByUserId(user_id) {
    try {
      const result = await connection("campaign_recipients").where({ user_id }).del();
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async deleteCampaignRecipientsByCampaignIdAndUserId(campaign_id, user_id) {
    try {
      const result = await connection("campaign_recipients").where({ campaign_id, user_id }).del();
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default CampaignRecipients;