import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'

import auth from './auth'
import actionAlert from './actionAlerts'

export default combineReducers({
    auth,
    actionAlert,
    form: formReducer
})