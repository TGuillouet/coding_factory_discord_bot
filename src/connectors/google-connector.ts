import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { clientId, clientSecret, redirect } from "./../configs/google-config.json";

const defaultScopes = ["https://www.googleapis.com/auth/userinfo.email"];

function createConnection() {
  return new google.auth.OAuth2(clientId, clientSecret, redirect);
}

function getConnectionUrl(auth: OAuth2Client): string {
  return auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: defaultScopes,
  });
}

export function getGoogleUrl(): string {
  const connection = createConnection();
  return getConnectionUrl(connection);
}
