import axios from "axios";
import { tmdbHost, tmdbKeyQuery } from "../../utils/constants";

export const tmdbTvSearch = async (names, first_air_date) => {
  const ax = names.map((e) => {
    return axios.get(
      encodeURI(`${tmdbHost}/search/tv?${tmdbKeyQuery}&query=${e}`)
    );
  });

  let resData = {};

  for (const res of ax) {
    (await res).data["results"]
      .filter((e) => {
        if (first_air_date == null) return true;
        try {
          return String(e["first_air_date"]).includes(first_air_date);
        } catch (e) {
          return true;
        }
      })
      .forEach((e) => {
        resData = {
          ...resData,
          [e.original_name + "_" + e["first_air_date"]]: e,
        };
      });
  }

  return resData;
};

export const tmdbTvSearch2 = async (
  names,
  { releaseDate = null, page = 1, language = "en" }
) => {
  console.log({ releaseDate, page, language });
  const ax = names.map((e) => {
    return axios.get(
      encodeURI(
        `${tmdbHost}/search/tv?${tmdbKeyQuery}&query=${e}&year=${releaseDate}&page=${page}&language=${language}`
      )
    );
  });

  let resData = [];

  for (const res of ax) {
    (await res).data["results"]
      .filter((e) => {
        if (releaseDate == null) return true;
        try {
          return String(e["first_air_date"]).includes(releaseDate);
        } catch (e) {
          return true;
        }
      })
      .forEach((e) => {
        resData = [...resData, e];
      });
  }

  return resData;
};
