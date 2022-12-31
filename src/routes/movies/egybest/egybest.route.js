import {
  akwamSearch,
  extractSourcesFromEgybestStream,
  getNamesFromReq,
  getpssid3,
  initMovieTvTreands,
  movies,
  prepareTreands,
  repetedRequest,
  getEgybestWatchLink,
  egybestSearch,
  getAkwamVidelLink,
  getEgybestVideoLink,
  movies2,
} from "../../index";
import axios from "axios";
import $ from "cheerio";
import {
  HOST,
  akwamHost,
  tmdbKeyQuery,
  tmdbHost,
  mediaType,
} from "../../../utils/constants";
import { getObjectFromHtml } from "../../helpers/utils";
import { parse } from "node-html-parser";
import { toMovieFromEgybest, toMovieFromTmdb } from "../model";
import {
  getEgybestMovieWithId,
  getEgybestVideoLinkFromId,
  MoviesTrendFromEgybest,
  MoviesFromEgybest,
} from "./egybest.methods";
import { tvshows } from "../../tvshows/egybestTvMethods";
import {
  namesSearcher,
  setlinkProierityForMovies,
} from "../../searchAlgorithm";
// get popular tvs

export const egybestMoviesRoute = (route, pssid) => {
  route.get("/egybest/movie/trending", async (req, res) => {
    const { page } = req.query;
    res.status(200).json((await MoviesTrendFromEgybest({ page })).data);
  });

  route.get("/egybest/movies", async (req, res) => {
    const { page, fillter } = req.query;
    res.status(200).json((await MoviesFromEgybest({ page, fillter })).data);
  });

  // get seasons
  route.get("/egybest/movie", async (req, res) => {
    try {
      let result = null;
      if (req.query.id) {
        result = await getEgybestMovieWithId(req.query.id);
      } else if (req.query.name) {
        console.log("her 0");

        let names = getNamesFromReq(req);

        const releaseDate = req.query["releasedate"];

        const resData = Object.values(await egybestSearch(names, releaseDate));

        result = namesSearcher(names, resData);
        if (!result?.movie?.egybestId) throw "no movie was found";
        result = await getEgybestMovieWithId(result.movie.egybestId);
      } else {
        return res.status(404).json({
          error: "name | id query missing ",
        });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ error });
    }
  });

  route.get("/egybest/movie/video", async (req, res) => {
    try {
      let result;
      if (req.query.id) {
        result = await getEgybestVideoLinkFromId({ id: req.query.id });
      } else if (req.query.name) {
        result = await getEgybestVideoLink(req);
      } else {
        throw "ep {name or id} query missing";
      }
      res.status(200).json({ ...result });
    } catch (error) {
      res.status(404).json({ error });
    }
  });

  route.get("/egybest/search/movie", async (req, res) => {
    try {
      if (req.query.name == null) {
        throw "ep {name} query missing";
      }
      const names = getNamesFromReq(req);

      const releaseDate = req.query["releasedate"];
      const resData = await egybestSearch(names, releaseDate, mediaType.movie);

      const x = setlinkProierityForMovies(names, Object.values(resData));
      res.json(
        Object.values(x.linkProierity)
          .sort((a, b) => a.value - b.value)
          .map((e) => e.movie)
      );
    } catch (error) {
      res.status(404).json(error);
    }
  });
};
