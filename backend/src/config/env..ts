import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const PORT = process.env.PORT || 8080;
export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;