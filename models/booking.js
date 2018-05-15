const debug = require('debug')('mt:details-api:models:booking')
const { mysql } = require('./')

async function fetchBookingById(bookingId) {
    debug('fetchBookingById')
    const booking = await mysql('booking')
        .select(
            'boo_id as id',
            'boo_hotel as hotelId',
            'boo_room as roomId'
        )
        .where('boo_id', bookingId)

    if (booking.length === 0) {
        throw new Error(`booking ${bookingId} not found`)
    }

    return booking[0]
}


module.exports = {
    fetchBookingById
}
