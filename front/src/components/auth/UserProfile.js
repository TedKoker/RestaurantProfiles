import React, { useEffect } from 'react'
import {connect} from 'react-redux'
import Card from 'react-bootstrap/Card'

// import {RequireAuth} from '../../shared/sharedLogic/HocComponents'
import RequireAuth from '../../shared/sharedLogic/HocComponents'
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
    return {
        user: state.auth && state.auth.connectedUser,
        fullName: state.auth &&  `${state.auth.connectedUser.fName} ${state.auth.connectedUser.lName}`
    }
}

// export default connect(mapToProps)(UserProfile)
export default RequireAuth(UserProfile,connect,mapToProps)