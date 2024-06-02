import connection from "../database/mysql_connect.js";
import * as yup from "yup";

// Define the schema for the campaigns model
const campaignsSchema = yup.object().shape({
  subject: yup.string().required('Subject is required'),
  content: yup.string().required('Content is required'),
  type: yup.string().oneOf(['email', 'sms'], 'Invalid campaign type').required('Type is required'),
  status: yup.string().oneOf(['draft', 'scheduled', 'sent', 'canceled'], 'Invalid status').required('Status is required'),
  segment_id: yup.number().required('Segment ID is required'),
  user_id: yup.number().required('User ID is required'),
  scheduled_date: yup.date().required('Scheduled date is required'),
  scheduled_time: yup.string().matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format').required('Scheduled time is required'),
  scheduled_datetime: yup.date().required('Scheduled datetime is required'),
  scheduled_timezone: yup.string().required('Scheduled timezone is required'),
  created_at: yup.date().required('Created at is required'),
  updated_at: yup.date().required('Updated at is required'),
});

const formatDateForMySQL = (date) => {
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
};

// Define the model for the campaigns
class Campaigns {
  static async createCampaign(
    subject,
    content,
    type,
    status,
    segment_id,
    user_id,
    scheduled_date,
    scheduled_time,
    scheduled_timezone,
    created_at,
    updated_at
  ) {
    try {
      // Combine date and time into an ISO 8601 string
      const combinedDateTimeString = `${scheduled_date}T${scheduled_time}:00`;
      console.log("Combined DateTime String:", combinedDateTimeString);
  
      // Convert to a Date object and then to UTC ISO string
      const scheduled_datetime = new Date(combinedDateTimeString).toISOString().slice(0, 19).replace('T', ' ');
      console.log("Scheduled DateTime (UTC):", scheduled_datetime);
  
      const campaign = {
        subject,
        content,
        type,
        status,
        segment_id: parseInt(segment_id, 10),
        user_id: parseInt(user_id, 10),
        scheduled_date: `${scheduled_date} 00:00:00`,  // Ensure correct format for MySQL DATE
        scheduled_time,
        scheduled_datetime,
        scheduled_timezone,
        created_at: formatDateForMySQL(created_at),
        updated_at: formatDateForMySQL(updated_at),
      };
  
      console.log("Campaign Data to be inserted:", campaign);
  
      // Validate campaign data
      await campaignsSchema.validate(campaign);
  
      // Insert campaign into database
      const [campaignId] = await connection("campaigns").insert(campaign, 'id');
      const result = await connection("campaigns").where('id', campaignId).first();
  
      console.log("Inserted Campaign:", result);
  
      return result;
    } catch (error) {
      console.error("Error in Campaign Creation:", error);
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

  static async getCampaigns() {
    try {
      const campaigns = await connection("campaigns").select();
      return campaigns;
    } catch (error) {
      throw error;
    }
  }

  // static async updateCampaign(id, name, content, scheduled_time, segment_id, user_id) {
  //   const campaign = {
  //     name,
  //     content,
  //     scheduled_time,
  //     segment_id,
  //     user_id,
  //   };

  //   try {
  //     await campaignsSchema.validate(campaign);
  //     const result = await connection("campaigns").where({ id }).update(campaign);
  //     return result;
  //   } catch (error) {
  //     // Handle validation errors
  //     if (error.name === "ValidationError") {
  //       const validationErrors = error.errors.map((err) => ({
  //         field: err.path,
  //         message: err.message,
  //       }));
  //       throw {
  //         status: 400,
  //         message: "Validation error",
  //         errors: validationErrors,
  //       };
  //     }
  //     throw error;
  //   }
  // }

  // Method to update the campaign status
  static async updateCampaign(id, updateData) {
    try {
      const result = await connection("campaigns").where({ id }).update(updateData);
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