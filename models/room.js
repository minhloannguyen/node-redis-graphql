const debug = require('debug')('mt:details-api:models:hotel')
const { mysql } = require('./')

async function fetchRoomsByHotelId(hotelId) {
    debug('fetchRoomsByHotelId')
    const rooms = await mysql('rooms')
        .select(
            'rom_id as id',
            'rom_hotel as hotelID',
            'rom_name as name',
            'rom_price as price',
            'rom_person as maxCapacity',
            'rom_person_extra as maxExtraBed',
            'rom_children as maxChild',
            'rom_children_age_under as childAge',
            'rom_picture as pictureUrl',
            'rom_description as desc',
            'rom_stock_amount as availableCount',
            'rom_user_id as userId',
            'rom_type_bed as bedType',
            'rom_view as view',
            'rom_surcharge as surcharge',
            'rom_hotel as pmsRoomId',

            // flags
            'rom_delete as isDeleted',
            'rom_smoke as smoking',
            'rom_is_from_pms as isFromPMS'
        )
        .where('rom_hotel', hotelId)
        .andWhere('rom_delete', 0)

    return rooms
}

async function fetchCancellationsByRoomId(roomId) {
    return mysql('cancellation_policy')
        .select(
            'cap_id as id',
            'cap_time_from as from',
            'cap_time_to as to',
            'cap_cancel_policy_type as policyType',
            'cap_time_cancel_opt as cancelTime'
        )
        .where('cap_room_id', roomId)
        .andWhere('cap_delete', 0)
        .orderBy('cap_time_to', 'asc')
}

async function fetchConveniencesByRoomId(roomId) {
    debug('fetchConveniencesByRoomId')
    const data = await mysql('rooms_conveniences')
        .innerJoin(
            'conveniences',
            'rooms_conveniences.roc_convenience_id',
            'conveniences.con_id'
        )
        .select(
            'conveniences.con_id as id',
            'conveniences.con_name as name',
            'conveniences.con_name_param as param',
            'conveniences.con_value as value',
            'conveniences.con_type as type',
            'conveniences.con_hot as hot',
            'conveniences.con_active as active',
            'conveniences.con_landing as landing',
            'conveniences.con_class_bg as class',
            'conveniences.con_order as order',
            'conveniences.con_parent_id as parentId',
            'conveniences.con_group as groupId'
        )
        .where('rooms_conveniences.roc_room_id', roomId)
        .orderBy('conveniences.con_order', 'asc')

    return data
}

module.exports = {
    fetchRoomsByHotelId,
    fetchCancellationsByRoomId,
    fetchConveniencesByRoomId
}
