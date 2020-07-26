import axios from 'axios'
import {controllers} from '../config'
import {AUTH_USER, AUTH_ERROR, CONNECTED_USER, AUTH_SUCCESS} from './types'

export const userByToken = () => async dispatch => {
    console.log('inside user by token')
    const token = localStorage.getItem('token')
    const response = await axios.get(controllers.userByToken, {headers: {authorization: token}})
    dispatch({type: CONNECTED_USER, payload: response.data})
    localStorage.setItem('connectedUser', JSON.stringify(response.data))
}

export const signin = (formProps, callback, ...args) => async dispatch => { 
    try {
        const response = await axios.post(controllers.signin, formProps)
        dispatch({type: AUTH_USER, payload: response.data.token})
        dispatch({type: AUTH_ERROR, payload: undefined})
        localStorage.setItem('token', response.data.token)

        await userByToken()(dispatch)
        
        const {fName, lName} = JSON.parse(localStorage.getItem('connectedUser'))
        dispatch({type: AUTH_SUCCESS, payload: `Nice to see you again ${fName} ${lName}`})

        callback(args)
    } catch(e) {
        dispatch({type: AUTH_ERROR, payload: e.response.data.message})
    }
}

export const signup = (formProps, callback, ...args) => async dispatch => {
    try {
        const response = await axios.post(controllers.signup, formProps)
        dispatch({type: AUTH_USER, payload: response.data.token})
        dispatch({type: AUTH_ERROR, payload: undefined})
        localStorage.setItem('token', response.data.token)

        await userByToken()(dispatch)

        const {fName, lName} = JSON.parse(localStorage.getItem('connectedUser'))
        dispatch({type: AUTH_SUCCESS, payload: `We are happy that you joined us ${fName} ${lName}`})

        callback(args)
    } catch(e) {
        dispatch({type: AUTH_ERROR, payload: e.response.data.message})
    }
    
}

export const nullifyAuthErrors = () => dispatch => {
    dispatch({type: AUTH_ERROR, payload: undefined})
}