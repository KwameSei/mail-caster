import connection from "../database/mysql_connect.js";
import * as yup from "yup";

// Define the schema for the campaigns model
const campaignsSchema = yup.object().shape({
  id: yup.number(),
  name: yup.string().required(),
  content: yup.string().required(),
  scheduled_time: yup.date().required(),
  segment_id: yup.number().required(),
  user_id: yup.number().required(),
  created_at: yup.date(),
  updated_at: yup.date(),
});

// Define the model for the campaigns
class Campaigns {
  static async createCampaign(name, content, scheduled_time, segment_id, user_id) {
    const campaign = {
      name,
      content,
      scheduled_time,
      segment_id: parseInt(segment_id, 10),
      user_id,
    };

    try {
      await campaignsSchema.validate(campaign);
      const [campaignId] = await connection("campaigns").insert(campaign, 'id');  // Insert the campaign and get the inserted id
      const result = await connection("campaigns").where('id', campaignId).first();
      
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

  static async getCampaignById(id) {
    try {
      const campaign = await connection("campaigns").where({ id }).first();

      if (!campaign) {
        throw {
          status: 404,
          message: "Campaign not found",
        };
      }
      return campaign;
    } catch (error) {
      throw error;
    }
  }

  static async getCampaigns() {
    try {
      const campaigns = await connection("campaigns").select();
      return campaigns;
    } catch (error) {
      throw error;
    }
  }

  static async updateCampaign(id, name, content, scheduled_time, segment_id, user_id) {
    const campaign = {
      name,
      content,
      scheduled_time,
      segment_id,
      user_id,
    };

    try {
      await campaignsSchema.validate(campaign);
      const result = await connection("campaigns").where({ id }).update(campaign);
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

  static async deleteCampaign(id) {
    try {
      const result = await connection("campaigns").where({ id }).delete();
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getCampaignsBySegment(segment_id) {
    try {
      const campaigns = await connection("campaigns").where({ segment_id });
      return campaigns;
    } catch (error) {
      throw error;
    }
  }

  static async getCampaignsByUser(user_id) {
    try {
      const campaigns = await connection("campaigns").where({ user_id });
      return campaigns;
    } catch (error) {
      throw error;
    }
  }

  // Relationship: Campaign belongs to a User (creator)
  static async getCampaignCreator(id) {
    try {
      const user = await connection("users")
        .join("campaigns", "campaigns.user_id", "users.id")
        .where("campaigns.id", id)
        .select("users.*")
        .first();

      if (!user) {
        throw {
          status: 404,
          message: "User not found for this campaign",
        };
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Relationship: Campaign belongs to a Segment
  static async getCampaignSegment(id) {
    try {
      const segment = await connection("segments")
        .join("campaigns", "campaigns.segment_id", "segments.id")
        .where("campaigns.id", id)
        .select("segments.*")
        .first();

      if (!segment) {
        throw {
          status: 404,
          message: "Segment not found for this campaign",
        };
      }
      
      return segment;
    } catch (error) {
      throw error;
    }
  }

  // Relationship: Campaign has many Recipients
  static async getCampaignRecipients(id) {
    try {
      const recipients = await connection("campaign_recipients")
        .join("campaigns", "campaign_recipients.campaign_id", "campaigns.id")
        .where("campaigns.id", id)
        .select("campaign_recipients.*");

      return recipients;
    } catch (error) {
      throw error;
    }
  }
}

export default Campaigns;