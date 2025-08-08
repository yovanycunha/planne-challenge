export type SearchState = {
  query: string;
  response: Movie[];
  isResponseEmpty: boolean;
  loading: boolean;
  error: string | null;
  isSearchEmpty: boolean;
  focusedIndex: number;
};

export type SearchAction =
  | { type: "SET_QUERY"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_RESPONSE"; payload: Movie[] }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_EMPTY_SEARCH"; payload: boolean }
  | { type: "APPEND_RESPONSE"; payload: Movie[] }
  | { type: "SET_FOCUSED_INDEX"; payload: number };
