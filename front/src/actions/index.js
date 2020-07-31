import axios from 'axios'
import {controllers} from '../config'
import {AUTH_USER, AUTH_ERROR, CONNECTED_USER, AUTH_SUCCESS, ACTION_SUCCEED, ACTION_FAILD} from './types'

export const userByToken = () => async dispatch => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.get(controllers.userByToken, {headers: {authorization: token}})
        dispatch({type: CONNECTED_USER, payload: response.data})
        localStorage.setItem('connectedUser', JSON.stringify(response.data))
    } catch(e) {
        dispatch({type: AUTH_ERROR, payload: e.response.data.message})
    }
    
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

export const editProfile = (formProps, callback, ...args) => async dispatch => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.put(controllers.editUser,formProps, {headers: {authorization: token}})
        dispatch({type: CONNECTED_USER, payload: response.data})
        localStorage.setItem('connectedUser', JSON.stringify(response.data))
        dispatch({type: ACTION_SUCCEED, payload: 'Profile updated'})
        callback(args)
    } catch(e) {
        dispatch({type: ACTION_FAILD, payload: e.response.data.message})
    }
}

export const passwordChange = (formProps, callback, ...args) => async dispatch => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.put(controllers.passwordChange,formProps, {headers: {authorization: token}})
        dispatch({type: ACTION_SUCCEED, payload: 'Password updated'})
        callback(args)
    }catch(e) {
        console.log(e.response.data)
        dispatch({type: ACTION_FAILD, payload: e.response.data.message})
    }
}



export const nullifyAuthErrors = () => dispatch => {
    dispatch({type: AUTH_ERROR, payload: undefined})
    dispatch({type: AUTH_SUCCESS, payload: undefined})
    dispatch({type: ACTION_FAILD, payload: undefined})
    dispatch({type: ACTION_SUCCEED, payload: undefined})
}