import axios from 'axios'
import {controllers} from '../config'
import {AUTH_USER} from './types'

export const signin = (formProps, callback) => async dispatch => {
    try {
        const response = await axios.post(controllers.signin, formProps)
        dispatch({type: AUTH_USER, payload: response.data.token})
        localStorage.setItem('token', response.data.token)
        callback()
    } catch {
        //add errors
    }
}