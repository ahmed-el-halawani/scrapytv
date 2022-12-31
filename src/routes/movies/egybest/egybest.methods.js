import axios from "axios";
import parse from "node-html-parser";
import { getEgybestWatchLink, scrapEgybestWatchLink } from "../..";
import {
  egybestTimeWindow,
  HOST,
  mediaType,
  timeWindow,
  tmdbKeyQuery,
} from "../../../utils/constants";
import { epFromVideoLink } from "../../tvshows/model";
import {
  emptyMovie,
  getEgybestMovieDetails,
  toMovieFromEgybest,
  toMovieFromTmdb,
} from "../model";

export const getEgybestMovieWithId = async (id) => {
  let res = axios.get(encodeURI(`${HOST}/movie/${id}?output_format=json`));
  console.log(`${HOST}/movie/${id}?output_format=json`);

  res = parse((await res).data["html"].replace("rn", "").replace("\\", ""));

  return getEgybestMovieDetails(res, id);
};

/**
 *
 * @param {HTMLElement} res
 * @returns
 */

// const getEgybestMovieWithName = async (req) => {
//   console.log("her 0");

//   let names = getNamesFromReq(req);

//   const releaseDate = req.query["releasedate"];
//   console.log({ releaseDate });

//   console.log("her -1");

//   const resData = Object.values(await egybestSearch(names, releaseDate));

//   console.log("her -2");

//   let { watch, linkProierity } = namesSearcher(names, resData);
// };

export const getEgybestVideoLinkFromId = async ({ id }) => {
  const watchLink = await getEgybestWatchLink(HOST + "/movie/" + id);

  const videoLink = await scrapEgybestWatchLink(watchLink);

  return {
    watchLink,
    ...(videoLink.error ? videoLink : epFromVideoLink(videoLink)),
    cors: true,
  };
};

export const MoviesTrendFromEgybest = async ({ page, period = "week" }) => {
  let { data } = await axios.get(`${HOST}/trending/${period}?page=${page}`);
  data = parse(data)
    .querySelectorAll("#movies > a.movie")
    .map((e) => toMovieFromEgybest(e));
  return {
    page,
    data,
  };
};
export const MoviesFromEgybest = async ({ page, fillter = "" }) => {
  let { data } = await axios.get(`${HOST}/movies/${fillter}?page=${page}`);
  data = parse(data)
    .querySelectorAll("#movies > a.movie")
    .map((e) => toMovieFromEgybest(e));
  return {
    page,
    data,
  };
};
