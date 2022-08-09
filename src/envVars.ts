export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;

export const BASENAME = process.env.REACT_APP_BASENAME as string;

const PRODUCTION_URL = process.env.REACT_APP_PRODUCTION_URL as string;
const DEVELOPMENT_URL = process.env.REACT_APP_DEVELOPMENT_URL as string;

const APP_ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT as string;

export const API_URL = APP_ENVIRONMENT === "production" ? PRODUCTION_URL : DEVELOPMENT_URL;