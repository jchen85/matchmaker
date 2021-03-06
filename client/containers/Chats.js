import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ChatsActions from '../actions/chats';
import { Chat } from '../components/Chat';
import { ChatCollapsed } from '../components/ChatCollapsed';
import { socket } from './App';
import { routeActions } from 'react-router-redux';
import css from './Chats.scss';

// @connect(
//   state => state.items,
//   dispatch => bindActionCreators(actionCreators, dispatch)
// )

const collapsedChatContainer = {
  backgroundColor: 'white',
  marginLeft: '0px',
  marginRight: '0px'
};

const chatStyle = {
  paddingLeft: 0
};

class Chats extends Component {
  // constructor(props) {
  //   super(props);
  // }
  addMessageOnEnter(pair_id, event) {
    const { actions, user_id } = this.props;
    if (event.key === 'Enter') {
      actions.sendMessage(event.target.value, user_id, Number(pair_id));
      event.target.value = '';
    }
  }

  fetchChatsAndTellSocket() {
    const { actions, user_id, chats } = this.props;
    actions.fetchChats(user_id);
    // () => {
    //   socket.emit('joinChatrooms', { chats: chats });
    // }
  }

  componentWillMount(){
    const { user, routerActions } = this.props;
    //if user isn't authenticated reroute them to the home page
    if (!user.isAuthenticated) {
      routerActions.push('/home');
      return;
    }
  }

  componentDidMount() {
    const { actions, user_id, user, routerActions } = this.props;
    if (user.isAuthenticated) {
      this.fetchChatsAndTellSocket();
      socket.on('refreshChats', () => {
        this.fetchChatsAndTellSocket();
      });
    }
  }

  componentDidUpdate() {
    const { chats } = this.props;
    socket.emit('joinChatrooms', { chats: chats });
  }

  render() {
    const { chats, focus, focusedChat, user_id, actions } = this.props;

    let renderedChats = [];

    Object.keys(chats).map((chatKey) => {
      //chatKey is the pair_id
      renderedChats.push(
        <ChatCollapsed
          key={chatKey}
          chat={chats[chatKey]}
          addMessageOnEnter={this.addMessageOnEnter.bind(this)}
          closeChat={actions.closeChat}
          pair_id={chatKey}
          user_id={user_id}
          expandChat={actions.expandChat}
          focus={focus}
          userHeart={chats[chatKey].userHeart}
        />);
    });

    // display either the list of collapsed chats, or the focused expanded chat
    if (focus === null) {
      return (
        <div className={css.collapsedChatContainer}>
          <div style={{fontFamily: 'Lobster', fontSize: 'x-large'}}>Chats</div>
          {renderedChats}
        </div>
      );
    } else {
      return (
        <Chat 
          key={focus}
          chat={focusedChat} 
          addMessageOnEnter={this.addMessageOnEnter.bind(this)} 
          pair_id={focus} 
          user_id={user_id} 
          heartConnection={actions.heartConnection} 
          closeChat={actions.closeChat}
          collapseChat={actions.collapseChat}
        />
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    user_id: state.user.user_id,
    user: state.user,
    chats: state.chats.chats,
    focus: state.chats.focus,
    focusedChat: state.chats.chats[state.chats.focus]
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ChatsActions, dispatch),
    routerActions: bindActionCreators(routeActions, dispatch)
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chats);
