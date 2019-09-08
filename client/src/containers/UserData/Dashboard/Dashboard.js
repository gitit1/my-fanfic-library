import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {logoutUser} from "../../../store/actions";
import Container from '../../../components/UI/Container/Container';


class Dashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
render() {
    const { user } = this.props.auth;
return (
    <Container header='Dashboard Page'>
      <img src="/images/work-in-progress.jpg" alt="wip"/>
      {/* <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Hey there,</b> {user.name.split(" ")[0]}
            </h4>
          </div>
        </div>
      </div> */}
      <div>My Fandoms</div>
      <div>my Statics</div>
      <div>reading list</div>
    </Container>
    );
  }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps,{logoutUser})(Dashboard);