import axios from 'axios'
import {controllers} from '../config'
import {AUTH_USER, AUTH_ERROR} from './types'

export const signin = (formProps, callback, ...args) => async dispatch => {
    
    try {
        const response = await axios.post(controllers.signin, formProps)
        dispatch({type: AUTH_USER, payload: response.data.token})
        dispatch({type: AUTH_ERROR, payload: undefined})
        localStorage.setItem('token', response.data.token)
        callback(args)
    } catch(e) {
        dispatch({type: AUTH_ERROR, payload: e.response.data.message})
    }
}

export const nullifyAuthErrors = () => dispatch => {
    dispatch({type: AUTH_ERROR, payload: undefined})
}