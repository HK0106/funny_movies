export const env = {
  server: {
    environment: process.env.NODE_ENV || "development",
    host: process.env.SERVER_HOST || "127.0.0.1",
    port: process.env.SERVER_PORT || 3000,
  },
  database: {
    host: process.env.DATABASE_HOST || "127.0.0.1",
    replicationHost:
      process.env.DATABASE_REPLICATION_HOST || process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || "3306",
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    dialect: process.env.DATABASE_DIALECT,
    pool: {
      max: Number(process.env.DATABASE_POOL_MAX),
      min: Number(process.env.DATABASE_POOL_MIN),
      acquire: process.env.DATABASE_POOL_ACQUIRE,
      idle: process.env.DATABASE_POOL_IDLE,
    },
  },
  token: {
    privateKey: process.env.TOKEN_PRIVATE_KEY,
    expiresIn: Number(process.env.TOKEN_EXPIRES_IN) || 86400,
  },
};
