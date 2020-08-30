import React, { useState, useRef, useEffect } from 'react'
import { Field, formValues } from 'redux-form'

function adjustSpace(contant, fother, childString, args={}) {
    let child = document.createElement(childString)
    let text = document.createTextNode(contant)
    child.append(text)
    Object.keys(args).forEach(prop => {
        child[prop] = args[prop]
    })
    fother.appendChild(child)
    let textSize = window.getComputedStyle(child).getPropertyValue("font-size")
    child.remove()
    let span = document.createElement("span")
    span.style.fontSize=textSize
    span.append(document.createTextNode(contant))
    const currentPxRatio = window.devicePixelRatio
    document.body.style.zoom = 1 - (currentPxRatio - 1)
    document.body.appendChild(span)
    const width = span.offsetWidth
    span.remove()
    document.body.style.zoom = currentPxRatio
    // document.body.style.zoom=3.0
    return width
}

function seprateToColumns(worlds = [], spaceBetween) {

    spaceBetween = Number(spaceBetween)

    if(!spaceBetween) {
        throw new Error("seprateToColumns must recive a number as spaceBetween")
    }
    let space = ""
    for(let i=0; i<spaceBetween; i++) {
        space += "\u00a0"
    }
    return worlds.join(space)
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

    const header = ()=>{
        if(props.select){
            // window.devicePixelRatio=1
            const spacePixelRange = adjustSpace("\u00a0", props.select, "option", {className: "list-header"})
            const wordPixelRange = adjustSpace("Name", props.select, "option", {className: "list-header"})
            const number = Math.ceil(props.select.clientWidth/2/spacePixelRange -wordPixelRange / spacePixelRange)
            return (<option disabled className="list-header">{seprateToColumns(["Name", "Price"], number)}</option>)
        }
    }
    /**If option is selected, there will be trash can near her to delete the option */
    return (
        <div className="list" id="list" style={{width: "100%"}}>
            <select size="8" id={"itemList"} className="form-control" style={{padding:0}} {...input}>
                {header()}
                {props.values.map((val, index) => {
                    const selectElm = document.getElementById("itemList")
                    const spacePixelRange = adjustSpace("\u00a0", selectElm, "option")
                    const wordPixelRange = adjustSpace(val.name, selectElm, "option")
                    const number = Math.ceil(selectElm.clientWidth/2/spacePixelRange -wordPixelRange / spacePixelRange)-2 
                    // console.log(wordPixelRange)
                    return (<option key={index} value={`{name: ${val.name}, price: ${val.price}}`} id={index}
                                onClick={(e) => {
                                    const trashBtn = document.getElementById("item-delete")
                                    const editBtn = document.getElementById("item-edit")
                                    const yPoint = e.target.clientHeight*(index+1)
                                    trashBtn.style = editBtn.style =  `display: inline; top: ${yPoint+3}px`
                                }}
                            >{seprateToColumns([val.name, val.price], number)}</option>)
                })}
            </select>
            <button type="button" className="add-btn" onClick={props.clickEvent} disabled={props.disableBtn}>
                {addContent}
            </button>
            <button type="button" className="delete-btn" id="item-delete" onClick={(e)=>{props.deletEvent(e)}}>
                {trashIcon}
            </button>
            <button type="button" className="edit-btn" id="item-edit" onClick={(e)=> props.clickEvent(e, true)}>
                {editIcon}
            </button>
        </div>
    )
}

function AddMenu(props) {

    const [selectElm, setSelectElm] = useState()

    useEffect(()=>{
        setSelectElm(document.getElementById("itemList"))
    },[])

    return (
        <>
            <Field 
                name={props.category ? ""+props.category : "noName"}
                component={selectList}
                select={selectElm}
                //autoComplete="none"
                values={props.arr[props.category] ? props.arr[props.category] : []}
                onChange={props.changeFunc}
                clickEvent={props.clickEvent}
                forwardRef={false}
                deletEvent={props.deletEvent}
                disableBtn={props.disableBtn}
            />
        </>
    )
}

export default formValues("category")(AddMenu)