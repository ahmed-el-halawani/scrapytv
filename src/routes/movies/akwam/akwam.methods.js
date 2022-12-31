import axios from "axios";
import parse from "node-html-parser";
import { getEgybestWatchLink, scrapEgybestWatchLink } from "../..";
import {
  egybestTimeWindow,
  HOST,
  mediaType,
  timeWindow,
  tmdbKeyQuery,
} from "../../../utils/constants";
import { epFromVideoLink } from "../../tvshows/model";
import {
  emptyMovie,
  getEgybestMovieDetails,
  toMovieFromEgybest,
  toMovieFromTmdb,
} from "../model";
