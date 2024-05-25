import cron from 'node-cron';
import BroadcastMail from '../mail/Email.js';
import Segments from '../models/segmentsSchema.js';
import Campaigns from '../models/campaignsSchema.js';

// Schedule the job to run every minute
cron.schedule('* * * * *', async () => {
  try {
    const campaigns = await Campaigns.getCampaigns();
    const now = new Date();

    for (const campaign of campaigns) {
      const { id, name, content, scheduled_time, segment_id, user_id } = campaign;
      const scheduledTime = new Date(scheduled_time);

      if (scheduledTime <= now && !campaign.sent) {
        const segmentUsers = await Segments.getSegmentUsers(segment_id);
        const segment = await Segments.getSegmentById(segment_id);

        segmentUsers.forEach(async (user) => {
          const { email, first_name, last_name } = user;
          const subject = `New Campaign: ${name}`;
          const text = `Dear ${first_name} ${last_name}, \n\n${content}`;
          const html = `<p>Hello ${first_name} ${last_name}, <br><br>${content}</p>`;

          try {
            await BroadcastMail(email, subject, text, html);
          } catch (error) {
            console.error(error);
          }
        });

        // Update the campaign status to sent
        await Campaigns.markAsSent(campaign.id);
        
        console.log(`Campaign ${name} sent to segment ${segment.name}`);
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
});