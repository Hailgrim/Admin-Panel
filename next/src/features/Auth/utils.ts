import { ROUTES } from '@/shared/lib/constants';

/**
 * @param {string} state Random string
 * @returns {boolean} Google Login URL
 */
export const getGoogleSignInUrl = (state: string): string => {
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  url += `?client_id=${encodeURIComponent(process.env.GOOGLE_CLIENT_ID!)}`;
  url += `&redirect_uri=${encodeURIComponent(
    `https://${process.env.HOST}${ROUTES.ui.signInGoogle}`
  )}`;
  url += `&scope=${encodeURIComponent(
    'https://www.googleapis.com/auth/userinfo.profile'
  )}`;
  url += `&state=${encodeURIComponent(state)}`;
  url += '&include_granted_scopes=true';
  url += '&response_type=token';
  return url;
};