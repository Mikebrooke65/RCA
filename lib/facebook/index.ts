// Facebook Graph API Integration
const APP_ID = process.env.FACEBOOK_APP_ID;
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const GROUP_ID = process.env.FACEBOOK_GROUP_ID;

export async function getAccessToken() {
  const response = await fetch(
    `https://graph.facebook.com/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&grant_type=client_credentials`
  );
  const data = await response.json();
  return data.access_token;
}

export async function generateGroupInviteLink() {
  const token = await getAccessToken();
  // Note: Requires group admin permissions
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${GROUP_ID}?fields=link&access_token=${token}`
  );
  const data = await response.json();
  return data.link;
}

export async function getGroupMembers() {
  const token = await getAccessToken();
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${GROUP_ID}/members?access_token=${token}`
  );
  return await response.json();
}
