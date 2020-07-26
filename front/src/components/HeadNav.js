import React, { useState, useCallback, useEffect } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import {NavButton} from 'react-svg-buttons'
import {HamburgerButton} from 'react-hamburger-button'
import 'bootstrap/dist/css/bootstrap.min.css';
import './HeadNav.scss'

function HeadNav(props, ref) {

    const [isToggelClose, setToggleClose] = useState(true)
    /**Explanation about 'isToggleClose':
     * **********************************
     * Each time NavBar.collapse is open, the class 'show' added.
     * So I set a rule that each time that 'isToggleClose' is false,
     * it will add a class to Navbar.Collapse names 'show', so it could not be closed
     * untill isToggleClose sets to true
     * (It will not work at the opposite way becouse bootstrap sets is own .show class except the .show class that I add
     * So it could not be forced to stay open that way)
     */

     const handleToggleClick = useCallback(() => {
         setToggleClose(!isToggelClose)
     })

    return (
        <Navbar ref={ref} collapseOnSelect expand="md" className="navbar-fix-style">
            <Navbar.Brand className="brand">
                <h4>
                    Restuarant
                </h4>
                <h6>
                    Profile
                </h6>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" 
                onClick={handleToggleClick}
                children={
                    <HamburgerButton
                        open={!isToggelClose}
                        width={30}
                        height={30}
                        strokeWidth={2}
                        animationDuration={0.3}
                   />
                }
            />
            <Navbar.Collapse className={isToggelClose ? "" : "show"}>
            <Nav className="mr-auto">
                <Nav.Link>Home</Nav.Link>
                <Nav.Link>Features</Nav.Link>
                <Nav.Link>Pricing</Nav.Link>
            </Nav>
            </Navbar.Collapse>
            {props.children}
        </Navbar>
    )
}

export default React.forwardRef(HeadNav)