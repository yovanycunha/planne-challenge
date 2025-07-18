import { SearchAction, SearchState } from "@/types";

export const initialSearchState: SearchState = {
  query: "",
  response: [],
  isResponseEmpty: false,
  loading: false,
  error: null,
};

export function searchReducer(
  state: SearchState,
  action: SearchAction
): SearchState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_RESPONSE":
      return {
        ...state,
        response: action.payload,
        isResponseEmpty: action.payload.length === 0,
        loading: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}
