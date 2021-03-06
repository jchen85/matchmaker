import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import css from './Target.scss';

const buttonStyle = {
  width: '50%',
  fontSize: '100%'
};

class SkipButton extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    console.log('PROPS', this.props);
    const { actions, user_id, triads} = this.props;

    return (
        <Button responsive className={css.button} bsStyle="danger" onClick={() => {actions.getNewCandidates(user_id, triads);}} >No good match? Skip!</Button>
    );
  }
}

SkipButton.propTypes = {
  actions: PropTypes.object.isRequired
};

export default SkipButton;
