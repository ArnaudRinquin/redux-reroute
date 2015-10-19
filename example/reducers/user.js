import {
  SUBMIT_LOGIN,
  SUBMIT_LOGOUT
} from '../actions/login';

export default function userReducer(state = {}, {type, payload}) {
  switch (type) {
    case SUBMIT_LOGIN:
      return {
        ...state,
        authorized: true
      };
    case SUBMIT_LOGOUT:
      return {
        ...state,
        authorized: false
      };
    default:
      return state;
  }
}
