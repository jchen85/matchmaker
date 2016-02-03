import fetch from 'isomorphic-fetch';


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
          console.log(json);
          dispatch(receiveLogin(json));
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
              console.log("receiveLogin", json);
              if (json) {
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
          let request2 = new Request(`/api/users/${responseLogin.authResponse.userID}`, {method: 'GET'});
          return fetch(request2)
            .then(response => response.json())
            .then((json) => {
              if (json) {
                dispatch(receiveLogin(json));
              } else {
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
                    console.log("receiveLogin", json);
                    dispatch(receiveLogin(json));
                  });
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
  console.log('recievedLogin', user);
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