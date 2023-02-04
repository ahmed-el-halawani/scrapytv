"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTvSeasonEpsodsWatchLink = exports.getTvSeasonEpsods = exports.getTvShowSeasons = exports.getTvShowSeasons1 = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _constants = require("../../utils/constants");

var _utils = require("../helpers/utils");

var _nodeHtmlParser = require("node-html-parser");

var _cheerio = _interopRequireDefault(require("cheerio"));

var _ = require("..");

var _searchAlgorithm = require("../searchAlgorithm");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// export const getAkwamTvSearies = async (req) => {
//   console.log("her 0");
//   let names = getNamesFromReq(req);
//   const releaseDate = req.query["releasedate"] ?? 0;
//   console.log(releaseDate);
//   console.log("her -1");
//   const resData = Object.values(await akwamSearch(names, releaseDate));
//   console.log({ resData });
//   console.log("her -2");
//   let { watch, linkProierity } = namesSearcher(names, resData);
//   console.log({ watch });
//   console.log("her -3");
//   if (watch == null) throw "no watch links";
//   console.log("her 1");
//   const movies = await scrapMoviesFromAkwam(watch);
//   return {
//     linkProierity,
//     ...movies,
//     releaseDate,
//     cors: false,
//   };
// };
const getTvShowSeasons1 = async ({
  names = null,
  releaseData = null
}) => {
  console.log("شاةيشبسيب");
  let resData = {};
  let page = 1;

  while (1) {
    const data = await (0, _.akwamSearch)(names, releaseData, _constants.mediaType.tv, page);
    if (Object.values(data).length == 0) break;
    resData = { ...resData,
      ...data
    };
    page++;
  }

  let newNames = [...names];
  names.forEach(element => {
    newNames = [...newNames, element + "الموسم"];
  });
  console.log("شاةيشبسيب");
  let {
    watch,
    linkProierity
  } = (0, _searchAlgorithm.namesSearcherForTv)(newNames, Object.values(resData));
  console.log({
    watch
  });
  return {
    watch,
    linkProierity
  };
};

exports.getTvShowSeasons1 = getTvShowSeasons1;

const getTvShowSeasons = async ({
  url = null,
  name = null
}) => {
  // https://akwam.us/series/624/boruto-naruto-next-generations-%D8%A7%D9%84%D9%85%D9%88%D8%B3%D9%85-%D8%A7%D9%84%D8%A7%D9%88%D9%84
  const {
    data
  } = await _axios.default.get(url !== null && url !== void 0 ? url : `${_constants.akwamHost}/series/${name}`);
  const result = (0, _utils.getObjectFromHtml)((0, _cheerio.default)("div .mbox .movies_small", data).first().children("*")).reverse();
  return result;
};

exports.getTvShowSeasons = getTvShowSeasons;

const getTvSeasonEpsods = async ({
  url = null,
  name = null
}) => {
  const {
    data
  } = await _axios.default.get(url !== null && url !== void 0 ? url : `${_constants.HOST}/season/${name}`);
  const result = (0, _utils.getObjectFromHtml)((0, _cheerio.default)("div .mbox .movies_small", data).first().children("*")).reverse();
  return result;
};

exports.getTvSeasonEpsods = getTvSeasonEpsods;

const getTvSeasonEpsodsWatchLink = async ({
  url = null,
  name = null
}) => {
  const {
    data
  } = await _axios.default.get((url !== null && url !== void 0 ? url : `${_constants.HOST}/episode/${name}`) + "/?output_format=json");
  const href = (0, _cheerio.default)("div iframe", data.html).attr("src");
  const watch = _constants.HOST + href;
  return {
    watch
  };
};

exports.getTvSeasonEpsodsWatchLink = getTvSeasonEpsodsWatchLink;