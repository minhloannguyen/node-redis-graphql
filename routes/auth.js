const debug = require('debug')('mt:contents:routes:auth')
const jwt = require('jwt-simple')
const moment = require('moment')
const log = require('pino')()
const { redis } = require('../models')
const { fetchUser } = require('../models/user')
const { secret } = require('../config')

async function authHandler(ctx) {
    debug('authHandler')
    try {
        const {
            request: { body }
        } = ctx
        if (!body.loginName || !body.password) {
            ctx.throw('missing params', 400)
        }

        const { loginName, password } = body
        const key = `user:${loginName}`
        const user = await redis.cachedExecute(
            {
                key,
                json: true,
                ttl: '1d'
            },
            () => fetchUser(loginName, password)
        )

        if (!user) {
            throw new Error(`${loginName} doesn't exist`)
        }
        const payload = {
            ...user,
            valid: moment()
                .add('7', 'days')
                .unix()
        }
        const token = jwt.encode(payload, secret)

        ctx.body = { token }
    } catch (err) {
        log.error({ name: 'auth-error' }, err)
        ctx.throw('Internal server error', 500)
    }
}

module.exports = authHandler
