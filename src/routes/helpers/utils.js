import url from "url";
import $ from "cheerio";
import { v4 as uuidv4 } from "uuid";

/**
 *
 * @param {*} data
 * @returns {{ id: String,u: String,rating: String,img: String,title: String,ribon: String}[]}
 */
export const getObjectFromHtml = (data) => {
  return data
    .map((i, el) => {
      const u = url.parse($(el).attr("href")?.trim()).pathname?.split("/")[2];
      return {
        id: uuidv4(),
        u,
        rating: $(el).children(".r").text()?.trim(),
        img: $(el).children("img").attr("src")?.trim(),
        title: $(el).children(".title").text().trim(),
        ribon: $(el).children(".ribbon").text()?.trim(),
      };
    })
    .get();
};

/**
 *
 * @param {HTMLElement[]} data
 * @returns {{ id: String,u: String,rating: String,img: String,title: String,ribon: String}[]}
 */
export const getObjectFromHtml2 = (data) => {
  return data.map((el) => {
    const u = url
      .parse(el.getAttribute("href")?.trim())
      .pathname?.split("/")[2];
    return {
      id: uuidv4(),
      u,
      rating: el.querySelector(".r").text?.trim(),
      img: el.querySelector("img").getAttribute("src")?.trim(),
      title: el.querySelector(".title").text.trim(),
      ribon: el.querySelector(".ribbon").text?.trim(),
    };
  });
};

export const getObjectFromHtml3 = (data) => {
  return data.map((el) => {
    const u = url
      .parse(el.getAttribute("href")?.trim())
      .pathname?.split("/")[2];
    return {
      id: uuidv4(),
      u,
      rating: el.querySelector(".r").text?.trim(),
      img: el.querySelector("img").getAttribute("src")?.trim(),
      title: el.querySelector(".title").text.trim(),
      ribon: el.querySelector(".ribbon").text?.trim(),
    };
  });
};

export const getSingleObjectFromHtml = (el) => {
  const u = url.parse(el.getAttribute("href")?.trim()).pathname?.split("/")[2];
  return {
    id: uuidv4(),
    u,
    rating: el.querySelector(".r")?.text?.trim(),
    img: el.querySelector("img")?.getAttribute("src")?.trim(),
    title: el.querySelector(".title")?.text?.trim(),
    ribon: el.querySelector(".ribbon")?.text?.trim(),
  };
};
