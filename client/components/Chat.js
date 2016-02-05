import React, { Component } from 'react';
import { Message } from './Message';
import heart from '../../static/img/icons/heart'; // Heart is an SVG graphic from: http://codepen.io/sol0mka/pen/c6721c06e93b4ee6cc95a21f6a4caedc
import { extend, uniqueId } from 'underscore';

const heartSvg = heart();
const heartNotFilledInStyle = {
  width: '3em',
  height: '3em',
  fill: '#ccc'
};
const heartFilledInStyle = extend({}, heartNotFilledInStyle, {fill: '#FE4365', strokeWidth: '1px', stroke:'black'});

const chatStyle = {
  padding: '10px'
};

const inputStyle = {
  width: '100%'
};

export class Chat extends Component {
  render() {
    const {chat, addMessageOnEnter, pair_id, user_id, heartConnection, userHeart} = this.props;
    // messages vs. chats:
    // Chats refer to all messages between a particular pair (bob and amy)
    // messages are an individual message of text sent by one user
    let renderedMessages = [];
    const heartButton = 'https://freeiconshop.com/files/edd/heart-compact-flat.png';

    const heartId = uniqueId('heart'); //used for hover effect

    if (chat) {
      const is_user_one = chat.user_one.user_id === user_id;
      chat.messages.forEach((message, index) => {
        renderedMessages.push(<Message key={index} message={message} chat={chat} sender={message.sender === chat.user_one.user_id ? chat.user_one : chat.user_two}/>);
      });
      return (
        <div className='col-md-10 col-sm-11 col-xs-11 well' style={chatStyle}>
          <div style={{'display': 'flex'}}>
            {/* SVG Heart: heartSVG contains the definition of a SVG heart*/}
            { heartSvg }
            {/* SVG Heart: the below SVG element actually places the SVG heart on the page*/}
            <svg viewBox="0 0 32 32" style={chat.userHeart === true ? heartFilledInStyle : heartNotFilledInStyle} >
               <g filter="url(#inset-shadow)">
                <use xlinkHref="#heart-icon" id={heartId} onClick={() => heartConnection(pair_id, user_id, is_user_one)}></use>
              </g>
            </svg>
            <style>{
            // hover uses the id generated with uniqueId, based on this example: https://jsfiddle.net/ors1vos9/ 
            "#" + heartId + ":hover {fill: #FE4365; opacity: 0.5} "
            }</style>
            Click on this heart if you're happy with this match! The other user won't know you gave them a heart unless they give you one too.
          </div>
          <div>
            {renderedMessages.length > 0 ? renderedMessages : "No messages yet"}
          </div>
          <div className='row'>
            <div className='col-md-12 col-sm-12 col-xs-12'>
              <input style={inputStyle} type='text' onKeyPress={addMessageOnEnter.bind(this, pair_id)} placeholder='Write a message...' />
            </div>
          </div>
        </div>
      );
      
    } else {
      return (<div />)
    }
  }
}

