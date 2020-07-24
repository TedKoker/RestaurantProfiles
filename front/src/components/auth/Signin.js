import React, { useEffect, useCallback } from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {reduxForm, Field} from 'redux-form'
import { useHistory } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import './auth.scss'
//import 'bootstrap/dist/css/bootstrap.min.css';

import * as actions from '../../actions'

function Signin(props) {

    const history = useHistory()

    const loadingBtn = <Spinner
                            as="span"
                            animation="border"
                            size="lg"
                            role="status"
                            aria-hidden="true"
                        />

    const onSubmit = useCallback(async (formProps) => {
        return new Promise(async (resolve, reject) => {
            let promiseResolved = false
            await props.signin(formProps, () => {
                promiseResolved = true
            })
            if(promiseResolved) {
                resolve()
            } else {
                reject()
            }
        })
    })

    const {handleSubmit } = props

    return (
        <Card className="text-center">
            <Card.Header>We are wating for you</Card.Header>
            <Card.Body>
                <Card.Title>Sign in</Card.Title>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Field 
                        name="email"
                        type="text"
                        component="input"
                        autoComplete="none"
                        className="form-control"
                        placeholder="Email"
                    />
                    <Field 
                        name="password"
                        type="password"
                        component="input"
                        autoComplete="none"
                        className="form-control"
                        placeholder="Password"
                    />
                    <Button variant="primary" size="sm" type="submit" disabled={props.submitting}>
                        {!props.submitting ? 'Sign In' : loadingBtn}
                    </Button>
                </form>
                {props.errorMessage}
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