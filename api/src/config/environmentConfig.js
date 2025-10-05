require('dotenv').config();

const env_configs = {
    ENVIRONMENT: process.env.ENVIRONMENT,
    API_VERSION: process.env.API_VERSION,
    CLIENT: process.env.CLIENT,
    SERVICE_PROVIDER: process.env.SERVICE_PROVIDER,
    ADMIN: process.env.ADMIN,
    BASE_URL: process.env.BASE_URL,
    PORT: process.env.PORT,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    DB_URI: process.env.DB_URI,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    OTP_HASH_SECRET: process.env.OTP_HASH_SECRET,
    ADMIN_INQUIRY_MAIL: process.env.ADMIN_INQUIRY_MAIL,
    MAIL_USERNAME: process.env.MAIL_USERNAME,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    ADMIN_FIRST_NAME: process.env.ADMIN_FIRST_NAME,
    ADMIN_LAST_NAME: process.env.ADMIN_LAST_NAME,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    SIGNIN_OTP_VERIFICATION: process.env.SIGNIN_OTP_VERIFICATION,
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
    FIREBASE_ADMIN_SA: process.env.FIREBASE_ADMIN_SA,
    EXPO_ACCESS_TOKEN: process.env.EXPO_ACCESS_TOKEN,
    WEBHOOK_ENDPOINT_URL: process.env.WEBHOOK_ENDPOINT_URL
};

module.exports = env_configs;