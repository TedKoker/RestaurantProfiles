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
    const textSize = window.getComputedStyle(child).getPropertyValue("font-size")
    child.remove()
    let span = document.createElement("span")
    span.style.fontSize=textSize
    span.append(document.createTextNode(contant))
    document.body.appendChild(span)
    const width = span.offsetWidth
    span.remove()
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
    const header = ()=>{
        if(props.select){
            const spacePixelRange = adjustSpace("\u00a0", props.select, "option", {className: "list-header"})
            const wordPixelRange = adjustSpace("Name", props.select, "option")
            const number = Math.round(props.select.clientWidth/2/spacePixelRange -wordPixelRange / spacePixelRange)
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
                    const number = Math.round(selectElm.clientWidth/2/spacePixelRange -wordPixelRange / spacePixelRange)
                    return (<option key={index} value={`{name: ${val.name}, price: ${val.price}}`} id={index}>{seprateToColumns([val.name, val.price], number)}</option>)
                })}
            </select>
            <button type="button" className="add-btn" onClick={props.clickEvent}>
                {addContent}
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
            />
        </>
    )
}

export default formValues("category")(AddMenu)