import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Define and export your environment variables
export const LENS_API_URL = process.env.LENS_API_URL;
export const WALLET_PK = process.env.WALLET_PK;
export const PROFILE_ID = process.env.PROFILE_ID;
export const PROFILE_ADRESS = process.env.PROFILE_ADDRESS;
