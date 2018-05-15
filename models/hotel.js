const debug = require('debug')('mt:details-api:models:hotel')
const { mysql } = require('./')

async function fetchHotelDetails(id) {
    debug('fetchHotelDetails')
    const data = await mysql('hotels')
        .select(
            'hot_id as id',
            'hot_name_temp as name',
            'hot_description_listing as desc',
            'hot_address_temp as address',
            'hot_category as rating',
            'hot_lat as lat',
            'hot_lng as lng',
            'hot_phone as phone',
            'hot_email as email',
            'hot_fax as fax',
            'hot_website as website',
            'hot_time_checkin as checkin',
            'hot_time_checkout as checkout',
            'hot_tripad_id as tripAdvisorId',

            'hot_area as areaId',
            'hot_districts as districtId',
            'hot_city as cityId',

            'hot_time_build as buildTime',
            'hot_time_repair as repairTime',

            'hot_atm_bank as bankName',
            'hot_atm_number as bankAccountNumber',
            'hot_atm_holder as bankHolder',
            'hot_contract_start as contractStart',
            'hot_contract_finish as contractFinish',
            'hot_contract_type as contractType',
            'hot_contract_code as contractCode',
            'hot_note_contact as contactName',
            'hot_invoice_company as invoiceCompany',
            'hot_invoice_address as invoiceAddr',
            'hot_invoice_send_address as invoiceSendAddr',
            'hot_tax_code as taxCode',

            'hot_pms_link as pmsUrl',
            'hot_pms_active as pmsActive',
            'hot_active_hms as hmsActive',

            'hot_ctrip_connect as ctripConnected'
        )
        .where('hot_id', id)
    if (data.length === 0) throw new Error(`hotel id ${id} not found`)
    else return data[0]
}

async function fetchPicturesByHotelId(hotelId) {
    debug('fetchPicturesByHotelId')
    const data = await mysql('hotels_picture')
        .select(
            'hop_id as id',
            'hop_hotel as hotelId',
            'hop_picture as url',
            'hop_order as order'
        )
        .where('hop_hotel', hotelId)
        .orderBy('hop_order', 'asc')

    return data
}

async function fetchConveniencesByHotelId(hotelId) {
    debug('fetchConveniencesByHotelId')
    const data = await mysql('hotels_conveniences')
        .innerJoin(
            'conveniences',
            'hotels_conveniences.hoc_convenience_id',
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
        .where('hotels_conveniences.hoc_hotel_id', hotelId)
        .orderBy('conveniences.con_order', 'asc')

    return data
}

async function fetchRankingByHotelId(hotelId) {
    debug('fetchRankingByHotelId', hotelId)
    const data = await mysql('hotels_rank')
        .select(
            'hor_id as _id',
            'hor_total_mark as totalMark',
            'hor_total_poll as totalPoll',
            'hor_avg as avg'
        )
        .where('hor_hotel_id', hotelId)
        .orderBy('hor_id', 'asc')

    return data.length === 0 ? {} : data[0]
}

async function fetchNearbyLocationsByHotelId(hotelId) {
    debug('fetchNearbyLocationsByHotelId', hotelId)
    const data = await mysql('locations_near_hotels')
        .innerJoin(
            'locations',
            'locations.loc_id',
            'locations_near_hotels.lnh_location_id'
        )
        .select(
            'locations.loc_id as id',
            'locations.loc_name_temp as name',
            'locations.loc_description as desc',
            'locations.loc_lat as lat',
            'locations.loc_lng as lng',
            'locations.loc_district_id as districtId',
            'locations.loc_city_id as cityId',
            'locations.loc_picture as pictureUrl'
        )
        .where('locations_near_hotels.lnh_hotel_id', hotelId)

    return data
}

async function updateHotel(hotel) {
    debug('updateHotel')
    await mysql('hotels')
        .where('hot_id', hotel.id)
        .update({
            hot_name_temp: hotel.name
        })

    return fetchHotelDetails(hotel.id)
}

module.exports = {
    fetchHotelDetails,
    fetchPicturesByHotelId,
    fetchConveniencesByHotelId,
    fetchRankingByHotelId,
    fetchNearbyLocationsByHotelId,
    updateHotel
}
