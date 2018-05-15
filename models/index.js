const Redis = require('ioredis')
const ms = require('ms')
const knex = require('knex')
const config = require('../config')

const mysql = knex({
    client: 'mysql2',
    connection: config.mysqlConnectionUrl,
    pool: { min: 1, max: config.mysqlMaxConnection }
})

const redis = new Redis({
    host: config.redisHost,
    port: config.redisPort,
    db: config.redisDb,
    password: config.redisPassword,
    keyPrefix: config.redisPrefix
})

async function cachedExecute(
    {
        key,
        ttl = config.defaultCacheDuration,
        json = false,
        forceUpdate = false
    },
    fn
) {
    if (config.bypassRedis) {
        const data = await fn()
        return json ? JSON.parse(data) : data
    }

    let time = ttl
    if (!(typeof time === 'number') && !(typeof time === 'string')) {
        throw new TypeError(
            `expecting ttl to be number (second) or string, got ${typeof time}`
        )
    }

    if (typeof time === 'string') {
        time = ms(time) / 1000
    }

    async function load() {
        const val = await fn()
        redis.set(key, json ? JSON.stringify(val) : val, 'EX', time)
        return val
    }

    if (forceUpdate) return load()

    const cached = await redis.get(key)
    if (!cached) return load()

    return json ? JSON.parse(cached) : cached
}

redis.cachedExecute = cachedExecute

module.exports = { mysql, redis }
