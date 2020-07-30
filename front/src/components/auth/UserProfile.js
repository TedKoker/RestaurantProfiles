import React, { useEffect } from 'react'
import {connect} from 'react-redux'
import Card from 'react-bootstrap/Card'

import UserEdit from './UserEdit'
import './auth.scss'
import '../../app.scss'

function UserProfile(props) {

    return (
        <Card className="text-center">
            <Card.Header>{props.fullName}</Card.Header>
            <Card.Body>
                <UserEdit/>
                <hr/><hr/>
                {/* change password component */}
            </Card.Body>
        </Card>
    )
}

function mapToProps(state) {
    return {
        user: state.auth.connectedUser,
        fullName: `${state.auth.connectedUser.fName} ${state.auth.connectedUser.lName}`
    }
}

export default connect(mapToProps)(UserProfile)