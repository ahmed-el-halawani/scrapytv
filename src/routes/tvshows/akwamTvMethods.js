import axios from "axios";
import { HOST, akwamHost, mediaType } from "../../utils/constants";
import { getObjectFromHtml2, getObjectFromHtml } from "../helpers/utils";
import { parse } from "node-html-parser";
import $ from "cheerio";
import { akwamSearch } from "..";
import { namesSearcher, namesSearcherForTv } from "../searchAlgorithm";

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

export const getTvShowSeasons1 = async ({
  names = null,
  releaseData = null,
}) => {
  console.log("شاةيشبسيب");
  let resData = {};
  let page = 1;
  while (1) {
    const data = await akwamSearch(names, releaseData, mediaType.tv, page);
    if (Object.values(data).length == 0) break;
    resData = {
      ...resData,
      ...data,
    };
    page++;
  }

  let newNames = [...names];

  names.forEach((element) => {
    newNames = [...newNames, element + "الموسم"];
  });

  console.log("شاةيشبسيب");

  let { watch, linkProierity } = namesSearcherForTv(
    newNames,
    Object.values(resData)
  );
  console.log({ watch });

  return { watch, linkProierity };
};

export const getTvShowSeasons = async ({ url = null, name = null }) => {
  // https://akwam.us/series/624/boruto-naruto-next-generations-%D8%A7%D9%84%D9%85%D9%88%D8%B3%D9%85-%D8%A7%D9%84%D8%A7%D9%88%D9%84
  const { data } = await axios.get(url ?? `${akwamHost}/series/${name}`);
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
