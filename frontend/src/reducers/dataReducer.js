import axios from 'axios'
const HOURLY_EVENTS = '/events/hourly'
const DAILY_EVENTS = '/events/daily'
const HOURLY_STATS = '/stats/hourly'
const DAILY_STATS = '/stats/daily'
const POIS = '/poi'
const FETCH_DATA_FAILED = 'FETCH_DATA_FAILED'

const initialState = {
    hourlyEvents: [],
    dailyEvents: [],
    hourlyStats: [],
    dailyStats: [],
    POIs: [],
    fetchDataFailed: false 
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case HOURLY_EVENTS:

            return {
                ...state,
                hourlyEvents: action.payload
            }
        case DAILY_EVENTS:
            return {
                ...state,
                dailyEvents: action.payload
            }
        case HOURLY_STATS:
            return {
                ...state,
                hourlyStats: action.payload
            }
        case DAILY_STATS:
            return {
                ...state,
                dailyStats: action.payload
            }
        case POIS:
            return {
                ...state,
                POIs: action.payload
            }
        case FETCH_DATA_FAILED:
            return {
                ...state,
                fetchDataFailed: true 
            }
        default:
            return state
    }
}


export const fetchData = (dispatch) => {
    const reqHandler = (url, dispatch) => {
        axios.get(url)
            .then(res => {
                dispatch({ type: url, payload: res.data })
            })
            .catch(e => {
                dispatch({ type: FETCH_DATA_FAILED, })
            })
    }
    console.log('fetch data');
    [DAILY_EVENTS, HOURLY_EVENTS, HOURLY_STATS, DAILY_STATS, POIS].forEach(async element => {
        await reqHandler(element, dispatch)
    })

}