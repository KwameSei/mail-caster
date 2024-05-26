import connection from "../database/mysql_connect.js";
import * as yup from "yup";

// Define the schema for the user model
const userSchema = yup.object().shape({
  id: yup.number(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  segment_id: yup.number().required(),
  is_admin: yup.boolean(),
  created_at: yup.date(),
  updated_at: yup.date(),
});

// Define the model for the user
class User {
  static async createUser(first_name, last_name, email, password, segment_id, is_admin) {
    const user = {
      first_name,
      last_name,
      email,
      password,
      segment_id: segment_id || 1,
      is_admin,
    };

    try {
      await userSchema.validate(user);
      const result = await connection("users").insert(user);
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

  static async getUserByEmail(email) {
    try {
      const user = await connection("users").where({ email }).first();

      if (!user) {
        throw {
          status: 404,
          message: "User not found",
        };
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      const user = await connection("users").where({ id }).first();

      if (!user) {
        throw {
          status: 404,
          message: "User not found",
        };
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async getUsers() {
    try {
      const users = await connection("users").select();
      return users;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(id, first_name, last_name, email, password, segment_id, is_admin) {
    const user = {
      first_name,
      last_name,
      email,
      password,
      segment_id,
      is_admin,
    };

    try {
      await userSchema.validate(user);
      const result = await connection("users").where({ id }).update(user);
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

  static async deleteUser(id) {
    try {
      const result = await connection("users").where({ id }).delete();
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Relationship: User belongs to a Segment
  static async getUserSegment(id) {
    try {
      const segment = await connection("segments")
        .join("users", "users.segment_id", "segments.id")
        .where("users.id", id)
        .select("segments.*")
        .first();

      if (!segment) {
        throw {
          status: 404,
          message: "Segment not found for this user",
        };
      }
      
      return segment;
    } catch (error) {
      throw error;
    }
  }

  // Relationship: User has many Campaigns (as a creator)
  static async getUserCampaigns(id) {
    try {
      const campaigns = await connection("campaigns").where({ user_id: id }).select();

      return campaigns;
    } catch (error) {
      throw error;
    }
  }
  
  // Relationship: User has many Campaign Recipients (as a recipient)
  static async getUserCampaignRecipients(id) {
    try {
      const campaignRecipients = await connection("campaign_recipients")
        .join("users", "users.id", "campaign_recipients.user_id")
        .where("users.id", id)
        .select("campaign_recipients.*");

      if (!campaignRecipients) {
        throw {
          status: 404,
          message: "Campaign recipients not found for this user",
        };
      }

      return campaignRecipients;
    } catch (error) {
      throw error;
    }
  }
}

export default User;