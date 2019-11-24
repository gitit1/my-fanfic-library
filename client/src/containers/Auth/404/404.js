import React, { Component } from "react";
// import { connect } from "react-redux";
import Container from '../../../components/UI/Container/Container';
// import {Link} from 'react-router-dom';


class Redirect extends Component {
    render(){
        return(
            <Container>
                404 - Not Found
            </Container>
        )
    }
};

export default Redirect;