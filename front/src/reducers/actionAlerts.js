import { ACTION_SUCCEED, ACTION_FAILD } from '../actions/types'

export default function(state = {}, action) {
    switch(action.type) {
        case ACTION_SUCCEED:
            return {...state, actionSucceed: action.payload}
        case ACTION_FAILD:
            return {...state, actionFaild: action.payload}
        default:
            return state
    }
}