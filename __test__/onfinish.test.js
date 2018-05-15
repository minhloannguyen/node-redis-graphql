const test = require('tape')
const { mysql, redis } = require('../models')

test.onFinish(async () => {
    await Promise.all([mysql.destroy(), redis.quit()])
})
