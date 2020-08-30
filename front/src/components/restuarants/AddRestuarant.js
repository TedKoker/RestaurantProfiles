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
 * 1) Add validation to modal - done
 * 2) Fix pixal ration (in smaller screen in the Name Price selection, it is not shown properly)
 * 3) Fix CSS
 * 4) Connect form to database
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
    
    const trashIcon = <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>

    const editIcon = <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M11.293 1.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-.39.242l-3 1a1 1 0 0 1-1.266-1.265l1-3a1 1 0 0 1 .242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z"/>
                        <path fillRule="evenodd" d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 0 0 .5.5H4v.5a.5.5 0 0 0 .5.5H5v.5a.5.5 0 0 0 .5.5H6v-1.5a.5.5 0 0 0-.5-.5H5v-.5a.5.5 0 0 0-.5-.5H3z"/>
                    </svg>

    /**If option is selected, there will be trash can near her to delete the option */
    return (
        <div className="list" ref={props.refProp} style={{width: "100%"}}>
            <select size="8" className="form-control" style={{padding:0}} {...input} autoFocus>
                <option disabled className="list-header">Category</option>
                {props.values.map((val, index, array) => {
                    return (<option key={index} value={val}
                                 onClick={(e) => {
                                const trashBtn = document.getElementsByClassName("delete-btn")
                                const editBtn = document.getElementsByClassName("edit-btn")
                                const yPoint = e.target.clientHeight*(index+1)
                                trashBtn[0].style = editBtn[0].style =  `display: inline; top: ${yPoint+3}px`
                            }}>{val}</option>)
                })}
            </select>
            <button type="button" className="add-btn" onClick={props.clickEvent}>
                {addContent}
            </button>
            <button type="button" className="delete-btn" onClick={(e)=>props.deleteEvent(e)} id="delete-btn">
                {trashIcon}
            </button>
            <button type="button" className="edit-btn" onClick={(e)=> {props.clickEvent(e, true)}} id="edit-btn">
                {editIcon}
            </button>
        </div>
    )
}

function AddRestuarant(props) {

    const [dummyValue ,forceUpdate] = useState(false) // The dummyValue has no meaning, it just to rerender the component when I need to
    const [winWidth] = useWindowSize()

    const [isResponsive, setResponsive] = useState(winWidth < 767 ? true : false)
    const [showModal, setModal] = useState(false)
    const [modalContant, setModalContant] = useState()
    const [menuObj] = useState({})
    const [modalArr, setModalArr] = useState()
    const [categories] = useState(["disert", "first", "main"])
    const [menuItems] = useState({
        main: [{name: "salat", price:40 }],
        disert: [{name: "salat", price:40 }],
        first: []
    })

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
        if(categories.length > 0 && stringToPropName(categories[categories.length-1]) && categories[categories.length-1]===undefined) {
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

    useEffect(() => {
        if(!showModal) {
            if(Object.keys(menuItems).length === categories.length) {
                let tempObj = {}
                let changedValue
                categories.forEach((value) => {
                    tempObj[value] = menuItems[value]
                    if(tempObj[value] === undefined) {
                        changedValue = value
                    }
                })
                Object.keys(menuItems).forEach(value => {
                    if(tempObj[value] === undefined && menuItems[value] !== undefined) {
                        if(changedValue) {
                            menuItems[changedValue] = menuItems[value]
                        }
                        delete menuItems[value]
                    }
                })
            }
        }
    },[showModal])

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
                            // validate={[required, requiredLengthOfTwo]}
                            direction="left"
                        />
                        <Field 
                            name="location.city"
                            type="text"
                            component={isResponsive ? responsiveRenderField : renderField}
                            autoComplete="none"
                            className={"form-control " + (isResponsive ? "" : "half-width")}
                            placeholder="City"
                            // validate={[required, requiredLengthOfTwo]}
                            direction="left"
                        />
                        <Field 
                            name="location.adress"
                            type="text"
                            component={isResponsive ? responsiveRenderField : renderField}
                            autoComplete="none"
                            className={"form-control " + (isResponsive ? "" : "half-width")}
                            placeholder="Adress"
                            // validate={[required, requiredLengthOfTwo]}
                            direction="right"
                        />
                        <FormSection name="menu" component={(props) => (<>{props.children}</>)}>
                            <Field  
                                name="category"
                                refProp={categorySelect}
                                component={selectList}
                                values={categories}
                                clickEvent={(e, edit)=>{
                                    const mainDiv = e.target.closest("div")
                                    const currentValue = mainDiv.getElementsByTagName("select")[0].value
                                    //subtracing 1 from the index becouse the first option in the select list is the title
                                    const index = mainDiv.getElementsByTagName("select")[0].selectedIndex - 1
                                    setModal(true)
                                    setModalContant(
                                        <>
                                            <input placeholder="Type a category" name="category" type="text" defaultValue={edit ? currentValue : ""} className="form-control" />
                                        </>
                                    )
                                    setModalArr({arr: categories, index: edit ? index : null})
                                }}
                                deleteEvent={(e)=>{
                                    const mainDiv = e.target.closest("div")
                                    const currentValue = mainDiv.getElementsByTagName("select")[0].value
                                    //subtracing 1 from the index becouse the first option in the select list is the title
                                    const index = mainDiv.getElementsByTagName("select")[0].selectedIndex - 1
                                    delete menuItems[currentValue]
                                    categories.splice(index,1)
                                    forceUpdate(!dummyValue)
                                }}
                            />
                            <MenuAdding 
                                arr={menuItems}
                                disableBtn={categories.length===0}
                                clickEvent={(e, edit) => {
                                    const mainDiv = e.target.closest("div")
                                    const currentValue = strToObj(mainDiv.getElementsByTagName("select")[0].value)
                                    //subtracing 1 from the index becouse the first option in the select list is the title
                                    const index = mainDiv.getElementsByTagName("select")[0].selectedIndex - 1
                                    setModal(true)
                                    setModalContant(
                                        <>
                                            <input placeholder="Type a name" name="item.name" type="text"  defaultValue={edit ? currentValue.name : ""} className="form-control"/>
                                            <input placeholder="Type an price" name="item.price" type="text"  defaultValue={edit ? currentValue.price : ""} className="form-control"/>
                                        </>
                                    )
                                    const category = document.getElementsByName("menu.category")[0].value
                                    setModalArr({
                                        arr: menuItems[category] ? menuItems[category] : menuItems[category] = [],
                                        index: edit ? index : null
                                    })
                                }}
                                deletEvent={(e)=>{
                                    const mainDiv = e.target.closest("div")
                                    //subtracing 1 from the index becouse the first option in the select list is the title
                                    const index = mainDiv.getElementsByTagName("select")[0].selectedIndex - 1
                                    const categoryName = categorySelect.current.children[0].value
                                    menuItems[categoryName].splice(index,1)
                                    forceUpdate(!dummyValue)
                                }}
                                />
                        </FormSection>
                        <Button variant="primary" size="sm" type="submit" disabled={props.submitting}>
                            {!props.submitting ? 'Add Restuarant' : loadingBtn}
                        </Button>
                    </form>
                </Card.Body>
            </Card>
            <AddingItemModal 
                show={showModal}
                onHide={() =>{setModal(false); setModalContant(); setModalArr()}}
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
