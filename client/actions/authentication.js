import fetch from 'isomorphic-fetch';
import { fetchChats } from './chats';
import { fetchUserScore } from './user';
import { routeActions } from 'react-router-redux';
import { getAlbum } from './pictureActions.js';
import { postRecommendation } from './recommendationActions.js';


export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';

// Working but not hooked up to redux totally properly

export function login(userID, accessToken){
  return function(dispatch) {
    dispatch(requestLogin());
    let request = new Request(`/api/users/${userID}`, {method: 'GET'});
    return fetch(request)
      .then(response => response.json())
      .then((json) => {
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
        if (json) {
          // dispatch(postRecommendation(json.user_id, json.gender, json.gender_preference));
          dispatch(fetchChats(json.user_id));
          dispatch(fetchUserScore(json.user_id));
          dispatch(receiveLogin(json));
          dispatch(getAlbum(json.user_id));
        } else {
          let request = new Request('/api/users', {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              facebook_id: userID,
              access_token: accessToken
            })
          });
          return fetch(request)
            .then(response => response.json())
            .then((json) => {
            // We can dispatch many times!
            // Here, we update the app state with the results of the API call.
              if (json) {
                // dispatch(postRecommendation(json.user_id, json.gender, json.gender_preference));
                console.log('HERE 2',json);
                dispatch(fetchChats(json.user_id));
                dispatch(fetchUserScore(json.user_id));
                console.log('FETCHING ALBUM', json.user_id,getAlbum)
                dispatch(getAlbum(json.user_id));
                dispatch(receiveLogin(json));
              }
            });
        }
      });
  };

}

export function logout(){
  return function(dispatch){
    dispatch(requestLogout());
    FB.logout(function(response) {
      console.log(response);
    });
  };
};

export function clickLogin() {
  return function(dispatch) {
    console.log('dispatching login', dispatch);
    dispatch(requestLogin());
    FB.getLoginStatus(function(response) {
      // In this case the user must have logged in previously so get request SHOULD return user data
      // These puts should be converted to gets with ID params
      if (response.status === 'connected') {
        login(response.authResponse.userID, response.authResponse.accessToken);

      } else {
        FB.login(function(responseLogin) {
          console.log(responseLogin);
          let request2 = new Request(`/api/users/${responseLogin.authResponse.userID}`, {method: 'GET'});
          return fetch(request2)
            .then(response => response.json())
            .then((json) => {
              if (json) {
                // dispatch(postRecommendation(json.user_id, json.gender, json.gender_preference));
                console.log('HERE 3',json);
                dispatch(fetchChats(json.user_id))
                dispatch(fetchUserScore(json.user_id));
                dispatch(receiveLogin(json));
                dispatch(getAlbum(json.user_id));
              } else {
                console.log("New User");
                // New User
                let request3 = new Request('/api/users', {
                  method: 'post',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    facebook_id: responseLogin.authResponse.userID,
                    access_token: responseLogin.authResponse.accessToken
                  })
                });

                return fetch(request3)
                  .then(response => response.json())
                  .then((json) => {
                  // We can dispatch many times!
                  // Here, we update the app state with the results of the API call.
                    // dispatch(postRecommendation(json.user_id, json.gender, json.gender_preference));
                    console.log('HERE 4',json);
                    console.log('FETCHING ALBUM', getAlbum)
                    dispatch(fetchChats(json.user_id));
                    dispatch(fetchUserScore(json.user_id));
                    dispatch(getAlbum(json.user_id));
                    dispatch(receiveLogin(json));
                    dispatch(routeActions.push('/profile'));
                  })
                  .catch((error) => {
                    console.log(error);
                  } );
              }
            });
        }, {scope: 'public_profile,email'});
      }
    })

  };
}

// Naive solution to getting searching for FB login status after FB loads
setTimeout(clickLogin, 2000);

export function requestLogin() {
  return {
    type: LOGIN_REQUEST,
    isFetchingAuth: true
  };
}

export function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    isFetchingAuth: false,
    user: user
  };
}

export function loginError(message) {
  return {
    type: LOGIN_FAILURE,
    isFetchingAuth: false
  };
}

export function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
  };
}
