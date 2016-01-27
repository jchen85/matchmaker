import React, { Component, PropTypes } from 'react'

class Candidate extends Component {
	render() {
		const { candidate } = this.props
		return (
			<div>
				{ JSON.stringify(candidate) }
			</div>
		)
	}
}

Candidate.PropTypes = {
	candidate: PropTypes.object.isRequired
}

export default Candidate