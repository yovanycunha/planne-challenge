export type SearchState = {
  query: string;
  response: Movie[];
  isResponseEmpty: boolean;
  loading: boolean;
  error: string | null;
};

export type SearchAction =
  | { type: "SET_QUERY"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_RESPONSE"; payload: Movie[] }
  | { type: "SET_ERROR"; payload: string | null };
