import { bindActionCreators } from 'redux'
import React, { Component, PropTypes } from 'react'
import { Provider, connect } from 'react-redux'
import { ReduxRouter } from 'redux-router'
import DevTools from './DevTools'
import * as Actions from '../actions'
import Candidate from '../components/Candidate'

class Root extends Component {
  render() {
  	window.store = this.props
    console.log(this.props);
    return (
        <div>
        	<Candidate candidate={this.props.candidates[0]} />
        	<Candidate candidate={this.props.candidates[1]} />
        	<Candidate candidate={this.props.candidates[2]} />
        </div>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	return {
		candidates: state.candidates
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)