import React, { useRef, useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

function breakToProps(obj, propString, value) {

    propString.split(".").forEach((item,index, arr) => {
        if(index<arr.length-1) {
            obj[item] = {...obj[item]}
        } else {
            obj[item] = value
        }
        obj = obj[item]
    })
}

function AddItemModal(props) {

    const [disable, setDisable] = useState(true)

    const modalBody = useRef()

    const blurHandler = () => {
        if(!modalBody.current) return
        for(let i=0; i<modalBody.current.children.length; i++) {
            if(!modalBody.current.children[i].value) {
                setDisable(true)
                return
            }
        }
        setDisable(false)
    }

    useEffect(()=>{
        if(props.show) {
            blurHandler()
        }
    },[modalBody, props.show])

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton />
            <Modal.Body ref={modalBody} onChange={blurHandler}>
                {props.contant}
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    disabled={disable}
                    onClick={()=>{
                        const tempObj = {}
                        Array.from(modalBody.current.children).forEach(child => {
                            breakToProps(tempObj,child.name, child.value)
                        })
                        if(props.arr.index !== null && props.arr.index !== undefined) {
                            props.arr.arr[props.arr.index] = tempObj[Object.keys(tempObj)[0]]
                        } else if(props.arr.arr !==undefined){
                            props.arr.arr.push(tempObj[Object.keys(tempObj)[0]])
                        } else {
                            props.arr.push(tempObj[Object.keys(tempObj)[0]])
                        }
                        props.onHide()
                }}>Add</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddItemModal