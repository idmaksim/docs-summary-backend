export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  ACCESS_SECRET: process.env.ACCESS_SECRET,
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  GIGACHAT_API_KEY: process.env.GIGACHAT_API_KEY,
  GIGACHAT_AUTH_URL: process.env.GIGACHAT_AUTH_URL,
  GIGACHAT_BASE_URL: process.env.GIGACHAT_BASE_URL,
  GIGACHAT_REQUEST_ID: process.env.GIGACHAT_REQUEST_ID,
  REDIS_URL: process.env.REDIS_URL,
});
