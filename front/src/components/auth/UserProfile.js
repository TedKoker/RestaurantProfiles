import React, { useEffect } from 'react'
import {connect} from 'react-redux'
import Card from 'react-bootstrap/Card'

import {RequireAuth} from '../../shared/sharedLogic/HocComponents'
import UserEdit from './UserEdit'
import UserPasswordChange from './UserPasswordChange'
import './auth.scss'
import '../../app.scss'

function UserProfile(props) {

    return (
        <Card className="text-center">
            <Card.Header>{props.fullName}</Card.Header>
            <Card.Body>
                <UserEdit/>
                <hr/><hr/>
                <UserPasswordChange/>
            </Card.Body>
        </Card>
    )
}

function mapToProps(state) {
    console.log(state.auth)
    if(state.auth.authenticated && state.auth.connectedUser) {
        return {
            user: state.auth.connectedUser,
            fullName:  `${state.auth.connectedUser.fName} ${state.auth.connectedUser.lName}`
        }
    } else {
        return {}
    }
}

const exportedComponent = connect(mapToProps)(UserProfile)
export default RequireAuth(exportedComponent)