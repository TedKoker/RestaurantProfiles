import React, { useEffect, useCallback } from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {reduxForm, Field} from 'redux-form'
import { useHistory } from 'react-router-dom'

import * as actions from '../../actions'

function Signin(props) {

    const history = useHistory()

    const onSubmit = useCallback((formProps) => {
        props.signin(formProps, () => {

        })
    })

    const {handleSubmit} = props

    useEffect(() => {
        //console.log(props)
        //
    },[])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
                <label>Email</label>
                <Field 
                    name="email"
                    type="text"
                    component="input"
                    autoComplete="none"
                />
            </fieldset>
            <fieldset>
                <label>Password</label>
                <Field 
                    name="password"
                    type="password"
                    component="input"
                    autoComplete="none"
                />
            </fieldset>
            <button>
                Sign In
            </button>
        </form>
    )
}

export default compose(
    connect(null, actions),
    reduxForm({form: 'signin'})
)(Signin)