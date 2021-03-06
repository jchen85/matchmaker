import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import * as RecommendationActions from '../actions/recommendationActions';
import * as MatchmakerActions from '../actions/matchmaker.js';
import css from './Recommendation.scss';
import BuyRecommendation from '../components/BuyRecommendation.js';

const algorithmDescription = {
  width: '70%',
  border: '0 solid #ccc',
}

const robotsStyle = {
  height: 250,
  width: 'auto',
  marginTop: 80
}

const prospectInfoStyle = {
  width: 'auto',
  marginTop: '1vw',
  marginLeft: '1vw',
  marginRight: '1vw'
};

const prospectInfo = {
  marginTop: -6,
  fontSize: '1.8vmin'
}

const nameStyle = {
  fontSize: '2.6vmin'
}

// const matchRecButton = {
//   fontSize:'140%',
//   float: 'left',
//   bottom: 0
// }

const iconProspectStyle = {
  width: 55,
  height: 'auto',

};

const description = {
  width: '70%',
  border: '0 solid #ccc',
}

const robotDivStyle = {
  float: 'left',
  margin: 20,
  marginRight: 50
}

const robotStyle = {
  height: 250,
  width: 'auto',

}

const recommendationStyle = {
  paddingTop: 30,
  width: '20%',
  float: 'left',
  // backgroundColor: 'red',
  paddingLeft: 20
  
}

class Recommendation extends Component {

  getRecommendation() {
    const {actions, user} = this.props;
    actions.postRecommendation(user.user_id, user.userInfo.gender, user.userInfo.gender_preference);
  }

  render() {

    // <img src='http://i.imgur.com/nTpf2tW.gif'/>
    const {recommendation, user, actions, buyActions} = this.props;
    
    // gender icon
    let maleIcon = 'http://1.bp.blogspot.com/-9zJZ2kiHqFQ/VQCayOG1pxI/AAAAAAAADEU/igsvbvsPjKU/s1600/The%2BMale%2BPrinciple.png';
    let femaleIcon = 'http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons/3d-transparent-glass-icons-symbols-shapes/016921-3d-transparent-glass-icon-symbols-shapes-female-symbol.png';
    let bothIcon = 'http://i.imgur.com/ku5iAME.png';

    let icon_path = bothIcon;
    if (recommendation.gender === 'female') {
      icon_path = femaleIcon;
    } if (recommendation.gender === 'male') {
      icon_path = maleIcon;
    }

    // age

    function calculateAge(birthdate) {
      let difference = +Date.now() - +new Date(birthdate);
      let ageDate = new Date(difference); // miliseconds from epoch
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    let age = calculateAge(recommendation.birthday) || '';

    return (

      <div style={{marginLeft: '5vh'}}>
        <div style={algorithmDescription}>
          <h1>Let our algorithm help you find the perfect match...</h1>
          <h3>Looks are important. Our algorithm analyzes the matches that you've 'hearted' and conducts facial image analysis on their pictures to find other users you may like the look of. Try it now!</h3>
        </div>
        <div className={css.robotDivStyle}>
          <img style={robotsStyle} src='http://i.imgur.com/20Whp63.gif'/>
          <Button className={css.recommendationButton} type="button" onClick={() => {this.getRecommendation()}}> Get Matched! </Button>
        </div>
        <div className={css.recommendation}>
          <img className={css.recommendationImage} src={recommendation.image_url}/>
          <div style={prospectInfoStyle}>
            <h4 style={nameStyle}> {recommendation.first_name}, {age} <img src={icon_path} style={iconProspectStyle}/> </h4>
            <p style={prospectInfo}>''{recommendation.description}''</p>
            <BuyRecommendation dis={user.userScore.score < 1000 || recommendation.gender === 'none'} actions={buyActions} person={recommendation} user={user}/>
          </div>

        </div>
      </div>
    );
  }
}

// must pass actons and user

Recommendation.propTypes = {
  actions: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  recommendation: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user,
    recommendation: state.recommendation
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(RecommendationActions, dispatch),
    buyActions: bindActionCreators(MatchmakerActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Recommendation);




