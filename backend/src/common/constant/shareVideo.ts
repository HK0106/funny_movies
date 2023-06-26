export const SHARE_VIDEO_REPOSITORY = "SHARE_VIDEO_REPOSITORY";
export const REGEX_YOUTUBE_URL =
  /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

export const YOUTUBE_EMBED_URL_BASE = "https://www.youtube.com/embed/";
export const ERROR_MAP = {
  VIDEO_EXIST: "This video has been Shared!",
  VIDEO_URL_CANT_EXTRACT_ID: "This video url is not right!",
  CANT_GET_DATA_FROM_YOUTUBE: "Cant get data form youtube!",
};
