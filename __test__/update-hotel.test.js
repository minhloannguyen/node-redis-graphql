const test = require('tape')
const supertest = require('supertest')
const crypto = require('crypto')
const app = require('../')

const api = supertest.agent(app.callback())

const randomName = crypto.randomBytes(20).toString('hex')

test('updateHotel() test', t => {
    api
        .post('/graphql')
        .type('form')
        .send({
            query: `mutation {
                updateHotel (id: "17", name: "${randomName}") {
                    id
                    name
                }
            }
        `
        })
        .expect(200)
        .end((err, res) => {
            if (err) throw err
            const {
                body: { data }
            } = res

            t.ok(data.updateHotel.id === '17')
            t.ok(
                data.updateHotel.name === randomName,
                `new name is updated to ${randomName}`
            )

            t.end()
        })
})
