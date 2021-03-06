import React, { Component, PropTypes } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';
import css from './Header.scss';



// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.


class Header extends Component {

  componentDidUpdate() {
    console.log('componentDidUpdate')
  }

  render() {
    window.HeaderProps = this.props;
    const {user, actions} = this.props;
    return (
      <Navbar staticTop className={css.header} bsStyle='default'>
        <Navbar.Header style={{position: 'absolute'}}>
          <Navbar.Brand>
            <Link to="/home">
              <div />
              {/* Sunset yellow: #FFC107 */}
              <span style={{color: 'rgb(168, 225, 238)', fontFamily: 'Lobster', fontWeight: "500", fontSize: 'xx-large'}}>Home</span>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          {!user.isAuthenticated &&
          <NavItem className={css.loginlogoutmobile} eventKey={3} onClick={this.props.actions.clickLogin} >
            Login via Facebook
          </NavItem>}
          {user.isAuthenticated &&
          <NavItem className={css.loginlogoutmobile} eventKey={3} onClick={this.props.actions.logout}>
            Logout
          </NavItem>}
        </Navbar.Header>

        <Navbar.Collapse eventKey={0}>
          <Nav navbar style={{color: '#601848'}}>
            {user.isAuthenticated && 
            <LinkContainer to="/chats">
              <NavItem eventKey={1}>Chats</NavItem>
            </LinkContainer>}
            {user.isAuthenticated && 
            <LinkContainer to="/profile">
              <NavItem eventKey={2}>My Profile</NavItem>
            </LinkContainer>}
            {user.isAuthenticated && 
            <LinkContainer to="/score">
              <NavItem eventKey={3}>My Score</NavItem>
            </LinkContainer>}
            {user.isAuthenticated &&
            <LinkContainer to="/recommendation">
              <NavItem eventKey={5}>Recommended Match</NavItem>
            </LinkContainer>}
            {!user.isAuthenticated &&
            <NavItem className={css.loginlogoutdesktop} eventKey={3} onClick={this.props.actions.clickLogin} >
              Login via Facebook
            </NavItem>}
            {user.isAuthenticated &&
            <NavItem className={css.loginlogoutdesktop} eventKey={3} onClick={this.props.actions.logout}>
              Logout
            </NavItem>}
          </Nav>
          <Nav>
            
            {user.isAuthenticated &&
            <p className={'navbar-text'}>Logged in as <strong>{user.userInfo.first_name}</strong></p>}
            {user.isAuthenticated &&
            <div className={'navbar-text'}>Points: <strong>{user.userScore.score}</strong></div>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default Header;
