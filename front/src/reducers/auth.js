import { AUTH_USER, AUTH_ERROR, CONNECTED_USER, AUTH_SUCCESS} from '../actions/types'

export default function (state = {}, action) {
    //console.log('reducer state:',action)
    switch(action.type) {
        case AUTH_USER:
            //console.log('inside auth_user')
            return {...state, authenticated: action.payload}
        case AUTH_ERROR:
            return {...state, errorMessage: action.payload}
        case CONNECTED_USER:
            return {...state, connectedUser: action.payload}
        case AUTH_SUCCESS:
            return {...state, successMessage: action.payload}
        default:
            return state
    }
}