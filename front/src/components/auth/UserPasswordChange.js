import React, {useCallback, useState, useEffect} from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {reduxForm, Field, SubmissionError} from 'redux-form'
import Button from 'react-bootstrap/Button'
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

const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/

const passwordPattern = mustBePattern(passwordRegex, "Must contain: One lowertcase, one uppercase, one number, one spcial character")
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

function UserPasswordChange(props) {

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

    const onSubmit = useCallback((formProps) => {
        if(formProps.password !== formProps.confermPassword) {
            throw new SubmissionError({
                password: "Passwords must match",
                confermPassword: "Passwords must match"
            })
        }
        const fixedProps = (({password}) => {return {newPassword: password}})(formProps)
        console.log(fixedProps)
        return new Promise(async (resolve, reject) => {
            let resolved = false
            await props.passwordChange(fixedProps, () => {
                resolved = true
            })

            if(resolved) {
                resolve()
            } else {
                reject()
            }
        })
    })

    return (
        <form onSubmit={props.handleSubmit(onSubmit)}>
            <Field 
                name="password"
                type="password"
                component={isResponsive ? responsiveRenderField : renderField}
                autoComplete="none"
                className="form-control"
                placeholder="Password"
                validate={[required, mustBeLong8, passwordPattern]}
                direction="left"
            />
            <Field 
                name="confermPassword"
                type="password"
                component={isResponsive ? responsiveRenderField : renderField}
                autoComplete="none"
                className="form-control"
                placeholder="Conferm password"
                validate={[required]}
                direction="left"
            />
            <Button variant="primary" size="sm" type="submit" disabled={props.submitting}>
                {!props.submitting ? 'Change Password' : loadingBtn}
            </Button>
        </form>
    )
}

export default compose(
    connect(null, actions),
    reduxForm({form: 'passwordChange'})
)(UserPasswordChange)