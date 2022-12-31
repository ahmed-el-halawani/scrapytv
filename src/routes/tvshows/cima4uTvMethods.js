import axios from "axios";
import { HOST, mediaType, CIMA4U } from "../../utils/constants";
import { getObjectFromHtml2, getObjectFromHtml } from "../helpers/utils";
import { parse } from "node-html-parser";
import $ from "cheerio";
import { egybestSearch } from "..";
import { namesSearcher } from "../searchAlgorithm";

const cima4uCategory = {
  motargam: "مترجمة",
  modablag: "مدبلج",
};
const cima4uType = {
  movie: "افلام",
  tv: "مسلسلات",
};

const cima4uNameFilter = [
  {
    traget: "مشاهدة",
    replcaer: "",
  },
  {
    traget: "مسلسل",
    replcaer: "",
  },
  {
    traget: /موسم.*/gm,
    replcaer: "مواسم",
  },
];

/**
 *
 * @param {string} name
 * @returns {string}
 */

const replacer = (name) => {
  cima4uNameFilter.forEach((e) => (name = name.replace(e.traget, e.replcaer)));
  return name.trim();
};

// {
//     traget: /موسم.*/gm,
//     replcaer: "",
//   },

export const cima4uSearch = async (
  names = [],
  releaseDate,
  type = cima4uType.tv
) => {
  try {
    const ax = names.map((e) => {
      console.log(`${CIMA4U}/Search?q=${e}`);
      return axios.get(encodeURI(`${CIMA4U}/Search?q=${e}`));
    });

    let resData = {};
    for (const res of ax) {
      parse((await res).data)
        .querySelectorAll(".Cima4uBlocks .MovieBlock a")
        .forEach((e) => {
          const catagory =
            replacer(e.querySelector(".BoxTitle").childNodes[1].text) +
            " " +
            (e
              .querySelector(".Thumb .Category")
              .text.includes(cima4uCategory.modablag)
              ? cima4uCategory.modablag
              : cima4uCategory.motargam);

          const sesson = e
            .querySelector(".BoxTitle")
            .childNodes[1].text.match(/موسم.*/gm)
            ? e
                .querySelector(".BoxTitle")
                .childNodes[1].text.match(/موسم.*/gm)[0]
                .replace("موسم", "")
                .trim()
            : e.querySelector(".BoxTitle").childNodes[1].text;
          if (e.querySelector("div.Thumb .Category").text.includes(type)) {
            resData = {
              ...resData,
              [catagory]: {
                title: replacer(
                  e.querySelector(".BoxTitle").childNodes[1].text
                ),

                sessonType: e
                  .querySelector(".BoxTitle")
                  .childNodes[1].text.match(/موسم/gm)
                  ? "sessons"
                  : "inside",

                sessons: {
                  ...resData[catagory]?.sessons,

                  [sesson]: e.getAttribute("href"),
                },

                poster: e
                  .querySelector(".Thumb .Half1")
                  .getAttribute("style")
                  .replace(/\)|;/gm, "")
                  .split("url(")[1],

                Category: e
                  .querySelector(".Thumb .Category")
                  .text.includes(cima4uCategory.modablag)
                  ? cima4uCategory.modablag
                  : cima4uCategory.motargam,
              },
            };
          }
        });
    }

    return resData;
  } catch (error) {
    console.log(error);
  }
};
