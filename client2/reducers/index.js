import { combineReducers } from 'redux'

import { NEW_CANDIDATES, INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions'

function counter(state = 0, action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return state + 1
    case DECREMENT_COUNTER:
      return state - 1
    default:
      return state
  }
}

function candidates(state = [null, null, null], action) {
	switch (action.type) {
		case NEW_CANDIDATES:
    	return action.candidates
		default:
			return state
	}
}

const rootReducer = combineReducers({
	counter,
	candidates
})

export default rootReducer