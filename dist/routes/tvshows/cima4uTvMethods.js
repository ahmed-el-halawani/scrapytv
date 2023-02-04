"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cima4uSearch = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _constants = require("../../utils/constants");

var _utils = require("../helpers/utils");

var _nodeHtmlParser = require("node-html-parser");

var _cheerio = _interopRequireDefault(require("cheerio"));

var _ = require("..");

var _searchAlgorithm = require("../searchAlgorithm");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cima4uCategory = {
  motargam: "مترجمة",
  modablag: "مدبلج"
};
const cima4uType = {
  movie: "افلام",
  tv: "مسلسلات"
};
const cima4uNameFilter = [{
  traget: "مشاهدة",
  replcaer: ""
}, {
  traget: "مسلسل",
  replcaer: ""
}, {
  traget: /موسم.*/gm,
  replcaer: "مواسم"
}];
/**
 *
 * @param {string} name
 * @returns {string}
 */

const replacer = name => {
  cima4uNameFilter.forEach(e => name = name.replace(e.traget, e.replcaer));
  return name.trim();
}; // {
//     traget: /موسم.*/gm,
//     replcaer: "",
//   },


const cima4uSearch = async (names = [], releaseDate, type = cima4uType.tv) => {
  try {
    const ax = names.map(e => {
      console.log(`${_constants.CIMA4U}/Search?q=${e}`);
      return _axios.default.get(encodeURI(`${_constants.CIMA4U}/Search?q=${e}`));
    });
    let resData = {};

    for (const res of ax) {
      (0, _nodeHtmlParser.parse)((await res).data).querySelectorAll(".Cima4uBlocks .MovieBlock a").forEach(e => {
        const catagory = replacer(e.querySelector(".BoxTitle").childNodes[1].text) + " " + (e.querySelector(".Thumb .Category").text.includes(cima4uCategory.modablag) ? cima4uCategory.modablag : cima4uCategory.motargam);
        const sesson = e.querySelector(".BoxTitle").childNodes[1].text.match(/موسم.*/gm) ? e.querySelector(".BoxTitle").childNodes[1].text.match(/موسم.*/gm)[0].replace("موسم", "").trim() : e.querySelector(".BoxTitle").childNodes[1].text;

        if (e.querySelector("div.Thumb .Category").text.includes(type)) {
          var _resData$catagory;

          resData = { ...resData,
            [catagory]: {
              title: replacer(e.querySelector(".BoxTitle").childNodes[1].text),
              sessonType: e.querySelector(".BoxTitle").childNodes[1].text.match(/موسم/gm) ? "sessons" : "inside",
              sessons: { ...((_resData$catagory = resData[catagory]) === null || _resData$catagory === void 0 ? void 0 : _resData$catagory.sessons),
                [sesson]: e.getAttribute("href")
              },
              poster: e.querySelector(".Thumb .Half1").getAttribute("style").replace(/\)|;/gm, "").split("url(")[1],
              Category: e.querySelector(".Thumb .Category").text.includes(cima4uCategory.modablag) ? cima4uCategory.modablag : cima4uCategory.motargam
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

exports.cima4uSearch = cima4uSearch;