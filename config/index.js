const config = {
    env: process.env.NODE_ENV,
    secret: process.env.APP_SECRET,
    port: process.env.PORT || 3000,
    mysqlConnectionUrl: process.env.MYSQL_CONNECTION_URL,
    mysqlMaxConnection: parseInt(process.env.MYSQL_MAX_CONNECTION) || 10,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisDb: process.env.REDIS_DB,
    redisPassword: process.env.REDIS_PASSWORD,
    redisPrefix: process.env.REDIS_PREFIX,
    defaultCacheDuration: process.env.DEFAULT_CACHE_DURATION,
    bypassRedis: process.env.BYPASS_REDIS
}

module.exports = config
