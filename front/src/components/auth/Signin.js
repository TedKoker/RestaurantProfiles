import React, { useEffect, useCallback } from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {reduxForm, Field} from 'redux-form'
import { useHistory } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import './signin.scss'
//import 'bootstrap/dist/css/bootstrap.min.css';

import * as actions from '../../actions'

function Signin(props) {

    const history = useHistory()

    const onSubmit = useCallback((formProps) => {
        return new Promise((resolve, reject) => {
            props.signin(formProps, () => {
                console.log('in')
            })
            if(props.errorMessage) {
                reject()
            } else {
                resolve()
            }
        })
    })

    const {handleSubmit, submitting } = props

    useEffect(() => {
        console.log("subnitting", props.submitting)
    },[props.submitting])

    return (
        <Card className="text-center">
            <Card.Header>We are wating for you</Card.Header>
            <Card.Body>
                <Card.Title>Sign in</Card.Title>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset>
                        <Field 
                            name="email"
                            type="text"
                            component="input"
                            autoComplete="none"
                            className="form-control"
                            placeholder="Email"
                        />
                    </fieldset>
                    <fieldset>
                        <Field 
                            name="password"
                            type="password"
                            component="input"
                            autoComplete="none"
                            className="form-control"
                            placeholder="Password"
                        />
                    </fieldset>
                    <Button variant="primary" size="sm" type="submit">
                        Sign in
                    </Button>
                    {props.errorMessage}
                </form>
                <Card.Footer className="text-muted">Not a Member? Sign up</Card.Footer>
            </Card.Body>
        </Card>
    )
}

function mapToProps(state) {
    return {errorMessage: state.auth.errorMessage}
}

export default compose(
    connect(mapToProps, actions),
    reduxForm({form: 'signin'})
)(Signin)