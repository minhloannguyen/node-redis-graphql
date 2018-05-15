const deburr = require('../utils/deburr')

const test = require('tape')

test('deburr() tests', t => {
    t.equal(deburr('khách sạn đông phương'), 'khach san dong phuong')
    t.end()
})
