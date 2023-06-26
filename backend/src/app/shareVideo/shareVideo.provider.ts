import { SHARE_VIDEO_REPOSITORY } from "../../common/constant/shareVideo";
import { ShareVideo } from "../../core/database/models/shareVideo";

export const ShareVideoProvider = [
  {
    provide: SHARE_VIDEO_REPOSITORY,
    useValue: ShareVideo,
  },
];
