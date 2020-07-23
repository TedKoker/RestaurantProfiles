import React, { useCallback, useState } from 'react'
import {compose} from 'redux'
import {reduxForm, Field, SubmissionError } from 'redux-form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import './auth.scss'

const required = (value) => {
    if(value) {
        return false
    } else {
        return 'field is required'
    }
}

const mustBePattern = (regex, errMessage) => value => {
    if(regex.test(value)) {
        return false
    } else {
        return errMessage
    }
}

const mustBeLength = number => value => {
    if(value.length < number) {
        return `Must be at least ${number} characters long`
    } else {
        return false
    }
}

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/

const emailPattern = mustBePattern(emailRegex, "Must be a valid email")
const passwordPattern = mustBePattern(passwordRegex, "Must contain: One lowertcase, one uppercase, one number, one spcil character")
const mustBeLong2 = mustBeLength(2)
const mustBeLong8 = mustBeLength(8)

const showErrorLogic = (meta) => {
    const {error, submitFailed, dirty} = meta

    if(dirty) {
        return error ? true : false
    }
    else {
        return submitFailed ? true : false
    }
}

function renderField(props) {
    const {
        input,
        input:{onFocus},
        type,
        placeholder,
        className,
        meta,
        meta: {error}
    } = props

    const focusHandler = (e) => {
        console.log(props)
    }

    return(
        <OverlayTrigger
            placement="left"
            show={showErrorLogic(meta)}
            overlay={
                 <Tooltip>
                     {error}
                 </Tooltip>
            }>
            <input {...input} className={className}
                    type={type} 
                    placeholder={placeholder}
                    //onFocus={focusHandler}
                    />
        </OverlayTrigger>
    )
}

function Signup(props) {

    const onSubmit = useCallback((formProps) => {
        console.log('on submit')
    })

    const [showErrors, setErrors] = useState(false)

    return (
        <div>
            <Card className="text-center">
                <Card.Header>Join us</Card.Header>
                <Card.Body>
                    <Card.Title>Sign up</Card.Title>
                    <form onSubmit={props.handleSubmit(onSubmit)}>
                        <Field 
                            name="email"
                            type="text"
                            component={renderField}
                            autoComplete="none"
                            className="form-control"
                            placeholder="Email"
                            validate={[required, emailPattern]}
                        />
                        <Field 
                            name="fName"
                            type="text"
                            component={renderField}
                            autoComplete="none"
                            className="form-control half-width"
                            placeholder="First Name"
                            validate={[required, mustBeLong2]}
                        />
                        <Field 
                            name="lName"
                            type="text"
                            component={renderField}
                            autoComplete="none"
                            className="form-control half-width"
                            placeholder="Last Name"
                            validate={[required, mustBeLong2]}
                        />
                        <Field 
                            name="password"
                            type="password"
                            component={renderField}
                            autoComplete="none"
                            className="form-control half-width"
                            placeholder="Password"
                            validate={[required, mustBeLong8, passwordPattern]}
                        />
                        <Field 
                            name="confermPassword"
                            type="password"
                            component={renderField}
                            autoComplete="none"
                            className="form-control half-width"
                            placeholder="Conferm Password"
                            validate={[required]}
                        />
                        <Button variant="primary" size="sm" type="submit">
                            Sign Up
                        </Button>
                    </form>
                </Card.Body>
                <Card.Footer>Already a member? Sign in</Card.Footer>
            </Card>
        </div>
    )
}

export default compose(
    reduxForm({
        form: 'signup',
        onSubmitSuccess: () => {
            console.log("success")
        },
        onSubmitFail: (e) => {
            console.log('fails', e)
        },
        enableReinitialize: true
    })
)(Signup)