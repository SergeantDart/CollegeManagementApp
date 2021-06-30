import React , {Component} from "react";
import FontAwesome from "react-fontawesome";
import {Link} from "react-router-dom";
import Nav from "./Nav";

class Header extends Component {

    state = {
        showNav: false
    };

    onHideNav = () => {
        this.setState({showNav: false});
    }


    render() {
        return (
            <header>

                <div className="sidenav_bars">
                    <FontAwesome name="bars"
                        onClick={() => this.setState({showNav: true})}
                        style={{
                            color: "#ffffff",
                            padding: "10px",
                            cursor: "pointer"
                        }}    
                    />

                    <span className="logo_container">
                        <img id="logo" src="/images/college_logo.jpg"/>

                        <Link to={{
                            pathname: "/",
                            state: {fromDashboard: true}}}>
                                    College Management App
                        </Link>
                    </span>
    

                </div>

                <Nav showNav={this.state.showNav} onHideNav={this.onHideNav}/>


            </header>
        );
    }
}

export default Header;
