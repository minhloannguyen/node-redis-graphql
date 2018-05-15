const debug = require('debug')('mt:detailsapi:schema:room')
const { redis } = require('../../models')
const {
    fetchCancellationsByRoomId,
    fetchConveniencesByRoomId
} = require('../../models/room')

const roomResolvers = {
    async cancellations(room) {
        debug('cancellations resolver')
        const key = `room:${room.id}:cancellation`
        const cancellations = await redis.cachedExecute(
            {
                key,
                json: true
            },
            () => fetchCancellationsByRoomId(room.id)
        )
        return cancellations
    },
    async conveniences(room) {
        debug('room conveniences resolver')
        const key = `room:${room.id}:convenience`
        const cancellations = await redis.cachedExecute(
            {
                key,
                json: true
            },
            () => fetchConveniencesByRoomId(room.id)
        )
        return cancellations
    }
}

module.exports = { Room: roomResolvers }
