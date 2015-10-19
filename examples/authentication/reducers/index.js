import { combineReducers } from 'redux';
import { location } from '../../../index';

import user from './user';

export const rootReducer = combineReducers({
  user,
  location
});;
