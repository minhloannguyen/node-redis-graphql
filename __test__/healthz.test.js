const test = require('tape')
const supertest = require('supertest')
const app = require('../')

const api = supertest.agent(app.callback())

test('GET /healthz should return 200', t => {
    api
        .get('/healthz')
        .expect(200)
        .end(err => {
            if (err) throw err
            t.end()
        })
})
