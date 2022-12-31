import axios from "axios";
import {
  egybestTimeWindow,
  mediaType,
  timeWindow,
  tmdbKeyQuery,
} from "../../utils/constants";
import { toMovieFromTmdb } from "./model";

/**
 * @param {Object} trending
 * @param {mediaType} trending.media_type
 * @param {timeWindow} trending.time_window
 * @param {number} trending.page
 */
export const TmdbTrending = async ({
  media_type = mediaType.movie,
  time_window = timeWindow.day,
  page = 1,
}) => {
  const resData = await axios.get(
    `https://api.themoviedb.org/3/trending/${media_type}/${time_window}?${tmdbKeyQuery}&page=${page}`
  );

  return toMovieFromTmdb(resData.data["results"]);
};

/**
 * @param {Object} trending
 * @param {timeWindow} trending.time_window
 * @param {number} trending.page
 */
export const egybestMovieTrending = async ({
  time_window = egybestTimeWindow.day,
  page = 1,
}) => {
  if (req != null && req.query.page != null) {
    page = req.query.page;
  } else if (index != null) {
    page = index;
  }
  let data = null;
  data = (
    await axios.get(
      `${HOST}/trending/${time_window}?page=${page}&output_format=json`
    )
  ).data;

  try {
    data = toMovieFromEgybest($("div #movies", data.html).children("*"));
    return {
      page,
      data,
    };
  } catch (error) {
    return { error, e: "what is this error" };
  }
};

/**
 * @param {Object} trending
 * @param {mediaType} trending.media_type
 * @param {timeWindow} trending.time_window
 * @param {number} trending.page
 */
export const TmdbFilter = async ({
  media_type = mediaType.movie,
  time_window = timeWindow.day,
  page = 1,
}) => {
  const resData = await axios.get(
    `https://api.themoviedb.org/3/trending/${media_type}/${time_window}?${tmdbKeyQuery}&page=${page}`
  );

  return toMovieFromTmdb(resData.data["results"]);
};
