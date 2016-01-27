import 'isomorphic-fetch'

export const INCREMENT_COUNTER = 'INCREMENT_COUNTER'
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER'
export const NEW_CANDIDATES = 'NEW_CANDIDATES'

export function increment() {
  return {
    type: INCREMENT_COUNTER
  }
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER
  }
}

export function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState()

    if (counter % 2 === 0) {
      return
    }

    dispatch(increment())
  }
}

export function incrementAsync(delay = 1000) {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment())
    }, delay)
  }
}

export function getRandomUsers() {
  return dispatch => {
    return fetch('http://localhost:3000/test')
      .then(response => {
        return response.json()
      })
      .then(results => {
        return dispatch({
          type: NEW_CANDIDATES,
          candidates: results
        })
      });
  }
}