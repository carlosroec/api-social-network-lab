import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();

if (!envFound) {
    throw new Error(".env file not found");
}

export default {
    port: parseInt(process.env.PORT, 10),
    api: {
        prefix: '/api',
    },
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
    databaseURL: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET
};
