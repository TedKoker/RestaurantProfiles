import { AUTH_USER, AUTH_ERROR} from '../actions/types'

export default function (state = {}, action) {
    //console.log('reducer state:',action)
    switch(action.type) {
        case AUTH_USER:
            //console.log('inside auth_user')
            return {...state, authenticated: action.payload}
        case AUTH_ERROR:
            return {...state, errorMessage: action.payload}
        default:
            return state
    }
}