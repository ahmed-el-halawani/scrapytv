import axios from "axios";
import { HOST, mediaType } from "../../utils/constants";
import { getObjectFromHtml2, getObjectFromHtml } from "../helpers/utils";
import { parse } from "node-html-parser";
import $ from "cheerio";
import { egybestSearch } from "..";
import { namesSearcher } from "../searchAlgorithm";
import { toMovieFromEgybest } from "../movies/model";

export const getTvShow = async ({ names = null, releaseData = null }) => {
  const resData = await egybestSearch(names, releaseData, mediaType.tv);
  let { watch, linkProierity } = namesSearcher(names, Object.values(resData));
  return { watch, linkProierity };
};

export const tvshows = async (page) => {
  let { data } = await axios.get(`${HOST}/tv/popular?page=${page}`);
  data = getObjectFromHtml2(parse(data).querySelectorAll("#movies > a.movie"));
  return {
    page,
    data,
  };
};


export const getTvShowSeasons = async ({ url = null, name = null }) => {
  const { data } = await axios.get(url ?? `${HOST}/series/${name}`);
  const result = getObjectFromHtml(
    $("div .mbox .movies_small", data).first().children("*")
  ).reverse();

  return result;
};
export const getTvSeasonEpsods = async ({ url = null, name = null }) => {
  const { data } = await axios.get(url ?? `${HOST}/season/${name}`);
  const result = getObjectFromHtml(
    $("div .mbox .movies_small", data).first().children("*")
  ).reverse();
  return result;
};

export const getTvSeasonEpsodsWatchLink = async ({
  url = null,
  name = null,
}) => {
  const { data } = await axios.get(
    (url ?? `${HOST}/episode/${name}`) + "/?output_format=json"
  );

  const href = $("div iframe", data.html).attr("src");
  const watch = HOST + href;
  return { watch };
};
