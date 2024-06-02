import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

const __dirname = path.resolve();
const CREDENTIALS_PATH = path.join(__dirname, 'mail/credentials.json'); // Path to credentials.json
const TOKEN_PATH = path.join(__dirname, 'mail/token.json'); // Path to token.json

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3000/gmail-auth');

const createCodeExchange = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code is required' });
  }

  try {
    // Retry configuration
    const maxRetries = 3;
    let retryCount = 0;
    let tokens;

    while (retryCount < maxRetries) {
      try {
        // Exchange the authorization code for an access token
        const response = await oAuth2Client.getToken(code);
        tokens = response.tokens;
        break;
      } catch (error) {
        retryCount += 1;
        if (retryCount >= maxRetries) {
          throw error;
        }
      }
    }

    oAuth2Client.setCredentials(tokens);

    // Store the token to disk for later program executions
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log('Token stored to', TOKEN_PATH);

    res.status(200).json({
      success: true,
      status: 200,
      access_token: tokens.access_token,
      message: 'Code exchange successful',
    });
  } catch (error) {
    console.error('Error exchanging code:', error);
    res.status(500).json({ message: 'Error exchanging code' });
  }
};

export default createCodeExchange;
