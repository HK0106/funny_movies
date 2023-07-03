export enum ENDPOINT_API {
  login = "/user/login",
  createUser = "/user/register",
  listVideo = "/share-video/list-all",
  shareVideo = "/share-video/shareVideo"
}

export enum ROUTE_PATH {
  home = "/",

  shareMovie = "/share"
}

export enum HTTP_STATUS_CODE {
  OK = 200,

  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  EMAIL_NOT_REGISTER = 402,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
