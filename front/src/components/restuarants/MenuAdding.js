import React from 'react'
import { Field, formValues } from 'redux-form' 

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
            <button type="button" onClick={props.clickEvent}>
                {addContent}
            </button>
        </div>
    )
}

function AddMenu(props) {
    const vluse = {
        one: ['hi, hi, hi'],
        two: ['la', 'lal'],
        three: ['haha', 'dsfsfdsf', 'dsfdsf', 'adaaaa']
    }

    return (
        <>
            <Field  
                name={props.category ? ""+props.category : "noName"}
                component={selectList}
                //autoComplete="none"
                values={props.category ? vluse[props.category] : []}
                onChange={props.changeFunc}
                clickEvent={props.clickEvent}
            />
        </>
    )
}

export default formValues("category")(AddMenu)