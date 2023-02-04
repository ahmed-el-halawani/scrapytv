"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tvShowsRoutes = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _constants = require("../../utils/constants");

var _utils = require("../helpers/utils");

var _searchAlgorithm = require("../searchAlgorithm");

var _index = require("../index");

var _egybestTvMethods = require("./egybestTvMethods");

var _tmdbTvShow = require("./tmdbTvShow");

var _akwamTvMethods = require("./akwamTvMethods");

var _cima4uTvMethods = require("./cima4uTvMethods");

var _model = require("./model");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tvShowsRoutes = (route, pssid) => {
  route.get("/getPssid", async (req, res) => {
    res.json({
      pssid
    });
  });
  route.get("/akwamTvShow", async (req, res) => {}); // get popular tvs

  route.get("/egybest/tv/popular", async (req, res) => {
    try {
      const {
        page
      } = req.query;
      res.status(200).json((await (0, _egybestTvMethods.tvshows)(page)).data);
    } catch (error) {
      res.status(404).json({
        error
      });
    }
  }); // get seasons

  route.get("/egybest/search/tv", async (req, res) => {
    try {
      if (req.query.name == null) {
        throw "ep {name} query missing";
      }

      const names = (0, _index.getNamesFromReq)(req);
      names.map(e => e);
      const releaseDate = req.query["releasedate"];
      const resData = await (0, _index.egybestSearch)(names, releaseDate, _constants.mediaType.tv);
      res.json({
        resData
      });
    } catch (error) {
      res.status(404).json(error);
    }
  }); // get seasons

  route.get("/egybest/tv", async (req, res) => {
    try {
      let result;

      if (req.query.name || req.query.url) {
        result = await (0, _egybestTvMethods.getTvShowSeasons)({
          url: req.query.url,
          name: req.query.name
        });
      } else {
        return res.status(404).json({
          error: "name query missing "
        });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        error
      });
    }
  });
  route.get("/egybest/tv/season", async (req, res) => {
    try {
      let result;

      if (req.query.name || req.query.url) {
        result = await (0, _egybestTvMethods.getTvSeasonEpsods)({
          url: req.query.url,
          name: req.query.name
        });
      } else {
        return res.status(404).json({
          error: "name or url query  missing "
        });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        error
      });
    }
  });
  route.get("/egybest/tv/season/ep", async (req, res) => {
    try {
      let result;

      if (req.query.name || req.query.url) {
        result = await (0, _egybestTvMethods.getTvSeasonEpsodsWatchLink)({
          url: req.query.url,
          name: req.query.name
        });
      } else {
        throw "ep {name or url} query missing";
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        error
      });
    }
  });
  route.get("/egybest/tv/season/ep/video", async (req, res) => {
    try {
      let result;

      if (req.query.name || req.query.url) {
        result = await (0, _egybestTvMethods.getTvSeasonEpsodsWatchLink)({
          url: req.query.url,
          name: req.query.name
        });
        result = await (0, _index.scrapEgybestWatchLink)(result.watch);
      } else {
        throw "ep {name or url} query missing";
      }

      res.status(200).json({ ...(0, _model.epFromVideoLink)(result)
      });
    } catch (error) {
      res.status(404).json({
        error
      });
    }
  }); // _______________________

  route.get("/egybest/tv/season/getEpWatchLink", async (req, res) => {
    try {
      let result;

      if (req.query.name || req.query.url) {
        let ses = await (0, _egybestTvMethods.getTvShowSeasons)({
          url: req.query.url,
          name: req.query.name
        });
        if (!req.query.s_number) throw "{s_number} query missing";
        let sessonName = ses[req.query.s_number].u;
        ses = await (0, _egybestTvMethods.getTvSeasonEpsods)({
          name: sessonName
        });
        if (!req.query.ep_number) throw "{ep_number} query missing";
        ses = await (0, _egybestTvMethods.getTvSeasonEpsodsWatchLink)({
          name: ses[req.query.ep_number].u
        });
        result = await (0, _index.scrapEgybestWatchLink)(ses.watch);
      } else {
        throw "ep {name or url} query missing";
      }

      res.status(200).json({ ...(0, _model.epFromVideoLink)(result)
      });
    } catch (error) {
      res.status(404).json({
        error
      });
    }
  });
  route.get("/tvShows", async (req, res) => {
    const {
      page
    } = req.query;
    res.status(200).json((await (0, _egybestTvMethods.tvshows)(page)).data);
  });
  route.get("/tvshowsFromTmdb", async (req, res) => {
    const {
      page
    } = req.query;
    res.status(200).json((await (0, _index.prepareTvTreands)(page !== null && page !== void 0 ? page : 1)).page);
  });
  route.get("/SearchForTvEpsodeInEgybest", async (req, res) => {
    try {
      var _req$query$releasedat;

      if (req.query.name == null) {
        throw "ep {name} query missing";
      }

      const names = (0, _index.getNamesFromReq)(req);
      const releaseDate = (_req$query$releasedat = req.query["releasedate"]) !== null && _req$query$releasedat !== void 0 ? _req$query$releasedat : 0;
      const resData = await (0, _egybestTvMethods.getTvShow)({
        names,
        releaseDate
      });
      let ses = await (0, _egybestTvMethods.getTvShowSeasons)({
        url: resData.watch
      });
      if (!req.query.s_number) throw "{s_number} query missing";
      let sessonName = ses[req.query.s_number].u;
      ses = await (0, _egybestTvMethods.getTvSeasonEpsods)({
        name: sessonName
      });
      if (!req.query.ep_number) throw "{ep_number} query missing";
      ses = await (0, _egybestTvMethods.getTvSeasonEpsodsWatchLink)({
        name: ses[req.query.ep_number].u
      });
      const videoLink = await (0, _index.scrapEgybestWatchLink)(ses.watch);
      res.json({
        resData,
        ...(0, _model.epFromVideoLink)(videoLink)
      });
    } catch (error) {
      res.status(404).json(error);
    }
  });
  route.get("/SearchForTvInAkwam", async (req, res) => {
    try {
      var _req$query$releasedat2;

      if (req.query.name == null) {
        return res.status(404).send({
          error: {
            name: "missing name query"
          }
        });
      }

      const names = (0, _index.getNamesFromReq)(req);
      const releaseDate = (_req$query$releasedat2 = req.query["releasedate"]) !== null && _req$query$releasedat2 !== void 0 ? _req$query$releasedat2 : 0;
      const resData = await (0, _index.akwamSearch)(names, releaseDate, _constants.mediaType.tv);
      res.json(resData);
    } catch (error) {
      res.status(404).json(error);
    }
  });
  route.get("/searchForTvInTmdb", async (req, res) => {
    try {
      if (req.query.name == null) {
        return res.status(404).send({
          error: {
            name: "missing name query"
          }
        });
      }

      const names = (0, _index.getNamesFromReq)(req);
      const releaseDate = req.query["releasedata"];
      const resData = await (0, _tmdbTvShow.tmdbTvSearch2)(names, {
        releaseDate,
        page: req.query.page,
        language: req.query.language
      });
      res.json(resData);
    } catch (error) {
      res.status(404).json(error);
    }
  });
  route.get("/SearchForTvInEgybest", async (req, res) => {
    try {
      if (req.query.name == null) {
        throw "ep {name} query missing";
      }

      const names = (0, _index.getNamesFromReq)(req);
      names.map(e => e);
      const releaseDate = req.query["releasedate"];
      const resData = await (0, _index.egybestSearch)(names, releaseDate, _constants.mediaType.tv);
      res.json({
        resData
      });
    } catch (error) {
      res.status(404).json(error);
    }
  });
  route.get("/SearchForTvInCima4u", async (req, res) => {
    try {
      if (req.query.name == null) {
        throw "ep {name} query missing";
      }

      const names = (0, _index.getNamesFromReq)(req);
      names.map(e => e);
      const releaseDate = req.query["releasedate"];
      const resData = await (0, _cima4uTvMethods.cima4uSearch)(names, releaseDate);
      res.json({
        resData
      });
    } catch (error) {
      res.status(404).json(error);
    }
  });
};

exports.tvShowsRoutes = tvShowsRoutes;