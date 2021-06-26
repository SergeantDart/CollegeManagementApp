import React from "react";
import {SideNav} from "react-simple-sidenav";
import NavItems from "../components/NavItems";

const Nav = (props) => {


    return (
        <div>
            <SideNav
                showNav={props.showNav}
                onHideNav={props.onHideNav}
                navStyle={{
                    background: "yellow",
                    maxWidth: "300px"
                }}>

                    <NavItems onHideNav={props.onHideNav}/>   
            </SideNav>
        </div>
    );
}

export default Nav;