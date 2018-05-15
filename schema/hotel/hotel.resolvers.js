const debug = require('debug')('mt:detailsapi:schema:hotel')
const { redis } = require('../../models')
const {
    fetchPicturesByHotelId,
    fetchConveniencesByHotelId,
    fetchRankingByHotelId,
    fetchNearbyLocationsByHotelId
} = require('../../models/hotel')
const { fetchRoomsByHotelId } = require('../../models/room')

const hotelResolvers = {
    async pictures(hotel, { limit }) {
        debug('pictures resolver')
        const key = `hotel:${hotel.id}:picture`
        const data = await redis.cachedExecute({ key, json: true }, () =>
            fetchPicturesByHotelId(hotel.id)
        )
        return data.slice(0, limit)
    },
    async conveniences(hotel, { limit }) {
        debug('convenience resolver')
        const key = `hotel:${hotel.id}:convenience`
        const data = await redis.cachedExecute({ key, json: true }, () =>
            fetchConveniencesByHotelId(hotel.id)
        )
        return data.slice(0, limit)
    },
    async ranking(hotel) {
        debug('ranking resolver')
        const key = `hotel:${hotel.id}:ranking`
        const data = await redis.cachedExecute(
            {
                key,
                json: true
            },
            () => fetchRankingByHotelId(hotel.id)
        )
        return data
    },
    async nearbyLocations(hotel, { limit }) {
        debug('nearbyLocations resolver')
        const key = `hotel:${hotel.id}:nearbylocation`
        const locations = await redis.cachedExecute(
            {
                key,
                json: true
            },
            () => fetchNearbyLocationsByHotelId(hotel.id)
        )
        return locations.slice(0, limit)
    },
    async rooms(hotel) {
        debug('nearbyLocations resolver')
        const key = `hotel:${hotel.id}:rooms`
        const rooms = await redis.cachedExecute(
            {
                key,
                json: true
            },
            () => fetchRoomsByHotelId(hotel.id)
        )
        return rooms
    }
}

module.exports = { Hotel: hotelResolvers }
