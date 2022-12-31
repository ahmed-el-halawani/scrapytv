export const PORT = process.env.PORT || 3030;
export const HOST = "https://geer.egybest.me";
export const CIMA4U = "https://live.cima4u.ws";
export const IsPROD = process.env.NODE_ENV === "production";
export const ProdLogFormate =
  ':id :remote-addr - :remote-user [:date [web]] " :method :url HTTP/:http-version"  :status  :res[content-length]';
export const akwamHost = "https://akwam.im";
export const tmdbKeyQuery = "api_key=4c4d52691317124be4457ce1cbe07bab";
export const tmdbHost = "https://api.themoviedb.org/3";

/**
 * @enum { String }
 */
export const mediaType = {
  movie: "movie",
  tv: "series",
};
/**
 * @enum { String }
 */
export const timeWindow = {
  day: "day",
  week: "week",
};
/**
 * @enum { String }
 */
export const egybestTimeWindow = {
  day: "today",
  week: "week",
};

/**
 * @enum { String }
 */
export const Category = {
  motargam: "مترجم",
  modablag: "مدبلج",
};
