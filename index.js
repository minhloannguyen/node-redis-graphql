require('dotenv-safe').config()

if (process.env.NEWRELIC_LICENSE_KEY) {
    // eslint-disable-next-line
    require('newrelic')
}

const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-bodyparser')
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')
const schema = require('./schema/schema')
const { port, env } = require('./config')
const authHandler = require('./routes/auth')
const healthzHandler = require('./routes/healthz')

const app = new Koa()
const router = new Router()

const graphqlOptions = ctx => ({
    schema,
    context: () => ({ ctx })

    // TODO: disable for now
    // const {request: { header }} = ctx
    // if (header && header.authorization) {
    //     try {
    //         const payload = jwt.decode(header.authorization, secret)
    //         if (payload.valid < moment().unix()) {
    //             throw new Error('expired token')
    //         }

    //         return { user: payload }
    //     } catch (err) {
    //         log.error({name: 'authorization'}, err)
    //         throw new Error('expired/invalid token')
    //     }
    // } else {
    //     log.error({name: 'missing-token'})
    //     throw new Error('missing `authorization:` token in header')
    // }
})

router.post('/graphql', koaBody(), graphqlKoa(graphqlOptions))
router.get('/graphql', graphqlKoa(graphqlOptions))

router.post('/generate-token', koaBody(), authHandler)
router.get('/healthz', koaBody(), healthzHandler)

// enable graphiql only on development environment
if (env === 'development') {
    router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))
}

app.use(router.routes())
app.use(router.allowedMethods())
if (!module.parent) app.listen(port)
module.exports = app
