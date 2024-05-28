import connection from "../database/mysql_connect.js";
import * as yup from "yup";

// Define the schema for the segments model
const segmentsSchema = yup.object().shape({
  id: yup.number(),
  name: yup.string().required(),
  description: yup.string(),
  created_at: yup.date(),
  updated_at: yup.date(),
});

// Define the model for the segments
class Segments {
  static async createSegment(name, description) {
    const segment = {
      name,
      description,
    };

    try {
      await segmentsSchema.validate(segment);
      const segmentId = await connection("segments").insert(segment);
      
      const result = await connection("segments").where("id", segmentId).first();

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

  static async getSegmentById(id) {
    try {
      const segment = await connection("segments").where({ id }).first();

      if (!segment) {
        throw {
          status: 404,
          message: "Segment not found",
        };
      }
      return segment;
    } catch (error) {
      throw error;
    }
  }

  static async getSegments() {
    try {
      const segments = await connection("segments").select();
      return segments;
    } catch (error) {
      throw error;
    }
  }

  static async updateSegment(id, name, description) {
    const segment = {
      name,
      description,
    };

    try {
      await segmentsSchema.validate(segment);
      const result = await connection("segments").where({ id }).update(segment);
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

  static async deleteSegment(id) {
    try {
      const result = await connection("segments").where({ id }).delete();
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Relationship: Segment has many Users
  static async getSegmentUsers(id) {
    try {
      const users = await connection("users").where({ segment_id: id }).select();

      return users;
    } catch (error) {
      throw error;
    }
  }

  // Relationship: Segment has many Campaigns
  static async getSegmentCampaigns(id) {
    try {
      const campaigns = await connection("campaigns").where({ segment_id: id }).select();

      return campaigns;
    } catch (error) {
      throw error;
    }
  }

  static async getSegmentContacts(id) {
    try {
      const contacts = await connection("contacts")
        .join("segments", "contacts.segment_id", "segments.id")
        .where("segments.id", id)
        .select("contacts.*");

      return contacts;
    } catch (error) {
      throw error;
    }
  }

  static async getSegmentLeads(id) {
    try {
      const leads = await connection("leads")
        .join("segments", "leads.segment_id", "segments.id")
        .where("segments.id", id)
        .select("leads.*");

      return leads;
    } catch (error) {
      throw error;
    }
  }
}

export default Segments;