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
} from "../index";
import axios from "axios";
import $ from "cheerio";
import { HOST, akwamHost, tmdbKeyQuery, tmdbHost } from "../../utils/constants";
import { getObjectFromHtml } from "../helpers/utils";

import { parse } from "node-html-parser";
import { tmdbSearch } from "./tmdbMovie";
import { toMovieFromEgybest, toMovieFromTmdb } from "./model";
import { TmdbTrending } from "./methods";
import { egybestMoviesRoute } from "./egybest/egybest.route";

export const moviesRoute = (route, pssid) => {
  route.get("/movietest", async (req, res) => {
    const x = await getEgybestVideoLink(req);
    res.send(x);
  });

  route.get("/getegybestMovieLinks", async (req, res) => {
    if (pssid == null) {
      repetedRequest();
    }
    if (req.query.name == null) {
      return res.status(404).send({
        error: {
          name: "missing name query",
        },
      });
    }
    try {
      const result = await getEgybestVideoLink(req);
      res.status(200).json(result);
    } catch (e) {
      res.status(404).send(e);
    }
  });

  route.get("/getakwamMovieLinks", async (req, res) => {
    if (pssid == null) {
      repetedRequest();
    }
    if (req.query.name == null) {
      return res.status(404).send({
        error: {
          name: "missing name query",
        },
      });
    }
    try {
      const result = await getAkwamVidelLink(req);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        error,
      });
    }
  });

  // route.get("/SearchForMovieInEgybest", async (req, res) => {
  //   try {
  //     if (req.query.name == null) {
  //       return res.status(404).send({
  //         error: {
  //           name: "missing name query",
  //         },
  //       });
  //     }
  //     const names = getNamesFromReq(req);
  //     const releaseDate = req.query["releasedate"];

  //     console.log(names);
  //     console.log(releaseDate);

  //     const resData = await egybestSearch(names, releaseDate);
  //     res.json(resData);
  //   } catch (error) {
  //     res.status(404).json(error);
  //   }
  // });

  // route.get("/egybest/trending", async (req, res) => {
  //   try {
  //     const resData = await movies2({ req: req });
  //     res.json(resData);
  //   } catch (error) {
  //     res.status(404).json(error);
  //   }
  // });

  route.get("/SearchForMovieInAkwam", async (req, res) => {
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
      const resData = await akwamSearch(names, releaseDate);
      res.json(resData);
    } catch (error) {
      res.status(404).json(error);
    }
  });

  route.get("/getEgybestVideoLink2/:name", async (req, res) => {
    if (pssid == null) {
      repetedRequest();
    }
    if (req.params.name == null) {
      res.status(404).json({
        error: {
          name: "missing name query",
        },
      });
      return;
    }
    const url = (await getEgybestWatchLink(req.params.name)).watch;
    if (pssid == null) {
      console.log(req.params.name);
      const f = await getpssid3(url);
      console.log(f);
      if (f.error != null) {
        throw Exception(f.error != null);
      }
      res.status(200).json({
        first: f,
        playList: (await extractSourcesFromEgybestStream(f.href)).data,
      });
      return;
    }
    if (pssid != null) {
      try {
        const { data } = await axios.get(url, {
          headers: {
            Cookie: `PSSID=${pssid};`,
          },
        });

        const document = parse(data);

        var href = document.querySelector("#video_html5_api>source");

        if (href == null) {
          href = document.querySelector("#video>source");
        }

        if (href == null) {
          href = document.querySelector("video>source");
        }

        if (href != null) {
          href = href.getAttribute("src");
        }
        console.log(href);

        res.status(200).json({
          pssid,
          href,
          playList: (await extractSourcesFromEgybestStream(HOST + href)).data,
        });

        return;
      } catch (error) {
        console.log("i am in catch");
        // console.log(error);
        try {
          const f = await getpssid3(url);
          if (f.error != null) {
            throw Exception(f.error != null);
          }
          res.status(200).json({
            first: f,
            playList: (await extractSourcesFromEgybestStream(f.href)).data,
          });
          return;
        } catch (error) {
          res.status(404).json({ status: 404, error: "something want wrong" });
        }
      }
    }
  });

  // get trendig movies
  route.get("/movies", async (req, res) => {
    try {
      let movie = await movies(req);
      res.status(200).json(movie);
    } catch (error) {
      res.status(404).json({
        error: "Error_No_More_Data",
      });
    }
  });

  // get the url to watch either tv show or movie
  route.get("/watch/:name", async (req, res) => {
    res
      .status(200)
      .json({ watch: (await getEgybestWatchLink(req.params.name)).watch });
  });

  route.get("/search", async (req, res) => {
    const { q } = req.query;
    const { data } = await axios.get(`${HOST}/autoComplete.php`, {
      params: { q },
    });
    res.status(200).json(data);
  });

  route.get("/moviesFromTmdb", async (req, res) => {
    try {
      var toDayMovie = (await prepareTreands(req.query.page ?? "1")).page;
      if (toDayMovie.error == null) {
        res.status(200).json(Object.values(toDayMovie));
      } else {
        res.status(404).json(toDayMovie);
      }
    } catch (error) {
      res.status(404).json({
        error,
        line: 472,
      });
    }
  });

  route.get("/searhForMovieInTmdb", async (req, res) => {
    try {
      if (req.query.name == null) {
        return res.status(404).send({
          error: {
            name: "missing name query",
          },
        });
      }
      const names = getNamesFromReq(req);
      const releaseDate = req.query["releasedate"];
      const resData = await tmdbSearch(names, releaseDate);
      res.json(resData);
    } catch (error) {
      res.status(404).json(error);
    }
  });

  route.get("/tmdb/trending", async (req, res) => {
    try {
      const resData = await TmdbTrending({
        media_type: req.query.media_type,
        time_window: req.query.time_window,
        page: req.query.page,
      });

      res.json(resData);
    } catch (error) {
      res.status(404).json(error);
    }
  });

  //! ui
  route.get("/moviesFromTmdb/ui", async (req, res) => {
    try {
      var toDayMovie = (await prepareTreands(req.query.page ?? "1")).page;
      if (toDayMovie.error == null) {
        res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
        </head>
        <body>
        <h1>ui data</h1>
          ${JSON.stringify(Object.values(toDayMovie))}
        </body>
        </html>
        
        `);
      } else {
        res.status(404).json(toDayMovie);
      }
    } catch (error) {
      res.status(404).json({
        error,
        line: 472,
      });
    }
  });

  route.get("/movies/ui", async (req, res) => {
    try {
      let movie = await movies({ req });
      res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
        .movie {
          height: 300px;
          width: 200px;
          display: inline-block;
      }
      .img{
        width: 200px;
        height: 300px;
      }
      </style>
      </head>
      <body>
      <h1>ui data</h1>
        ${movie.data.map((e) =>
          e.img != undefined
            ? `<a href=${HOST + /movie/ + e.u} target="_blank" class="movie" >

            <image class="img" src=${e.img}></image>
          </a>`
            : "<div></div>"
        )}
      </body>
      </html>
      `);
    } catch (error) {
      res.status(404).json({
        error: "Error_No_More_Data",
      });
    }
  });
  //! end ui

  egybestMoviesRoute(route, pssid);
};
