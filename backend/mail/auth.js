import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import readline from 'readline';

const __dirname = path.resolve();
const CREDENTIALS_PATH = path.join(__dirname, 'mail/credentials.json'); // Path to credentials.json
const TOKEN_PATH = path.join(__dirname, 'mail/token.json'); // Path to token.json

// Scopes for Gmail API
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

// Load client secrets from a local file.
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Load token from a local file if it exists or generate a new one
const getAccessToken = (oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the code from that page here: ', async (code) => {
    rl.close();

    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
      console.log('Token stored to', TOKEN_PATH);
    } catch (err) {
      console.error('Error retrieving access token', err);
    }
  });
};

const loadToken = () => {
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);
  } else {
    getAccessToken(oAuth2Client);
  }
};

// Initialize OAuth2 client with token
loadToken();

export default oAuth2Client;
