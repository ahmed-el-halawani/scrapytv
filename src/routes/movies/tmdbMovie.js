import axios from "axios";
import { tmdbHost, tmdbKeyQuery } from "../../utils/constants";
import { toMovieFromTmdb } from "./model";

export const tmdbSearch = async (names, releaseDate) => {
  const ax = names.map((e) => {
    return axios.get(
      encodeURI(
        `${tmdbHost}/search/movie?${tmdbKeyQuery}&query=${e}&year=${releaseDate}`
      )
    );
  });
  let resData = [];
  for (const res of ax) {
    (await res).data["results"].forEach((e) => {
      resData = [...resData, e];
    });
  }

  return toMovieFromTmdb(resData);
};
