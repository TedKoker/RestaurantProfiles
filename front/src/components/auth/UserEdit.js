import React, { useCallback, useEffect, useState } from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {reduxForm, Field} from 'redux-form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import RequireAuth from '../../shared/sharedLogic/HocComponents'
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

const emailPattern = mustBePattern(emailRegex, "Must be a valid email")
const mustBeLong2 = mustBeLength(2)

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

function UserEdit(props) {

    const [winWidth] = useWindowSize()
    const [isResponsive, setResponsive] = useState(winWidth < 767 ? true : false)

    const onSubmit = useCallback((formProps) => {
        return new Promise(async (resolve, reject) => {
            let resolved = false
            await props.editProfile(formProps, () => {
                resolved = true
            })

            if(resolved) {
                resolve()
            } else {
                reject()
            }
        })
    })

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
            {/* Add field that will show user's restuaratns,
                on click of each resturant it will take him the the page /profile/:restuarantId
                if the user doesn't own the restuarantId, it will redirect back to /profile.
             */}
            <Button variant="primary" size="sm" type="submit" disabled={props.submitting}>
                {!props.submitting ? 'Update' : loadingBtn}
            </Button>
        </form>
    )
}

function mapToProps(state) {
    if(state.auth.connectedUser) {
        const {email, fName, lName} = state.auth.connectedUser
    
        return {
            initialValues: {
                email, fName, lName
            }
        }
    }

    return {}
}

export default compose(
    connect(mapToProps, actions),
    reduxForm({form: 'userEdir'})
)(UserEdit)