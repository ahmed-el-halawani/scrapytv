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
import * as akMethod from "./akwam.methods";
import {
  namesSearcher,
  setlinkProierityForMovies,
} from "../../searchAlgorithm";
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
const nameToTable = (n) => {
  let state = {};
  n.replace(/[.;:’,?%]/g, "")
    .split(" ")
    .forEach((e) => {
      state = {
        ...state,
        [e.toUpperCase()]: (state[e.toUpperCase()] ?? 0) + 1,
      };
    });

  return {
    title: n,
    state,
    length: n.split(" ").length,
  };
};

/**
 * @param {String[]} names
 * @param {{title: String;link: String;}[]} resData
 * @returns { {title: string;data: {title: string;state: {};length: number;};searchData: {NumberOfDist: number;NumberOfName: number;result: {};match: number;};percent: number;}[]}
 */
export const searcher = (names, resData) => {
  names = names.map((e) => nameToTable(e));

  const disNames = Object.values(resData).map((e) => ({
    ...e,
    ...nameToTable(e.title),
  }));

  let z = {};

  names.forEach((a) => {
    disNames.forEach((b) => {
      z = {
        ...z,
        [b.title]: {
          title: b.title,
          ...(z[b.title]
            ? matchCalc(a, b).percent > z[b.title]?.percent
              ? matchCalc(a, b)
              : z[b.title]
            : matchCalc(a, b)),
        },
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
const matchCalc = (a, b) => {
  let match = 0;

  let result = {};

  Object.keys(a.state).forEach((key) => {
    const value = a.state[key];
    let insideM = 0;
    const value2 = b.state[key];
    if (value2) {
      match += value2 >= value ? value : value2;
      insideM += value2 >= value ? value : value2;
    }
    result = {
      ...result,
      [key]: insideM,
    };
  });

  return {
    data: b,
    searchData: {
      NumberOfDist: b.length,
      NumberOfName: a.length,
      result,
      match,
    },
    percent: match / (b.length > a.length ? b.length : a.length),
  };
};

export const akwamMoviesRoute = (route, pssid) => {
  route.get("/test/test1", async (req, res) => {
    // try {
    const names = getNamesFromReq(req);

    const releaseDate = req.query["releasedate"];
    const resData = await akwamSearch(names, releaseDate, mediaType.movie);

    const searcherRes = searcher(names, resData);

    res.status(200).json(
      {
        data: searcherRes.sort((a, b) => b.percent - a.percent) ?? [],
        names,
      }
      // .map((e) => e.data)
    );
    // } catch (error) {
    //   res.status(404).json(error);
    // }
  });

  // route.get("/akwam/movie/trending", async (req, res) => {
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
