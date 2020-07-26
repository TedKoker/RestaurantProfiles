import React, { useCallback, useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {reduxForm, Field, SubmissionError } from 'redux-form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import {useWindowSize} from '../../shared/sharedLogic/useFunctions'
import * as actions from '../../actions'
import './auth.scss'
import '../../app.scss'

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
const passwordPattern = mustBePattern(passwordRegex, "Must contain: One lowertcase, one uppercase, one number, one spcial character")
const mustBeLong2 = mustBeLength(2)
const mustBeLong8 = mustBeLength(8)

function renderField(props) {
    const {
        input,
        type,
        placeholder,
        className,
        meta: {error, active, dirty, submitFailed}
    } = props


    return(
        <OverlayTrigger
            placement={props.direction}
            show={!active && error && (dirty || submitFailed)}
            trigger={null}
            overlay={
                 <Tooltip className="tooltip-error">
                     {error}
                 </Tooltip>
            }>
            <input {...input} className={className + (!active && error && (dirty || submitFailed) ? " error" : "")}
                    type={type} 
                    placeholder={placeholder}
                    />
        </OverlayTrigger>
    )
}

function responsiveRenderField(props) {
    const {
        input,
        type,
        placeholder,
        className,
        meta: {error, active, dirty, submitFailed}
    } = props

    return (
        <>
            <input {...input} className={className + (!active && error && (dirty || submitFailed) ? " error" : "")}
                        type={type} 
                        placeholder={placeholder}
            />
            <span className={(!active && error && (dirty || submitFailed) ? " error" : "")}>
                {!active && error && (dirty || submitFailed) ? error : undefined}
            </span>
        </>
    )
}

function Signup(props) {

    const onSubmit = useCallback((formProps) => {

        if(formProps.password !== formProps.confermPassword) {
            throw new SubmissionError({
                password: "Passwords must match",
                confermPassword: "Passwords must match"
            })
        }

        return new Promise(async (resolve, reject) => {
            let promiseResolved = false
            await props.signup(formProps, () => {
                promiseResolved = true
            })

            if(promiseResolved) {
                resolve()
            } else {
                reject()
            }
        })
    })

    const [winWidth] = useWindowSize()
    const [isResponsive, setResponsive] = useState(winWidth < 767 ? true : false)

    const loadingBtn = <Spinner
                            as="span"
                            animation="border"
                            size="lg"
                            role="status"
                            aria-hidden="true"
                        />

    useEffect(() => {
        setResponsive(winWidth < 767 ? true : false)
    },[winWidth])

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
                            component={isResponsive ? responsiveRenderField : renderField}
                            autoComplete="none"
                            className="form-control"
                            placeholder="Email"
                            validate={[required, emailPattern]}
                            direction="left"
                        />
                        <Field 
                            name="fName"
                            type="text"
                            component={isResponsive ? responsiveRenderField : renderField}
                            autoComplete="none"
                            className={"form-control " + (isResponsive ? "" : "half-width")}
                            placeholder="First Name"
                            validate={[required, mustBeLong2]}
                            direction="left"
                        />
                        <Field 
                            name="lName"
                            type="text"
                            component={isResponsive ? responsiveRenderField : renderField}
                            autoComplete="none"
                            className={"form-control " + (isResponsive ? "" : "half-width")}
                            placeholder="Last Name"
                            validate={[required, mustBeLong2]}
                            direction="right"
                        />
                        <Field 
                            name="password"
                            type="password"
                            component={isResponsive ? responsiveRenderField : renderField}
                            autoComplete="none"
                            className={"form-control " + (isResponsive ? "" : "half-width")}
                            placeholder="Password"
                            validate={[required, mustBeLong8, passwordPattern]}
                            direction="left"
                        />
                        <Field 
                            name="confermPassword"
                            type="password"
                            component={isResponsive ? responsiveRenderField : renderField}
                            autoComplete="none"
                            className={"form-control " + (isResponsive ? "" : "half-width")}
                            placeholder="Conferm Password"
                            validate={[required]}
                            direction="right"
                        />
                        <Button variant="primary" size="sm" type="submit" disabled={props.submitting}>
                            {!props.submitting ? 'Sign Un' : loadingBtn}
                        </Button>
                    </form>
                </Card.Body>
                <Card.Footer className="text-muted">Already a member? {" "}
                    <Link to="/signin">
                        Sign in
                    </Link>
                </Card.Footer>
            </Card>
        </div>
    )
}

export default compose(
    connect(null, actions),
    reduxForm({
        form: 'signup'
    })
)(Signup)