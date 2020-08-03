import React, {useState, useEffect} from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {reduxForm, Field, SubmissionError } from 'redux-form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import {RequireAuth} from '../../shared/sharedLogic/HocComponents'
import {useWindowSize} from '../../shared/sharedLogic/useFunctions'
import * as actions from '../../actions'
import '../auth/auth.scss'
import '../../app.scss'

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

function AddRestuarant(props) {

    const [winWidth] = useWindowSize()
    const [isResponsive, setResponsive] = useState(winWidth < 767 ? true : false)

    const loadingBtn = <Spinner
                            as="span"
                            animation="border"
                            size="lg"
                            role="status"
                            aria-hidden="true"
                        />

    const onSubmit = (formProps) => {
        console.log(formProps)
    }

    useEffect(() => {
        setResponsive(winWidth < 767 ? true : false)
    },[winWidth])

    return (
        <Card className="text-center">
            <Card.Header>Open a new restuarant</Card.Header>
            <Card.Body>
                <form onSubmit={props.handleSubmit(onSubmit)}>
                    <Field 
                        name="name"
                        type="text"
                        component={isResponsive ? responsiveRenderField : renderField}
                        autoComplete="none"
                        className="form-control"
                        placeholder="Name"
                        //validate={[required, emailPattern]}
                        direction="left"
                    />
                    <Field 
                        name="location.city"
                        type="text"
                        component={isResponsive ? responsiveRenderField : renderField}
                        autoComplete="none"
                        className={"form-control " + (isResponsive ? "" : "half-width")}
                        placeholder="City"
                        //validate={[required, emailPattern]}
                        direction="left"
                    />
                    <Field 
                        name="location.adress"
                        type="text"
                        component={isResponsive ? responsiveRenderField : renderField}
                        autoComplete="none"
                        className={"form-control " + (isResponsive ? "" : "half-width")}
                        placeholder="Adress"
                        //validate={[required, emailPattern]}
                        direction="right"
                    />
                    <Button variant="primary" size="sm" type="submit" disabled={props.submitting}>
                        {!props.submitting ? 'Add Restuarant' : loadingBtn}
                    </Button>
                </form>
            </Card.Body>
        </Card>
    )
}

const exportedComponent = compose(
    connect(null, actions),
    reduxForm({
        form: 'addRestuarant'
    })
)(AddRestuarant)

export default RequireAuth(exportedComponent)