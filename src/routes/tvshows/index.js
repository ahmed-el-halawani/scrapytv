import axios from "axios";
import $ from "cheerio";
import {
  HOST,
  akwamHost,
  tmdbKeyQuery,
  mediaType,
} from "../../utils/constants";
import { getObjectFromHtml } from "../helpers/utils";
import { arabicEnglishCleaner } from "../searchAlgorithm";
import {
  akwamSearch,
  getNamesFromReq,
  egybestSearch,
  prepareTvTreands,
  getpssid3,
  scrapEgybestWatchLink,
} from "../index";

import {
  getTvSeasonEpsodsWatchLink,
  getTvSeasonEpsods,
  getTvShowSeasons,
  tvshows,
  getTvShow,
} from "./egybestTvMethods";
import { tmdbTvSearch, tmdbTvSearch2 } from "./tmdbTvShow";
import { getTvShowSeasons1 } from "./akwamTvMethods";
import { cima4uSearch } from "./cima4uTvMethods";
import { epFromVideoLink } from "./model";

export const tvShowsRoutes = (route, pssid) => {
  route.get("/getPssid", async (req, res) => {
    res.json({ pssid });
  });

  route.get("/akwamTvShow", async (req, res) => {});

  // get popular tvs
  route.get("/egybest/tv/popular", async (req, res) => {
    try {
      const { page } = req.query;
      res.status(200).json((await tvshows(page)).data);
    } catch (error) {
      res.status(404).json({ error });
    }
  });

  // get seasons
  route.get("/egybest/search/tv", async (req, res) => {
    try {
      if (req.query.name == null) {
        throw "ep {name} query missing";
      }
      const names = getNamesFromReq(req);
      names.map((e) => e);

      const releaseDate = req.query["releasedate"];
      const resData = await egybestSearch(names, releaseDate, mediaType.tv);
      res.json({
        resData,
      });
    } catch (error) {
      res.status(404).json(error);
    }
  });

  // get seasons
  route.get("/egybest/tv", async (req, res) => {
    try {
      let result;
      if (req.query.name || req.query.url) {
        result = await getTvShowSeasons({
          url: req.query.url,
          name: req.query.name,
        });
      } else {
        return res.status(404).json({
          error: "name query missing ",
        });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ error });
    }
  });

  route.get("/egybest/tv/season", async (req, res) => {
    try {
      let result;
      if (req.query.name || req.query.url) {
        result = await getTvSeasonEpsods({
          url: req.query.url,
          name: req.query.name,
        });
      } else {
        return res.status(404).json({
          error: "name or url query  missing ",
        });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ error });
    }
  });

  route.get("/egybest/tv/season/ep", async (req, res) => {
    try {
      let result;
      if (req.query.name || req.query.url) {
        result = await getTvSeasonEpsodsWatchLink({
          url: req.query.url,
          name: req.query.name,
        });
      } else {
        throw "ep {name or url} query missing";
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ error });
    }
  });

  route.get("/egybest/tv/season/ep/video", async (req, res) => {
    try {
      let result;
      if (req.query.name || req.query.url) {
        result = await getTvSeasonEpsodsWatchLink({
          url: req.query.url,
          name: req.query.name,
        });
        result = await scrapEgybestWatchLink(result.watch);
      } else {
        throw "ep {name or url} query missing";
      }
      res.status(200).json({ ...epFromVideoLink(result) });
    } catch (error) {
      res.status(404).json({ error });
    }
  });

  // _______________________
  route.get("/egybest/tv/season/getEpWatchLink", async (req, res) => {
    try {
      let result;
      if (req.query.name || req.query.url) {
        let ses = await getTvShowSeasons({
          url: req.query.url,
          name: req.query.name,
        });
        if (!req.query.s_number) throw "{s_number} query missing";
        let sessonName = ses[req.query.s_number].u;
        ses = await getTvSeasonEpsods({ name: sessonName });
        if (!req.query.ep_number) throw "{ep_number} query missing";
        ses = await getTvSeasonEpsodsWatchLink({
          name: ses[req.query.ep_number].u,
        });
        result = await scrapEgybestWatchLink(ses.watch);
      } else {
        throw "ep {name or url} query missing";
      }
      res.status(200).json({ ...epFromVideoLink(result) });
    } catch (error) {
      res.status(404).json({ error });
    }
  });

  route.get("/tvShows", async (req, res) => {
    const { page } = req.query;
    res.status(200).json((await tvshows(page)).data);
  });

  route.get("/tvshowsFromTmdb", async (req, res) => {
    const { page } = req.query;
    res.status(200).json((await prepareTvTreands(page ?? 1)).page);
  });

  route.get("/SearchForTvEpsodeInEgybest", async (req, res) => {
    try {
      if (req.query.name == null) {
        throw "ep {name} query missing";
      }
      const names = getNamesFromReq(req);
      const releaseDate = req.query["releasedate"] ?? 0;
      const resData = await getTvShow({ names, releaseDate });

      let ses = await getTvShowSeasons({
        url: resData.watch,
      });
      if (!req.query.s_number) throw "{s_number} query missing";
      let sessonName = ses[req.query.s_number].u;
      ses = await getTvSeasonEpsods({ name: sessonName });
      if (!req.query.ep_number) throw "{ep_number} query missing";
      ses = await getTvSeasonEpsodsWatchLink({
        name: ses[req.query.ep_number].u,
      });
      const videoLink = await scrapEgybestWatchLink(ses.watch);
      res.json({
        resData,
        ...epFromVideoLink(videoLink),
      });
    } catch (error) {
      res.status(404).json(error);
    }
  });

  route.get("/SearchForTvInAkwam", async (req, res) => {
    try {
      if (req.query.name == null) {
        return res.status(404).send({
          error: {
            name: "missing name query",
          },
        });
      }
      const names = getNamesFromReq(req);
      const releaseDate = req.query["releasedate"] ?? 0;
      const resData = await akwamSearch(names, releaseDate, mediaType.tv);
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
            name: "missing name query",
          },
        });
      }
      const names = getNamesFromReq(req);
      const releaseDate = req.query["releasedata"];
      const resData = await tmdbTvSearch2(names, {
        releaseDate,
        page: req.query.page,
        language: req.query.language,
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
      const names = getNamesFromReq(req);
      names.map((e) => e);

      const releaseDate = req.query["releasedate"];
      const resData = await egybestSearch(names, releaseDate, mediaType.tv);
      res.json({
        resData,
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
      const names = getNamesFromReq(req);
      names.map((e) => e);

      const releaseDate = req.query["releasedate"];
      const resData = await cima4uSearch(names, releaseDate);
      res.json({
        resData,
      });
    } catch (error) {
      res.status(404).json(error);
    }
  });
};
