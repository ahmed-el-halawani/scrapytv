"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.akwamMoviesRoute = exports.searcher = void 0;

var _index = require("../../index");

var _axios = _interopRequireDefault(require("axios"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _constants = require("../../../utils/constants");

var _utils = require("../../helpers/utils");

var _nodeHtmlParser = require("node-html-parser");

var _model = require("../model");

var akMethod = _interopRequireWildcard(require("./akwam.methods"));

var _searchAlgorithm = require("../../searchAlgorithm");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// get popular tvs
// export const setlinkProierityForMovies = (names, resData) => {
//   const linkProierity = {};
//   for (const movie of resData) {
//     try {
//       if (movie == null) {
//         continue;
//       }
//       const key = movie.link;
//       if (movie == null || key == null) continue;
//       const value = arabicEnglishCleaner(movie.title)
//         .toUpperCase()
//         .replace(/[.;:’,?%0-9]/, "")
//         .split(" ")
//         .filter((element) => {
//           return (
//             names.find((e) => {
//               return arabicEnglishCleaner(e)
//                 .replace(/[.;:’,?%0-9]/, "")
//                 .toUpperCase()
//                 .split(" ")
//                 .includes(element);
//             }) !== undefined
//           );
//         }).length;
//       linkProierity[key] == null
//         ? (linkProierity[key] = {
//             link: key,
//             value: Math.abs(value - movie.title.split(" ").length),
//             movie,
//           })
//         : (linkProierity[key] = {
//             ...linkProierity[key],
//             link: key,
//             movie,
//             value:
//               linkProierity[key].value +
//               Math.abs(value - movie.title.split(" ").length),
//           });
//     } catch (e) {
//       console.log("error in 415", e);
//     }
//   }
//   return { linkProierity };
// };

/**
 *
 * @param {string} n
 */
const nameToTable = n => {
  let state = {};
  n.replace(/[.;:’,?%]/g, "").split(" ").forEach(e => {
    var _state$e$toUpperCase;

    state = { ...state,
      [e.toUpperCase()]: ((_state$e$toUpperCase = state[e.toUpperCase()]) !== null && _state$e$toUpperCase !== void 0 ? _state$e$toUpperCase : 0) + 1
    };
  });
  return {
    title: n,
    state,
    length: n.split(" ").length
  };
};
/**
 * @param {String[]} names
 * @param {{title: String;link: String;}[]} resData
 * @returns { {title: string;data: {title: string;state: {};length: number;};searchData: {NumberOfDist: number;NumberOfName: number;result: {};match: number;};percent: number;}[]}
 */


const searcher = (names, resData) => {
  names = names.map(e => nameToTable(e));
  const disNames = Object.values(resData).map(e => ({ ...e,
    ...nameToTable(e.title)
  }));
  let z = {};
  names.forEach(a => {
    disNames.forEach(b => {
      var _z$b$title;

      z = { ...z,
        [b.title]: {
          title: b.title,
          ...(z[b.title] ? matchCalc(a, b).percent > ((_z$b$title = z[b.title]) === null || _z$b$title === void 0 ? void 0 : _z$b$title.percent) ? matchCalc(a, b) : z[b.title] : matchCalc(a, b))
        }
      };
    });
  });
  return Object.values(z);
};
/**
 *
 * @param {{title: string;state: {};length: number;}} a
 * @param {{title: string;state: {};length: number;}} b
 * @returns
 */


exports.searcher = searcher;

const matchCalc = (a, b) => {
  let match = 0;
  let result = {};
  Object.keys(a.state).forEach(key => {
    const value = a.state[key];
    let insideM = 0;
    const value2 = b.state[key];

    if (value2) {
      match += value2 >= value ? value : value2;
      insideM += value2 >= value ? value : value2;
    }

    result = { ...result,
      [key]: insideM
    };
  });
  return {
    data: b,
    searchData: {
      NumberOfDist: b.length,
      NumberOfName: a.length,
      result,
      match
    },
    percent: match / (b.length > a.length ? b.length : a.length)
  };
};

const akwamMoviesRoute = (route, pssid) => {
  route.get("/test/test1", async (req, res) => {
    var _searcherRes$sort;

    // try {
    const names = (0, _index.getNamesFromReq)(req);
    const releaseDate = req.query["releasedate"];
    const resData = await (0, _index.akwamSearch)(names, releaseDate, _constants.mediaType.movie);
    const searcherRes = searcher(names, resData);
    res.status(200).json({
      data: (_searcherRes$sort = searcherRes.sort((a, b) => b.percent - a.percent)) !== null && _searcherRes$sort !== void 0 ? _searcherRes$sort : [],
      names
    } // .map((e) => e.data)
    ); // } catch (error) {
    //   res.status(404).json(error);
    // }
  }); // route.get("/akwam/movie/trending", async (req, res) => {
  //   const { page } = req.query;
  //   res.status(200).json((await MoviesTrendFromEgybest({ page })).data);
  // });
  // // get seasons
  // route.get("/akwam/movie", async (req, res) => {
  //   try {
  //     let result = null;
  //     if (req.query.id) {
  //       result = await getEgybestMovieWithId(req.query.id);
  //     } else if (req.query.name) {
  //       console.log("her 0");
  //       let names = getNamesFromReq(req);
  //       const releaseDate = req.query["releasedate"];
  //       const resData = Object.values(await egybestSearch(names, releaseDate));
  //       result = namesSearcher(names, resData);
  //       if (!result?.movie?.egybestId) throw "no movie was found";
  //       result = await getEgybestMovieWithId(result.movie.egybestId);
  //     } else {
  //       return res.status(404).json({
  //         error: "name | id query missing ",
  //       });
  //     }
  //     res.status(200).json(result);
  //   } catch (error) {
  //     res.status(404).json({ error });
  //   }
  // });
  // route.get("/akwam/movie/video", async (req, res) => {
  //   try {
  //     let result;
  //     if (req.query.id) {
  //       result = await getEgybestVideoLinkFromId({ id: req.query.id });
  //     } else if (req.query.name) {
  //       result = await getEgybestVideoLink(req);
  //     } else {
  //       throw "ep {name or url} query missing";
  //     }
  //     res.status(200).json({ ...result });
  //   } catch (error) {
  //     res.status(404).json({ error });
  //   }
  // });
  // route.get("/akwam/search/movie", async (req, res) => {
  //   try {
  //     if (req.query.name == null) {
  //       throw "ep {name} query missing";
  //     }
  //     const names = getNamesFromReq(req);
  //     names.map((e) => e);
  //     const releaseDate = req.query["releasedate"];
  //     const resData = await egybestSearch(names, releaseDate, mediaType.movie);
  //     const x = setlinkProierityForMovies(names, Object.values(resData));
  //     res.json(
  //       Object.values(x.linkProierity)
  //         .sort((a, b) => a.value - b.value)
  //         .map((e) => e.movie)
  //     );
  //   } catch (error) {
  //     res.status(404).json(error);
  //   }
  // });
};

exports.akwamMoviesRoute = akwamMoviesRoute;