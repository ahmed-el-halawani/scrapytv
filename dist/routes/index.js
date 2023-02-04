"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sleep = sleep;
exports.default = exports.prepareTvTreands = exports.prepareTreands = exports.getNamesFromReq = exports.repetedRequest = exports.initMovieTvTreands = exports.egybestTrending = exports.egybestSearch = exports.akwamSearch = exports.getAkwamVidelLink = exports.getEgybestVideoLink = exports.extractSourcesFromEgybestStream = exports.scrapEgybestWatchLink = exports.getEgybestWatchLink = exports.getpssid3 = exports.movies = void 0;

var _express = _interopRequireDefault(require("express"));

var _axios = _interopRequireDefault(require("axios"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _constants = require("../utils/constants");

var _puppeteer = _interopRequireDefault(require("puppeteer"));

var _nodeHtmlParser = require("node-html-parser");

var _searchAlgorithm = require("./searchAlgorithm");

var _utils = require("./helpers/utils");

var _movies = require("./movies");

var _tvshows = require("./tvshows");

var _egybestTvMethods = require("./tvshows/egybestTvMethods");

var _hlsParser = require("hls-parser");

var _Home = require("./Home.js");

var _model = require("./movies/model");

var _model2 = require("./tvshows/model");

var _akwam = require("./movies/akwam/akwam.route");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// "puppeteer": "^10.0.0",
const route = _express.default.Router();

var pssid = null;
let repeterState = false;
let tmdbKeyQuery = "api_key=4c4d52691317124be4457ce1cbe07bab";
let trindingForToday = {};
let tvTrindingForToday = {};
let isWorking = true;
var wackupDode;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const movies = async ({
  req,
  index
}) => {
  let page = "1";

  if (req != null && req.query.page != null) {
    page = req.query.page;
  } else if (index != null) {
    page = index;
  }

  console.log(req != null);
  let {
    data
  } = await _axios.default.get(`${_constants.HOST}/trending/week?page=${page}&output_format=json`);

  try {
    data = (0, _utils.getObjectFromHtml)((0, _cheerio.default)("div #movies", data.html).children("*"));
    return {
      page,
      data
    };
  } catch (error) {
    return {
      error
    };
  }
};

exports.movies = movies;
var lastrequest = "";
route.post("/play", async (req, res) => {
  lastrequest = JSON.stringify({
    body: req.body,
    params: req.params,
    query: req.query,
    url: req.baseUrl
  });
  res.send(req.query["hub.challenge"]);
});
route.get("/play", async (req, res) => {
  lastrequest = JSON.stringify({
    body: req.body,
    params: req.params,
    query: req.query,
    url: req.baseUrl
  });
  res.send(req.query["hub.challenge"]);
});
route.get("/playIt", async (req, res) => {
  res.send(lastrequest);
});

const getpssid3 = async url => {
  if (url != null && url != "") {
    const browser = await _puppeteer.default.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    }); // const page = await browser.newPage();

    const page = (await (browser === null || browser === void 0 ? void 0 : browser.pages()))[0];
    await page.goto(url);
    (await page.$("._reload")).click();
    var href = await (await page.waitForSelector("#video_html5_api", {
      timeout: 20000
    })).evaluate(node => node.querySelector("source").src);
    console.log(href);

    if (href != null && href != "") {
      const x = await page.cookies();
      pssid = x.find(e => e.name == "PSSID").value;
      browser.close();
      pssid = pssid;
      return {
        pssid,
        href
      };
    } else {
      throw 'href != null && href != "" == false';
    }
  }
};

exports.getpssid3 = getpssid3;

const getEgybestWatchLink = async name => {
  const {
    data
  } = await _axios.default.get(`${name.replace("/?ref=search-p1", "")}/?output_format=json`);
  const href = (0, _cheerio.default)("div iframe", data.html).attr("src");
  const watch = _constants.HOST + href;
  return watch;
};

exports.getEgybestWatchLink = getEgybestWatchLink;

const scrapEgybestWatchLink = async url => {
  if (pssid == null) {
    const f = await getpssid3(url);
    return {
      status: 200,
      first: f,
      playList: (await extractSourcesFromEgybestStream(f.href)).data
    };
  }

  if (pssid != null) {
    try {
      const {
        data
      } = await _axios.default.get(url, {
        headers: {
          Cookie: `PSSID=${pssid};`
        }
      });
      const document = (0, _nodeHtmlParser.parse)(data);
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
      return {
        pssid,
        first: {
          pssid,
          href
        },
        playList: (await extractSourcesFromEgybestStream(_constants.HOST + href)).data
      };
    } catch (error) {
      console.log("i am in catch");

      try {
        const f = await getpssid3(url);

        if (f.error != null) {
          throw f.error != null;
        }

        return {
          status: 200,
          first: f,
          playList: (await extractSourcesFromEgybestStream(f.href)).data
        };
      } catch (error) {
        return {
          status: 404,
          error: "something want wrong"
        };
      }
    }
  }
};

exports.scrapEgybestWatchLink = scrapEgybestWatchLink;

const extractSourcesFromEgybestStream = async key => {
  const {
    data
  } = await _axios.default.get(key, {
    headers: {
      Cookie: `PSSID=${pssid};`
    }
  });
  const reader = (0, _hlsParser.parse)(data).variants;
  let x = [];
  reader.forEach(e => {
    x = [...x, { ...e,
      downloadLink: e.uri.replace("/stream/", "/dl/")
    }];
  });
  return {
    data: x
  };
};

exports.extractSourcesFromEgybestStream = extractSourcesFromEgybestStream;

const getEgybestVideoLink = async req => {
  console.log("her 0");
  let names = getNamesFromReq(req);
  const releaseDate = req.query["releasedate"];
  console.log({
    releaseDate
  });
  console.log("her -1");
  const resData = Object.values(await egybestSearch(names, releaseDate));
  console.log("her -2");
  let nameSearcherRes = (0, _searchAlgorithm.namesSearcher)(names, resData);
  console.log("her -3");
  if (nameSearcherRes.watch == null) throw "no watch links";
  console.log("her 1");
  const watchLink = await getEgybestWatchLink(nameSearcherRes.watch);
  const videoLink = await scrapEgybestWatchLink(watchLink);
  return {
    nameSearcherRes,
    watchLink,
    ...(0, _model2.epFromVideoLink)(videoLink),
    cors: true
  };
};

exports.getEgybestVideoLink = getEgybestVideoLink;

const scrapMoviesFromAkwam = async watch => {
  var _movieBody$querySelec;

  const movieBody = (0, _nodeHtmlParser.parse)((await _axios.default.get(encodeURI(watch))).data);
  let href = (_movieBody$querySelec = movieBody.querySelector(".link-show")) === null || _movieBody$querySelec === void 0 ? void 0 : _movieBody$querySelec.getAttribute("href");
  if (href == null) throw "href == null";
  watch = new URL(watch).pathname.replace("/movie", "");
  href = new URL(href).pathname;
  console.log("her 2");
  const watchLink = _constants.akwamHost + href + watch;
  const document = (0, _nodeHtmlParser.parse)((await _axios.default.get(encodeURI(watchLink))).data);
  console.log("her 3");
  const videoLinks = document.querySelector("#player").querySelectorAll("source").map(e => ({ ...e.attributes,
    downloadLink: e.attributes.src
  }));

  if (videoLinks != null && videoLinks.isEmpty) {
    throw "no watch links";
  }

  console.log("her 4");
  return {
    watch,
    href,
    watchLink,
    videoLinks
  };
};

const getAkwamVidelLink = async req => {
  var _req$query$releasedat;

  console.log("her 0");
  let names = getNamesFromReq(req);
  const releaseDate = (_req$query$releasedat = req.query["releasedate"]) !== null && _req$query$releasedat !== void 0 ? _req$query$releasedat : 0;
  console.log(releaseDate);
  console.log("her -1");
  const resData = Object.values(await akwamSearch(names, releaseDate));
  console.log({
    resData
  });
  console.log("her -2");
  let {
    watch,
    linkProierity
  } = (0, _searchAlgorithm.namesSearcher)(names, resData);
  console.log({
    watch
  });
  console.log("her -3");
  if (watch == null) throw "no watch links";
  console.log("her 1");
  const movies = await scrapMoviesFromAkwam(watch);
  return {
    linkProierity,
    ...movies,
    releaseDate,
    cors: false
  };
};
/**
 * @param {string[]} names
 * @param {number} releaseDate
 * @param {string} type
 * @returns {Promise<{title: String;link: String;}[]>}
 */


exports.getAkwamVidelLink = getAkwamVidelLink;

const akwamSearch = async (names = [], releaseDate = 0, type = _constants.mediaType.movie, page = 1) => {
  try {
    const ax = names.map(e => {
      console.log(encodeURI(_constants.akwamHost + `/search?q=${e}&year=${releaseDate}&rating=0&formats=0&quality=0&page=${page}`));
      return _axios.default.get(encodeURI(_constants.akwamHost + `/search?q=${e}&year=${releaseDate}&rating=0&formats=0&quality=0&page=${page}`));
    });
    let resData = {};

    for (const res of ax) {
      const xx = (0, _nodeHtmlParser.parse)((await res).data);
      xx.querySelectorAll(".entry-box").forEach(e => {
        console.log(e.innerHTML);
        resData = { ...resData,
          [e.querySelector(".text-white").text]: {
            title: e.querySelector(".text-white").text,
            link: e.querySelector(".text-white").getAttribute("href")
          }
        };
      });
    }

    return resData;
  } catch (error) {
    console.log(error);
  }
};
/**
 * @param {string[]} names
 * @param {number} releaseDate
 * @returns {Promise<{title: String;link: String;}>}
 */


exports.akwamSearch = akwamSearch;

const egybestSearch = async (names = [], releaseDate, type = "movie") => {
  try {
    const ax = names.map(e => {
      return _axios.default.get(encodeURI(`${_constants.HOST}/explore/?q=${e}&output_format=json`));
    });
    let resData = {};

    for (const res of ax) {
      (0, _nodeHtmlParser.parse)((await res).data["html"].replace("rn", "").replace("\\", "")).querySelectorAll("#movies>.movie").forEach(e => {
        if (e.getAttribute("href").includes(type)) {
          resData = { ...resData,
            [e.querySelector(".title").text]: { ...(0, _model.toMovieFromEgybest)(e),
              link: _constants.HOST + e.getAttribute("href"),
              category: e.querySelector(".title").text.includes(_constants.Category.modablag) ? _constants.Category.modablag : _constants.Category.motargam
            }
          };
        }
      });
    }

    return resData;
  } catch (error) {
    console.log(error);
  }
};

exports.egybestSearch = egybestSearch;

const egybestTrending = async (names = [], releaseDate, type = "movie") => {
  try {
    const ax = names.map(e => {
      return _axios.default.get(encodeURI(`${_constants.HOST}/explore/?q=${e}&output_format=json`));
    });
    let resData = {};

    for (const res of ax) {
      (0, _nodeHtmlParser.parse)((await res).data["html"].replace("rn", "").replace("\\", "")).querySelectorAll("#movies>.movie").forEach(e => {
        if (e.getAttribute("href").includes(type)) {
          resData = { ...resData,
            [e.querySelector(".title").text]: {
              title: e.querySelector(".title").text,
              link: _constants.HOST + e.getAttribute("href")
            }
          };
        }
      });
    }

    return resData;
  } catch (error) {
    console.log(error);
  }
};

exports.egybestTrending = egybestTrending;

const initMovieTvTreands = async () => {
  let page = 1;

  while (page < 15) {
    try {
      prepareTvTreands(page).then(e => console.log(`done tv ${e.index}`)).catch(e => console.log(`not done tv ${JSON.stringify(e)}`));
      prepareTreands(page).then(e => console.log(`done movie ${e.index}`)).catch(e => console.log(`not done movie ${JSON.stringify(e)}`));
      await sleep(1000);
    } catch (error) {
      console.log(error);
    }

    page++;
  }

  return;
};
/**
 * @param {string[]} names
 * @param {number} releaseDate
 * @returns {Promise<{title: String;link: String;}[]>}
 */


exports.initMovieTvTreands = initMovieTvTreands;

const repetedRequest = async () => {
  if (wackupDode != null) {
    clearTimeout(wackupDode);
  }

  wackupDode = setTimeout(repetedRequest, 1000 * 60 * 20);

  _axios.default.get("https://scrapytv.herokuapp.com/WakUpDode").then(e => console.log(e.data));
};

exports.repetedRequest = repetedRequest;

const getNamesFromReq = req => {
  let names = [];
  if (!req.query.name) throw "name query missing";

  if (typeof req.query["name"] === "object") {
    names = req.query["name"];
  } else {
    names = [req.query["name"]];
  }

  const releaseDate = req.query["releasedate"];
  const mySet = new Set();
  names.forEach(e => {
    mySet.add(e);
    mySet.add(e.toUpperCase());
    mySet.add(e.toUpperCase().replace(/[.;:’,?%]/g, ""));
    mySet.add((0, _searchAlgorithm.arabicEnglishCleaner)(e.toUpperCase()));
  });
  const x = [{
    key: "ا",
    value: /(آ)/g
  }, {
    key: "ا",
    value: /(أ)/g
  }, {
    key: "أ",
    value: /(ا)/g
  }, {
    key: "ا",
    value: /(إ)/g
  }, {
    key: "ة",
    value: /(ه)/g
  }, {
    key: "ه",
    value: /(ة)/g
  }, {
    key: "ء",
    value: /(ئ|ؤ)/g
  }, {
    key: "ي",
    value: /(ى)/g
  }, {
    key: "ى",
    value: /(ي)/g
  }, {
    key: "و ال",
    value: "وال"
  }, {
    key: "وال",
    value: "و ال"
  }, {
    key: "'",
    value: "’"
  }, {
    key: "’",
    value: "'"
  }];
  x.forEach(v => {
    names.forEach(name => {
      mySet.add(name.replace(v.value, v.key));
    });
  });

  if (releaseDate) {
    Array.from(mySet).forEach(e => mySet.add(e + " (" + releaseDate + ")"));
  }

  names = Array.from(mySet);
  return names;
};

exports.getNamesFromReq = getNamesFromReq;

const prepareTreands = async index => {
  let movieFromTmdbList = [];
  let toDayMovie = trindingForToday[index];

  if (toDayMovie == null) {
    let moviesList = await movies({
      index: index
    });

    if (moviesList.error != null) {
      throw {
        error: {
          page: index,
          message: "page not found",
          ...moviesList
        }
      };
    }

    for (const movie of moviesList.data) {
      if (movie.u == null) continue;

      try {
        var _tmdbMovie$backdrop_p, _tmdbMovie$poster_pat;

        let title = movie.title;
        let year = null;
        let name = title;

        if (title.indexOf("(") != -1) {
          year = movie.u.split("-");
          name = title.substr(0, title.indexOf("(")).trim();
        }

        const x = [{
          key: "ا",
          value: /(آ|إ)/g
        }, {
          key: "ه",
          value: /(ة)/g
        }, {
          key: "ه",
          value: /(ة)/g
        }, {
          key: "ء",
          value: /(ئ|ؤ)/g
        }, {
          key: "ي",
          value: /(ى)/g
        }, {
          key: "و ال",
          value: "وال"
        }];
        let names = new Set();
        x.forEach(value => {
          names.add(name.replace(value.value, value.key));
        });
        names.add((0, _searchAlgorithm.arabicEnglishCleaner)(name));
        names.add(name);
        let movieData = {
          year: year == null ? null : year[year.length - 1],
          name: encodeURI(name)
        };
        let tmdbMovieData = [];

        for (let name2 of Array.from(names)) {
          name2 = encodeURI(name2);
          tmdbMovieData = [...tmdbMovieData, ...(await _axios.default.get(`https://api.themoviedb.org/3/search/movie?query=${name2}&year=${movieData.year}&${tmdbKeyQuery}`)).data["results"]];
        }

        let tmdbMovie = (0, _searchAlgorithm.namesSearcher)(Array.from(names), tmdbMovieData.map((e, i) => ({
          title: e.original_title,
          link: i
        })));
        console.log(tmdbMovie);
        tmdbMovie = tmdbMovieData[tmdbMovie.watch];
        movieFromTmdbList.push({
          tmdbData: { ...tmdbMovie,
            year: movieData.year,
            backdrop_path: "https://image.tmdb.org/t/p/w500" + ((_tmdbMovie$backdrop_p = tmdbMovie.backdrop_path) !== null && _tmdbMovie$backdrop_p !== void 0 ? _tmdbMovie$backdrop_p : tmdbMovie.poster_path),
            poster_path: "https://image.tmdb.org/t/p/w500" + ((_tmdbMovie$poster_pat = tmdbMovie.poster_path) !== null && _tmdbMovie$poster_pat !== void 0 ? _tmdbMovie$poster_pat : tmdbMovie.backdrop_path)
          },
          egybestData: { ...movie,
            ...movieData
          }
        });
      } catch (error) {
        let title = movie.title;
        let year = null;
        let name = title;

        if (title.indexOf("(") != -1) {
          year = movie.u.split("-");
          name = title.substr(0, title.indexOf("(")).trim();
        }

        let movieData = {
          year: year == null ? null : year[year.length - 1],
          name: encodeURI(name),
          title2: (0, _searchAlgorithm.arabicEnglishCleaner)(name) + "++++++++++++++++++++++++++++++++++++===="
        };
        console.log({
          error
        });
        movieFromTmdbList.push({
          egybestData: { ...movie,
            ...movieData
          }
        });
      }
    }

    trindingForToday = { ...trindingForToday,
      [index]: movieFromTmdbList
    };
    return {
      index,
      page: movieFromTmdbList
    };
  } else {
    return {
      index,
      page: toDayMovie
    };
  }
};

exports.prepareTreands = prepareTreands;

const prepareTvTreands = async index => {
  let movieFromTmdbList = [];
  let toDayMovie = tvTrindingForToday[index];

  if (toDayMovie == null) {
    let moviesList = await (0, _egybestTvMethods.tvshows)(index);

    if (moviesList.error != null) {
      return {
        error: {
          page: index,
          message: "page not found",
          ...moviesList
        }
      };
    }

    for (const movie of moviesList.data) {
      if (movie.u == null) continue;

      try {
        var _tmdbMovie$backdrop_p2, _tmdbMovie$poster_pat2;

        let title = movie.title;
        let year = null;
        let name = title;
        const x = [{
          key: "ا",
          value: /(آ)/g
        }, {
          key: "ا",
          value: /(أ)/g
        }, {
          key: "ا",
          value: /(إ)/g
        }, {
          key: "ه",
          value: /(ة)/g
        }, {
          key: "ه",
          value: /(ة)/g
        }, {
          key: "ء",
          value: /(ئ|ؤ)/g
        }, {
          key: "ي",
          value: /(ى)/g
        }, {
          key: "و ال",
          value: "وال"
        }, {
          key: "",
          value: " مدبلج"
        }];
        let names = new Set();
        x.forEach(value => {
          names.add(name.replace(value.value, value.key));
        });
        names.add((0, _searchAlgorithm.arabicEnglishCleaner)(name));
        names.add(name);
        let movieData = {
          year: year == null ? null : year[year.length - 1],
          name: encodeURI(name)
        };
        let tmdbMovieData = [];

        for (let name2 of Array.from(names)) {
          name2 = encodeURI(name2);
          tmdbMovieData = [...tmdbMovieData, ...(await _axios.default.get(`https://api.themoviedb.org/3/search/tv?query=${name2}&${tmdbKeyQuery}`)).data["results"]];
        }

        let tmdbMovie = tmdbMovieData[0];
        movieFromTmdbList.push({
          tmdbData: { ...tmdbMovie,
            backdrop_path: "https://image.tmdb.org/t/p/w500" + ((_tmdbMovie$backdrop_p2 = tmdbMovie.backdrop_path) !== null && _tmdbMovie$backdrop_p2 !== void 0 ? _tmdbMovie$backdrop_p2 : tmdbMovie.poster_path),
            poster_path: "https://image.tmdb.org/t/p/w500" + ((_tmdbMovie$poster_pat2 = tmdbMovie.poster_path) !== null && _tmdbMovie$poster_pat2 !== void 0 ? _tmdbMovie$poster_pat2 : tmdbMovie.backdrop_path)
          },
          egybestData: { ...movie,
            ...movieData
          }
        });
      } catch (error) {
        let title = movie.title;
        let name = title;
        let movieData = {
          year: null,
          name: encodeURI(name),
          title2: (0, _searchAlgorithm.arabicEnglishCleaner)(name) + "++++++++++++++++++++++++++++++++++++===="
        };
        movieFromTmdbList.push({
          egybestData: { ...movie,
            ...movieData
          }
        });
      }
    }

    tvTrindingForToday = { ...tvTrindingForToday,
      [index]: movieFromTmdbList
    };
    return {
      index,
      page: movieFromTmdbList
    };
  } else {
    return {
      index,
      page: toDayMovie
    };
  }
};

exports.prepareTvTreands = prepareTvTreands;
(0, _movies.moviesRoute)(route, pssid);
(0, _tvshows.tvShowsRoutes)(route, pssid);
(0, _akwam.akwamMoviesRoute)(route, pssid);
(0, _Home.Home)(route, pssid, isWorking);
var _default = route;
exports.default = _default;