import { ACTION_SUCCEED } from '../actions/types'

export default function(state = {}, action) {
    switch(action.type) {
        case ACTION_SUCCEED:
            return {...state, actionSucceed: action.payload}
        default:
            return state
    }
}