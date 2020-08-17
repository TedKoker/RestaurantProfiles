import React, { useRef } from 'react'
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

    const modalBody = useRef()

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton />
            <Modal.Body ref={modalBody}>
                {props.contant}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>{
                    const tempObj = {}
                    Array.from(modalBody.current.children).forEach(child => {
                        breakToProps(tempObj,child.name, child.value)
                    })
                    props.arr.push(tempObj[Object.keys(tempObj)[0]]) //[Object.keys(tempObj)[0]]
                    props.onHide()
                }}>Add</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddItemModal