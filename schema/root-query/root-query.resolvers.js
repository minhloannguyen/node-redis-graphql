const debug = require('debug')('mt:detailsapi:root-resolver')
const { redis } = require('../../models')
const { fetchHotelDetails } = require('../../models/hotel')
const { populateCache, parseReply } = require('../../utils/autocomplete')
const { fetchTourById } = require('../../models/tour')
const bookingResolvers = require('../booking/booking.resolvers')

const rootQueryResolvers = {
    async hotel(rootObj, { id }) {
        debug('hotel id', id)
        const key = `hotel:${id}`
        const data = await redis.cachedExecute({ key, json: true }, () =>
            fetchHotelDetails(id)
        )

        return data
    },
    async hotels() {
        return [{ id: 1, name: 'name' }]
    },
    async suggestions(rootObj, { query, limit }) {
        debug('suggestions', query, limit)
        const info = await redis.call('command', 'info', 'ft.search')
        // if command is not available, redis return an array size 1 with null item
        if (Array.isArray(info) && info.length === 1 && info[0] === null) {
            throw new Error('redis server 4.x with redisearch plugin required')
        }

        const indexName = 'autocomplete'
        const cacheExists = await redis.get(`${indexName}:cache:populated`)
        if (!cacheExists) {
            await populateCache(indexName)
            await redis.set(`${indexName}:cache:populated`, 1)
        }
        const args = [
            'FT.SEARCH',
            indexName,
            query.toLowerCase(),
            'WITHSCORES',
            'SLOP',
            '1',
            'INORDER',
            'VERBATIM',
            'LIMIT',
            0,
            limit || 10
        ]
        let reply = await redis.call(...args)
        reply = parseReply(reply)

        return reply
    },

    async tour(rootObj, {id})
    {
        const key = `tour:${id}`
        const tour = await redis.cachedExecute({ key, json: true }, () =>
            fetchTourById(id)
        )

        return tour 
    },
    booking: bookingResolvers
}


module.exports = { RootQuery: rootQueryResolvers }
