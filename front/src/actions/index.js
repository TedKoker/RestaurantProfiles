import axios from 'axios'
import {controllers} from '../config'
import {AUTH_USER, AUTH_ERROR} from './types'

export const signin = (formProps, callback, ...args) => async dispatch => {
    try {
        const response = await axios.post(controllers.signin, formProps)
        dispatch({type: AUTH_USER, payload: response.data.token})
        localStorage.setItem('token', response.data.token)
        callback(args)
    } catch {
        dispatch({type: AUTH_ERROR, payload: 'Something went wrong, check your credentials'})
    }
}