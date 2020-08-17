import React, {useState, useEffect, useRef} from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {reduxForm, Field, FormSection  } from 'redux-form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import {useWindowSize} from '../../shared/sharedLogic/useFunctions'
import {required, mustBeLength} from '../../shared/sharedLogic/fieldValidation'
import {strToObj, arrToObj, stringToPropName} from '../../shared/sharedLogic/sharedFuncs'
import {RequireAuth} from '../../shared/sharedLogic/HocComponents'
import * as actions from '../../actions'
import AddingItemModal from './AddItemModal'
import MenuAdding from './MenuAdding'
import '../auth/auth.scss'
import '../../app.scss'

/**
 * ToDo:
 * *******************
 * 1) Add deleting option in each item of the menu
 * 2) Fix the bug in "Name Price" list that do not show items imidiatly (only after click)
 * 3) Connect form to database
 */

const requiredLengthOfTwo = mustBeLength(2)

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
            <select size="8" name="" className="form-control" ref={props.refProp} style={{padding:0}} {...input}>
                <option disabled className="list-header">Category</option>
                {props.values.map((val, index, array) => {
                    return (<option key={index} value={val}>{val}</option>)
                })}
            </select>
            <button type="button" onClick={props.clickEvent}>
                {addContent}
            </button>
        </div>
    )
}

function AddRestuarant(props) {

    const [winWidth] = useWindowSize()
    const [isResponsive, setResponsive] = useState(winWidth < 767 ? true : false)
    const [showModal, setModal] = useState(false)
    const [modalContant, setModalContant] = useState()
    const [menuObj] = useState({})
    const [modalArr, setModalArr] = useState()
    const [categories] = useState([])
    const [menuItems] = useState({})

    const categorySelect = useRef()

    const loadingBtn = <Spinner
                            as="span"
                            animation="border"
                            size="lg"
                            role="status"
                            aria-hidden="true"
                        />
        
        const onSubmit = (formProps) => {
        /**reset form props after sending to database */
        console.log(menuObj)
        Object.keys(menuObj).forEach(key => {
            const current = Object.keys(menuObj[key])
            menuObj[key] =  Array.isArray(current) ? arrToObj(current) : strToObj(current)
        })
        formProps.menu = menuObj
        console.log(formProps)
    }

    useEffect(() => {
        setResponsive(winWidth < 767 ? true : false)
    },[winWidth])

    useEffect(() => {
        Object.defineProperty(categories, "push", {
            value: function(val) {
                const propName = stringToPropName(val)
                if(menuObj[propName] === undefined) {
                    this[this.length] = val
                    menuObj[propName] = {}
                    return val
                }
            }
        })
    }, [])

    useEffect(() => {
        if(categories.length > 0) {
            const prop = stringToPropName(categories[categories.length-1])
            Object.defineProperty(menuItems, categories[categories.length-1], {
                value: []
            })
            Object.defineProperty(menuItems[categories[categories.length-1]], "push", {
                value: function(val) {
                    const valStringify  = JSON.stringify(val)
                    this[this.length] = val
                    menuObj[prop][valStringify] = valStringify
                    return val
                }
            })
        }
    },[categories.length])

    return (
        <>
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
                            validate={[required, requiredLengthOfTwo]}
                            direction="left"
                        />
                        <Field 
                            name="location.city"
                            type="text"
                            component={isResponsive ? responsiveRenderField : renderField}
                            autoComplete="none"
                            className={"form-control " + (isResponsive ? "" : "half-width")}
                            placeholder="City"
                            validate={[required, requiredLengthOfTwo]}
                            direction="left"
                        />
                        <Field 
                            name="location.adress"
                            type="text"
                            component={isResponsive ? responsiveRenderField : renderField}
                            autoComplete="none"
                            className={"form-control " + (isResponsive ? "" : "half-width")}
                            placeholder="Adress"
                            validate={[required, requiredLengthOfTwo]}
                            direction="right"
                        />
                        <FormSection name="menu" component={(props) => (<>{props.children}</>)}>
                            <Field  
                                name="category"
                                refProp={categorySelect}
                                component={selectList}
                                values={categories}
                                clickEvent={()=>{
                                    setModal(true)
                                    setModalContant(
                                        <>
                                            <input placeholder="Type a category" name="category" type="text" className="form-control"/>
                                        </>
                                    )
                                    setModalArr(categories)
                                }}
                            />
                            <MenuAdding 
                            arr={menuItems}
                                clickEvent={() => {
                                    setModal(true)
                                    setModalContant(
                                        <>
                                            <input placeholder="Type a name" name="item.name" type="text" className="form-control"/>
                                            <input placeholder="Type an price" name="item.price" type="text" className="form-control"/>
                                        </>
                                    )
                                    const category = document.getElementsByName("menu.category")[0].value
                                    setModalArr(menuItems[category] ? menuItems[category] : menuItems[category] = [])
                                }}/>
                        </FormSection>
                        <Button variant="primary" size="sm" type="submit" disabled={props.submitting}>
                            {!props.submitting ? 'Add Restuarant' : loadingBtn}
                        </Button>
                    </form>
                </Card.Body>
            </Card>
            <AddingItemModal 
                show={showModal}
                onHide={() =>{setModal(false); setModalContant()}}
                contant={modalContant}
                arr={modalArr}
            />
        </>
    )
}

const exportedComponent = compose(
    connect(null, actions),
    reduxForm({
        form: 'addRestuarant'
    })
)(AddRestuarant)

export default RequireAuth(exportedComponent)
