/**
 *
 * @param {String} arabicStr
 */
export const arabicEnglishCleaner = (arabicStr) => {
  return arabicStr
    .replace(/(آ|إ)/g, "ا")
    .replace(/(ة)/g, "ه")
    .replace(/(ئ|ؤ)/g, "ء")
    .replace(/(ى)/g, "ي")
    .replace(
      "وال",

      "و ال"
    );
};

/**
 * @param {String[]} names
 * @param {{title: String;link: String;}[]} resData
 * @returns {{watch: string;linkProierity: {key:String;value:number;};}}
 */

export const setlinkProierityForMovies = (names, resData) => {
  console.log(resData);
  const linkProierity = {};
  for (const movie of resData) {
    try {
      if (movie == null) {
        continue;
      }
      const key = movie.link;
      if (movie == null || key == null) continue;
      const value = arabicEnglishCleaner(movie.title)
        .toUpperCase()
        .replace(/[.;:’,?%0-9]/, "")
        .split(" ")
        .filter((element) => {
          return (
            names.find((e) => {
              return arabicEnglishCleaner(e)
                .replace(/[.;:’,?%0-9]/, "")
                .toUpperCase()
                .split(" ")
                .includes(element);
            }) !== undefined
          );
        }).length;

      linkProierity[key] == null
        ? (linkProierity[key] = {
            link: key,
            value: Math.abs(value - movie.title.split(" ").length),
            movie,
          })
        : (linkProierity[key] = {
            ...linkProierity[key],
            link: key,

            movie,
            value:
              linkProierity[key].value +
              Math.abs(value - movie.title.split(" ").length),
          });
    } catch (e) {
      console.log("error in 415", e);
    }
  }
  return { linkProierity };
};

export const namesSearcher = (names, resData) => {
  const { linkProierity } = setlinkProierityForMovies(names, resData);

  const highestProierity = Math.min(
    ...Object.values(linkProierity).map((e) => e.value)
  );

  let watch = Object.values(linkProierity).find(
    (e) => e.value === highestProierity
  );

  return {
    names,
    watch: watch?.link,
    movie: watch?.movie,
  };
};

/**
 * @param {String[]} names
 * @param {{title: String;link: String;}[]} resData
 * @returns {{watch: string[];linkProierity: {key:String;value:number;};}}
 */

export const namesSearcherForTv = (names, resData) => {
  console.log(resData);
  const linkProierity = {};
  for (const movie of resData) {
    try {
      if (movie == null) {
        continue;
      }
      const key = movie.link;
      if (movie == null || key == null) continue;
      const value = arabicEnglishCleaner(movie.title)
        .toUpperCase()
        .replace(/[.;:’,?%]/g, "")
        .split(" ")
        .filter((element) => {
          return (
            names.find((e) => {
              return arabicEnglishCleaner(e)
                .replace(/[.;:’,?%]/g, "")
                .toUpperCase()
                .split(" ")
                .includes(element);
            }) !== undefined
          );
        }).length;

      linkProierity[key] == null
        ? (linkProierity[key] = Math.abs(value - movie.title.split(" ").length))
        : (linkProierity[key] += Math.abs(
            value - movie.title.split(" ").length
          ));
    } catch (e) {
      console.log("error in 415", e);
    }
  }

  const highestProierity = Math.min(...Object.values(linkProierity));

  let watch = Object.keys(linkProierity).filter(
    (e) => linkProierity[e] === highestProierity
  );

  console.log({
    names,
    resData,
    highestProierity,
    linkProierity,
    watch,
  });

  return {
    watch: watch ?? null,
    linkProierity,
  };
};
