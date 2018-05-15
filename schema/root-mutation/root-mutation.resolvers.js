const { updateHotel } = require('../../models/hotel')
const { redis } = require('../../models')

const rootMutationResolvers = {
    // this corresponds to the `RootMutation.updateHotel` type
    async updateHotel(rootObj, { id, name }) {
        const freshData = updateHotel({ id, name })

        // invalidate cache
        process.nextTick(() => {
            const key = `hotel:${id}`
            redis.cachedExecute(
                { key, json: true, forceUpdate: true },
                () => freshData
            )
        })

        return freshData
    }
}

module.exports = { RootMutation: rootMutationResolvers }
