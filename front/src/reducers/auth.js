import { AUTH_USER} from '../actions/types'

export default function (state = {}, action) {
    //console.log('reducer state:',action)
    switch(action.type) {
        case AUTH_USER:
            //console.log('inside auth_user')
            return {...state, authenticated: action.payload}
        default:
            return state
    }
}