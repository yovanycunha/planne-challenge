import { URL } from "@/utils/utils";
import axios from "axios";

export const tmdbApi = axios.create({
  baseURL: URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIES_API}`,
  },
});
