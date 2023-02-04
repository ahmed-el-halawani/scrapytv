"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Category = exports.egybestTimeWindow = exports.timeWindow = exports.mediaType = exports.tmdbHost = exports.tmdbKeyQuery = exports.akwamHost = exports.ProdLogFormate = exports.IsPROD = exports.CIMA4U = exports.HOST = exports.PORT = void 0;
const PORT = process.env.PORT || 3030;
exports.PORT = PORT;
const HOST = "https://geer.egybest.me";
exports.HOST = HOST;
const CIMA4U = "https://live.cima4u.ws";
exports.CIMA4U = CIMA4U;
const IsPROD = process.env.NODE_ENV === "production";
exports.IsPROD = IsPROD;
const ProdLogFormate = ':id :remote-addr - :remote-user [:date [web]] " :method :url HTTP/:http-version"  :status  :res[content-length]';
exports.ProdLogFormate = ProdLogFormate;
const akwamHost = "https://akwam.im";
exports.akwamHost = akwamHost;
const tmdbKeyQuery = "api_key=4c4d52691317124be4457ce1cbe07bab";
exports.tmdbKeyQuery = tmdbKeyQuery;
const tmdbHost = "https://api.themoviedb.org/3";
/**
 * @enum { String }
 */

exports.tmdbHost = tmdbHost;
const mediaType = {
  movie: "movie",
  tv: "series"
};
/**
 * @enum { String }
 */

exports.mediaType = mediaType;
const timeWindow = {
  day: "day",
  week: "week"
};
/**
 * @enum { String }
 */

exports.timeWindow = timeWindow;
const egybestTimeWindow = {
  day: "today",
  week: "week"
};
/**
 * @enum { String }
 */

exports.egybestTimeWindow = egybestTimeWindow;
const Category = {
  motargam: "مترجم",
  modablag: "مدبلج"
};
exports.Category = Category;