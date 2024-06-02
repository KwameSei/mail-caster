import cron from 'node-cron';
import BroadcastMail from '../mail/BroadcastMail.js'; // Ensure this path is correct
import Segments from '../models/segmentsSchema.js';
import Campaigns from '../models/campaignsSchema.js';

// Schedule the job to run every minute
cron.schedule('* * * * *', async () => {
  try {
    const campaigns = await Campaigns.getCampaigns();
    const now = new Date();

    for (const campaign of campaigns) {
      const {
        id,
        subject,
        content,
        scheduled_datetime,
        status,
        segment_id,
      } = campaign;

      const scheduledDateTime = new Date(scheduled_datetime);
      const segmentId = parseInt(segment_id);

      // Check if the campaign is scheduled and the scheduled date and time is before now
      if (status === 'scheduled' && scheduledDateTime <= now) {
        try {
          // Fetch the segment and users
          const segment = await Segments.getSegmentById(segmentId);
          const users = await Segments.getSegmentUsers(segmentId);
          const emails = users.map((user) => user.email);

          if (emails.length > 0) {
            const to = emails.join(','); // Combine emails into a single string
            const mailResponse = await BroadcastMail(to, subject, content, content);

            if (mailResponse && mailResponse.status === 200) {
              // Update the campaign status to 'sent' after successful email send
              await Campaigns.updateCampaign(id, { status: 'sent' });
              console.log(`Email sent successfully for campaign ${id}`);
            } else {
              console.error(`Failed to send email for campaign ${id}: ${mailResponse.message}`);
            }
          }
        } catch (emailError) {
          console.error(`Error sending email for campaign ${id}: ${emailError.message}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error in cron job: ${error.message}`);
  }
});


// To generate the token.json file, you need to run the following command in the terminal:
// node backend/utils/scheduler.js

// Note that the cron job is scheduled to run every minute. You can change the schedule to run at a different interval by modifying the cron expression. For example, to run the job every hour, you can use the following expression:
// cron.schedule('0 * * * *', async () => {
//   // Your code here
// });
// This will run the job at the beginning of every hour.

// To run the job every day at a specific time, you can use the following expression:
// cron.schedule('0 9 * * *', async () => {
//   // Your code here
// });
// This will run the job at 9:00 AM every day.

// To run the job every Monday at a specific time, you can use the following expression:
// cron.schedule('0 9 * * 1', async () => {
//   // Your code here
// });
// This will run the job at 9:00 AM every Monday.


// crohedule('* * * * *', async () => {
//   try {
//     const campaigns = await Campaigns.getCampaigns();
//     const now = new Date();

//     for (const campaign of campaigns) {
//       consn.sct {
//         id,
//         subject,
//         content,
//         scheduled_time,
//         scheduled_date,
//         scheduled_datetime,
//         scheduled_timezone,
//         type,
//         status,
//         segment_id,
//         user_id
//       } = campaign;

//       const scheduledDateTime = new Date(scheduled_datetime);
//       const segmentId = parseInt(segment_id);

//       // Check if the campaign is scheduled and the scheduled date and time is before now
//       if (status === 'scheduled' && scheduledDateTime <= now) {
//         // Fetch the segment and users
//         const segment = await Segments.getSegmentById(segmentId);
//         const users = await Segments.getSegmentUsers(segmentId);
//         const emails = users.map((user) => user.email);

//         if (emails.length > 0) {
//           const to = emails.join(','); // Combine emails into a single string
//           try {
//             const mailResponse = await BroadcastMail(to, subject, content, content);

//             if (mailResponse && mailResponse.status === 200) {
//               // Update the campaign status to 'sent' after successful email send
//               await Campaigns.updateCampaign(id, { status: 'sent' });
//               console.log(`Email sent successfully for campaign ${id}`);
//             } else {
//               console.error(`Failed to send email for campaign ${id}: ${mailResponse.message}`);
//             }
//           } catch (emailError) {
//             console.error(`Error sending email for campaign ${id}: ${emailError.message}`);
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.error(`Error in cron job: ${error.message}`);
//   }
// });
