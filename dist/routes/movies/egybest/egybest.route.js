"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.egybestMoviesRoute = void 0;

var _index = require("../../index");

var _axios = _interopRequireDefault(require("axios"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _constants = require("../../../utils/constants");

var _utils = require("../../helpers/utils");

var _nodeHtmlParser = require("node-html-parser");

var _model = require("../model");

var _egybest = require("./egybest.methods");

var _egybestTvMethods = require("../../tvshows/egybestTvMethods");

var _searchAlgorithm = require("../../searchAlgorithm");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// get popular tvs
const egybestMoviesRoute = (route, pssid) => {
  route.get("/egybest/movie/trending", async (req, res) => {
    const {
      page
    } = req.query;
    res.status(200).json((await (0, _egybest.MoviesTrendFromEgybest)({
      page
    })).data);
  });
  route.get("/egybest/movies", async (req, res) => {
    const {
      page,
      fillter
    } = req.query;
    res.status(200).json((await (0, _egybest.MoviesFromEgybest)({
      page,
      fillter
    })).data);
  }); // get seasons

  route.get("/egybest/movie", async (req, res) => {
    try {
      let result = null;

      if (req.query.id) {
        result = await (0, _egybest.getEgybestMovieWithId)(req.query.id);
      } else if (req.query.name) {
        var _result, _result$movie;

        console.log("her 0");
        let names = (0, _index.getNamesFromReq)(req);
        const releaseDate = req.query["releasedate"];
        const resData = Object.values(await (0, _index.egybestSearch)(names, releaseDate));
        result = (0, _searchAlgorithm.namesSearcher)(names, resData);
        if (!((_result = result) === null || _result === void 0 ? void 0 : (_result$movie = _result.movie) === null || _result$movie === void 0 ? void 0 : _result$movie.egybestId)) throw "no movie was found";
        result = await (0, _egybest.getEgybestMovieWithId)(result.movie.egybestId);
      } else {
        return res.status(404).json({
          error: "name | id query missing "
        });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        error
      });
    }
  });
  route.get("/egybest/movie/video", async (req, res) => {
    try {
      let result;

      if (req.query.id) {
        result = await (0, _egybest.getEgybestVideoLinkFromId)({
          id: req.query.id
        });
      } else if (req.query.name) {
        result = await (0, _index.getEgybestVideoLink)(req);
      } else {
        throw "ep {name or id} query missing";
      }

      res.status(200).json({ ...result
      });
    } catch (error) {
      res.status(404).json({
        error
      });
    }
  });
  route.get("/egybest/search/movie", async (req, res) => {
    try {
      if (req.query.name == null) {
        throw "ep {name} query missing";
      }

      const names = (0, _index.getNamesFromReq)(req);
      const releaseDate = req.query["releasedate"];
      const resData = await (0, _index.egybestSearch)(names, releaseDate, _constants.mediaType.movie);
      const x = (0, _searchAlgorithm.setlinkProierityForMovies)(names, Object.values(resData));
      res.json(Object.values(x.linkProierity).sort((a, b) => a.value - b.value).map(e => e.movie));
    } catch (error) {
      res.status(404).json(error);
    }
  });
};

exports.egybestMoviesRoute = egybestMoviesRoute;