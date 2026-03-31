import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const frontendPort = process.env.PORT ?? "3000";
const backendPort = process.env.VITE_BACKEND_PORT ?? "3001";

export const APP_BASE_URL = `http://localhost:${frontendPort}`;
export const API_BASE_URL = `http://localhost:${backendPort}`;
export const DEFAULT_USER_PASSWORD = process.env.SEED_DEFAULT_USER_PASSWORD ?? "s3cret";
