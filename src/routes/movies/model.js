import { v4 as uuidv4 } from "uuid";
import { parse } from "node-html-parser";
import url from "url";
import {
  getObjectFromHtml,
  getObjectFromHtml2,
  getSingleObjectFromHtml,
} from "../helpers/utils";
import { HOST } from "../../utils/constants";

/**
 * @typedef {object} movie
 * @property {number} id
 * @property {string} egybestId
 * @property {number} tmdbId
 * @property {string} akwamId
 * @property {string} poster_path
 * @property {boolean} adult
 * @property {string} overview
 * @property {string} release_date
 * @property {number[]} genre_ids
 * @property {string} original_title
 * @property {string} original_language
 * @property {string} title
 * @property {string} backdrop_path
 * @property {number} popularity
 * @property {number} vote_count
 * @property {boolean} video
 * @property {number} vote_average
 * @property {string} ribon
 */

export const emptyMovie = {
  id: 343611,
  egybestId: null,
  tmdbId: null,
  akwamId: null,
  adult: false,
  original_language: "en",
  poster_path: "",
  backdrop_path: null,
  original_title: null,
  title: null,
  overview: null,
  release_date: null,
  egybestWatchLink: null,
  vote_average: null,
  genre_ids: [],
  genres: [],
  videos: {},
  popularity: null,
  vote_count: null,
  video: false,
  ribon: null,
};
export const emptyVidoe = ({ name = null, key = null, size = "1080" }) => ({
  iso_639_1: "en",
  iso_3166_1: "US",
  name,
  key,
  site: "YouTube",
  size,
  type: "Trailer",
  official: true,
  published_at: "2014-10-02T19:20:22.000Z",
  id: uuidv4(),
});

/**
 * @param {HTMLElement[]} data
 * @returns {movie}
 */
export const toMovieFromEgybest = (data) => {
  const el = getSingleObjectFromHtml(data);
  return {
    ...emptyMovie,
    id: el.u,
    egybestId: el.u,
    title: el.title,
    original_title: String(el.title).replace(/\(.*/gm, "").trim(),
    poster_path: el.img,
    backdrop_path: el.img,
    link: HOST + "/movie/" + el.u,
    ribon: el.ribon,
    vote_average: el.rating,
    release_date: el.title.replace(")", "").split("(")[1],
  };
};

/**
 * @param {HTMLElement[]} data
 * @returns {movie}
 */
export const toMovieFromAkwam = (data) => {
  return getObjectFromHtml(data).map((el) => {
    return {
      ...emptyMovie,
      id: el.u,
      egybestId: el.u,
      title: el.title,
      original_title: el.title,
      poster_path: el.img,
      backdrop_path: el.img,
      ribon: el.ribon,
    };
  });
};

/**
 * @param {movie[]} data
 * @returns {movie}
 */
export const toMovieFromTmdb = (data) => {
  return data.map((json) => {
    return {
      ...emptyMovie,
      ...json,
      id: json.id,
      tmdbId: json.id,
    };
  });
};

export const getEgybestMovieDetails = async (res, id) => {
  res
    .querySelectorAll(".mbox")[2]
    .querySelectorAll("div.pda")[1]
    .querySelector("strong")
    ?.remove();
  let data = {};
  res.querySelectorAll("table.movieTable.full > tr").forEach((e) => {
    if (e.querySelector(".movie_title")) {
      data = {
        ...data,
        original_title: e.querySelector(".movie_title").text,
        title: e.querySelector(".movie_title").text,
        release_date: e
          .querySelector(".movie_title")
          .text.replace(")", "")
          .split("(")[1],
      };
    } else if (e.querySelector("td").text.includes("النوع")) {
      data = {
        ...data,
        genre_ids: e
          .querySelectorAll("td")[1]
          .querySelectorAll("a")
          .map((e) => e.getAttribute("href")),
        genres: e
          .querySelectorAll("td")[1]
          .querySelectorAll("a")
          .map((e) => ({
            id: e.getAttribute("href"),
            name: e.text,
          })),
      };
    } else if (e.querySelector("td")?.text?.includes("التقييم") ?? false) {
      data = {
        ...data,
        vote_average:
          e.querySelectorAll("td")[1]?.querySelectorAll("span")[0]?.text ??
          null,
      };
    } else {
      return undefined;
    }
  });

  return {
    ...emptyMovie,
    egybestWatchLink:
      HOST + res?.querySelector("div iframe")?.getAttribute("src"),
    id: id,

    egybestId: id,
    poster_path: res.querySelector(".movie_img img").getAttribute("src"),
    backdrop_path: res.querySelector(".movie_img img").getAttribute("src"),
    overview: res
      .querySelectorAll(".mbox")[2]
      .querySelectorAll("div.pda")[1]
      .text.trim(),
    ...data,
    video: res.querySelector("#yt_trailer > div") ? true : false,
    videos: {
      results: res.querySelector("#yt_trailer > div")
        ? [
            emptyVidoe({
              key: url
                .parse(
                  res.querySelector("#yt_trailer > div")?.getAttribute("url")
                )
                .pathname.split("/")[2],
              name: res
                .querySelectorAll(".mbox")[3]
                ?.querySelector("div.pda.bdb.hd")?.text,
              size: res
                .querySelector("#yt_trailer > div")
                ?.getAttribute("size"),
            }),
          ]
        : [],
    },
  };
};
