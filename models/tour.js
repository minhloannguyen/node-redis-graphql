const debug = require('debug')('mt:details-api:models:tour')
const { mysql } = require('./')

async function fetchTourById(tourId) {
    debug('fetchTourById')
    const tours = await mysql('tours')
        .select(
            'tou_id as id',
            'tou_name as name'
        )
        .where('tou_id', tourId)

    if (tours.length === 0) {
        throw new Error(`tour ${tourId} not found`)
    }

    return tours[0]
}


module.exports = {
    fetchTourById
}
