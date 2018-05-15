const test = require('tape')
const supertest = require('supertest')
const app = require('../')

const api = supertest.agent(app.callback())

test('limit should ... well limit', t => {
    api
        .post('/graphql')
        .type('form')
        .send({
            query: `query {
                hotel (id: "17") {
                    id
                    nearbyLocations(limit: 5) { id, name }
                    pictures(limit: 5) { id, url }
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

            t.ok(data.hotel.id)
            t.ok(data.hotel.nearbyLocations)
            t.ok(data.hotel.pictures)
            t.ok(data.hotel.pictures.length <= 5)
            t.ok(data.hotel.nearbyLocations.length <= 5)

            t.end()
        })
})
