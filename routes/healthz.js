const debug = require('debug')('mt:contents:routes:healthz')
const { mysql, redis } = require('../models')

const state = { isShutdown: false }

// health check and graceful shutdown
// should cover SIGINT as well http://pm2.keymetrics.io/docs/usage/signals-clean-restart/
process.on('SIGTERM', () => {
    state.isShutdown = true
})

function initiateGracefulShutdown() {
    debug('initiateGracefulShutdown')
    mysql.destroy(err => {
        process.exit(err ? 1 : 0)
    })
}

async function healthzHandler(ctx) {
    if (state.isShutdown) {
        debug('GET /healthz shutting down')
        setTimeout(initiateGracefulShutdown, 2000)
        ctx.throw(500, 'not ok')
    }

    try {
        await Promise.all([redis.ping(), mysql.select(1)])
        ctx.body = 'ok'
    } catch (err) {
        ctx.throw(500, 'not ok')
    }
}

module.exports = healthzHandler
