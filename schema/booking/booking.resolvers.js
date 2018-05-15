const debug = require('debug')('mt:detailsapi:schema:booking')
const { redis } = require('../../models')
const { fetchBookingById } = require('../../models/booking')

async function booking(rootObj, {id}) {
    // debug('booking resolver')

    const key = `booking:${id}`
    const booking = await redis.cachedExecute({ key, json: true }, () =>
        fetchBookingById(id)
    )

    return booking 
    // return {id: 1, hotelId: 1}
}

module.exports = booking
