import { createStore, combineReducers } from 'redux';
import { location } from '../../index';

const rootReducer = combineReducers({
  // you other reducers
  location,
});

export default createStore(rootReducer);
