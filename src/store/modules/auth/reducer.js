import axios from "../../../services/axios";
import * as types from "../types";

const initialState = {
  isLoggedIn: false,
  tokem: false,
  user: {},
  isLoading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.LOGIN_SUCCESS: {
      const newState = { ...state };
      newState.isLoggedIn = true;
      newState.tokem = action.payload.tokem;
      newState.user = action.payload.user;
      newState.function_id = action.payload.function_id;
      newState.isLoading = false;
      return newState;
    }
    case types.LOGIN_FAILURE: {
      delete axios.defaults.headers.Authorization;
      const newState = { ...initialState };
      return newState;
    }
    case types.LOGIN_REQUEST: {
      const newState = { ...state };
      newState.isLoading = true;
      return newState;
    }
    case types.REGISTER_UPDATE_SUCCESS: {
      const newState = { ...state };
      newState.isLoading = false;
      newState.user.nome = action.payload.nome;
      newState.user.email = action.payload.email;
      return newState;
    }
    case types.REGISTER_FAILURE: {
      const newState = { ...state };
      newState.isLoading = false;
      return newState;
    }
    case types.REGISTER_REQUEST: {
      const newState = { ...state };
      newState.isLoading = true;
      return newState;
    }
    case types.REGISTER_CREATED_SUCCESS: {
      const newState = { ...state };
      newState.isLoading = false;
      return newState;
    }

    default: {
      return state;
    }
  }
}
