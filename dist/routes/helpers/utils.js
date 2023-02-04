"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSingleObjectFromHtml = exports.getObjectFromHtml3 = exports.getObjectFromHtml2 = exports.getObjectFromHtml = void 0;

var _url = _interopRequireDefault(require("url"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param {*} data
 * @returns {{ id: String,u: String,rating: String,img: String,title: String,ribon: String}[]}
 */
const getObjectFromHtml = data => {
  return data.map((i, el) => {
    var _url$parse$pathname, _$$attr, _$$children$text, _$$children$attr, _$$children$text2;

    const u = (_url$parse$pathname = _url.default.parse((_$$attr = (0, _cheerio.default)(el).attr("href")) === null || _$$attr === void 0 ? void 0 : _$$attr.trim()).pathname) === null || _url$parse$pathname === void 0 ? void 0 : _url$parse$pathname.split("/")[2];
    return {
      id: (0, _uuid.v4)(),
      u,
      rating: (_$$children$text = (0, _cheerio.default)(el).children(".r").text()) === null || _$$children$text === void 0 ? void 0 : _$$children$text.trim(),
      img: (_$$children$attr = (0, _cheerio.default)(el).children("img").attr("src")) === null || _$$children$attr === void 0 ? void 0 : _$$children$attr.trim(),
      title: (0, _cheerio.default)(el).children(".title").text().trim(),
      ribon: (_$$children$text2 = (0, _cheerio.default)(el).children(".ribbon").text()) === null || _$$children$text2 === void 0 ? void 0 : _$$children$text2.trim()
    };
  }).get();
};
/**
 *
 * @param {HTMLElement[]} data
 * @returns {{ id: String,u: String,rating: String,img: String,title: String,ribon: String}[]}
 */


exports.getObjectFromHtml = getObjectFromHtml;

const getObjectFromHtml2 = data => {
  return data.map(el => {
    var _url$parse$pathname2, _el$getAttribute, _el$querySelector$tex, _el$querySelector$get, _el$querySelector$tex2;

    const u = (_url$parse$pathname2 = _url.default.parse((_el$getAttribute = el.getAttribute("href")) === null || _el$getAttribute === void 0 ? void 0 : _el$getAttribute.trim()).pathname) === null || _url$parse$pathname2 === void 0 ? void 0 : _url$parse$pathname2.split("/")[2];
    return {
      id: (0, _uuid.v4)(),
      u,
      rating: (_el$querySelector$tex = el.querySelector(".r").text) === null || _el$querySelector$tex === void 0 ? void 0 : _el$querySelector$tex.trim(),
      img: (_el$querySelector$get = el.querySelector("img").getAttribute("src")) === null || _el$querySelector$get === void 0 ? void 0 : _el$querySelector$get.trim(),
      title: el.querySelector(".title").text.trim(),
      ribon: (_el$querySelector$tex2 = el.querySelector(".ribbon").text) === null || _el$querySelector$tex2 === void 0 ? void 0 : _el$querySelector$tex2.trim()
    };
  });
};

exports.getObjectFromHtml2 = getObjectFromHtml2;

const getObjectFromHtml3 = data => {
  return data.map(el => {
    var _url$parse$pathname3, _el$getAttribute2, _el$querySelector$tex3, _el$querySelector$get2, _el$querySelector$tex4;

    const u = (_url$parse$pathname3 = _url.default.parse((_el$getAttribute2 = el.getAttribute("href")) === null || _el$getAttribute2 === void 0 ? void 0 : _el$getAttribute2.trim()).pathname) === null || _url$parse$pathname3 === void 0 ? void 0 : _url$parse$pathname3.split("/")[2];
    return {
      id: (0, _uuid.v4)(),
      u,
      rating: (_el$querySelector$tex3 = el.querySelector(".r").text) === null || _el$querySelector$tex3 === void 0 ? void 0 : _el$querySelector$tex3.trim(),
      img: (_el$querySelector$get2 = el.querySelector("img").getAttribute("src")) === null || _el$querySelector$get2 === void 0 ? void 0 : _el$querySelector$get2.trim(),
      title: el.querySelector(".title").text.trim(),
      ribon: (_el$querySelector$tex4 = el.querySelector(".ribbon").text) === null || _el$querySelector$tex4 === void 0 ? void 0 : _el$querySelector$tex4.trim()
    };
  });
};

exports.getObjectFromHtml3 = getObjectFromHtml3;

const getSingleObjectFromHtml = el => {
  var _url$parse$pathname4, _el$getAttribute3, _el$querySelector, _el$querySelector$tex5, _el$querySelector2, _el$querySelector2$ge, _el$querySelector3, _el$querySelector3$te, _el$querySelector4, _el$querySelector4$te;

  const u = (_url$parse$pathname4 = _url.default.parse((_el$getAttribute3 = el.getAttribute("href")) === null || _el$getAttribute3 === void 0 ? void 0 : _el$getAttribute3.trim()).pathname) === null || _url$parse$pathname4 === void 0 ? void 0 : _url$parse$pathname4.split("/")[2];
  return {
    id: (0, _uuid.v4)(),
    u,
    rating: (_el$querySelector = el.querySelector(".r")) === null || _el$querySelector === void 0 ? void 0 : (_el$querySelector$tex5 = _el$querySelector.text) === null || _el$querySelector$tex5 === void 0 ? void 0 : _el$querySelector$tex5.trim(),
    img: (_el$querySelector2 = el.querySelector("img")) === null || _el$querySelector2 === void 0 ? void 0 : (_el$querySelector2$ge = _el$querySelector2.getAttribute("src")) === null || _el$querySelector2$ge === void 0 ? void 0 : _el$querySelector2$ge.trim(),
    title: (_el$querySelector3 = el.querySelector(".title")) === null || _el$querySelector3 === void 0 ? void 0 : (_el$querySelector3$te = _el$querySelector3.text) === null || _el$querySelector3$te === void 0 ? void 0 : _el$querySelector3$te.trim(),
    ribon: (_el$querySelector4 = el.querySelector(".ribbon")) === null || _el$querySelector4 === void 0 ? void 0 : (_el$querySelector4$te = _el$querySelector4.text) === null || _el$querySelector4$te === void 0 ? void 0 : _el$querySelector4$te.trim()
  };
};

exports.getSingleObjectFromHtml = getSingleObjectFromHtml;