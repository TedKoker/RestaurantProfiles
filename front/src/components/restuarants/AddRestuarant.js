import React, {useState, useEffect, useRef} from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {reduxForm, Field, FormSection, formValues  , SubmissionError } from 'redux-form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import {RequireAuth} from '../../shared/sharedLogic/HocComponents'
import {useWindowSize} from '../../shared/sharedLogic/useFunctions'
import * as actions from '../../actions'
import MenuAdding from './MenuAdding'
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

function selectList(props) {

    const {input} = props

    const addContent =  <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-file-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4 1h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4z"/>
                            <path fillRule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>
                        </svg>

    /**If option is selected, there will be trash can near her to delete the option */
    return (
        <div className="list" style={{width: "100%"}}>
            <select size="8" name="" className="form-control" style={{padding:0}} {...input}>
                <option disabled className="list-header">Category</option>
                {props.values.map((val, index, array) => {
                    return (<option key={index} value={val}>{val}</option>)
                })}
            </select>
            <button>
                {addContent}
            </button>
        </div>
    )
}

function AddRestuarant(props) {

    const [winWidth] = useWindowSize()
    const [isResponsive, setResponsive] = useState(winWidth < 767 ? true : false)
    const [menuObj] = useState({})
    const categories = ["one", "two", "three"]

    const loadingBtn = <Spinner
                            as="span"
                            animation="border"
                            size="lg"
                            role="status"
                            aria-hidden="true"
                        />

    const onSubmit = (formProps) => {
        /**map the menu object */
        formProps.menu = menuObj
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
                    <FormSection name="menu" component={(props) => (<>{props.children}</>)}>
                        <Field  
                            name="category"
                            component={selectList}
                            //autoComplete="none"
                            values={categories}
                            onChange={(e) => {
                                menuObj[e.target.value] = []
                            }}
                        />
                        <MenuAdding changeFunc={(event, value, preValue, property) => {
                            const objProp = property.replace(/(.*)\./,"")
                            menuObj[objProp].push(value)
                        }}/>
                    </FormSection>
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
