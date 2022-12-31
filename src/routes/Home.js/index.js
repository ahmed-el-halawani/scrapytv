import { initMovieTvTreands } from "../index";

export const Home = (route, pssid, isWorking) => {
  route.get("/", (req, res) => {
    res.send({
      start: "/start , start awaker",
      getegybestMovieLinks: "/getegybestMovieLinks/:name , name:movie name",
      getAkwamMovieLinks: "/getAkwamMovieLinks , name query: akwam movie name",
      initTreands: "/getAkwamMovieLinks , name query: akwam movie name",
      movies: "/movies , get trinding movie from egybest",
      isWorking: "/isWorking , is server working status",
      season: "/season/:name, season of the serius",
      series: "/series, get all season of the series",
    });
  });

  route.get("/WakUpDode", async (req, res) => {
    res.json("wacked up");
  });

  route.get("/initTreands", (req, res) => {
    initMovieTvTreands();
    res.status(200).json("done");
  });

  route.get("/isWorking", async (req, res) => {
    if (pssid == null) {
      initMovieTvTreands();
    }
    res.json({ isWorking });
  });
};
