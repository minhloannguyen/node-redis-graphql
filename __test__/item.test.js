const test = require('tape')
const supertest = require('supertest')
const app = require('../')

const api = supertest.agent(app.callback())

test('POST /graphql should return 200 with data', t => {
    api
        .post('/graphql')
        .type('form')
        .send({
            query: `query {
                hotel (id: "17") {
                    id
                    name
                    ranking { totalMark, totalPoll, avg }
                    conveniences { id, name, landing, value, class }
                    pictures { id, url}
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
            t.ok(data.hotel.name)
            t.ok(data.hotel.ranking)
            t.ok(data.hotel.conveniences)
            t.ok(data.hotel.pictures)

            t.end()
        })
})
