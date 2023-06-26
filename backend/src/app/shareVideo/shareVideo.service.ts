import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ShareVideo } from "../../core/database/models/shareVideo";
import {
  REGEX_YOUTUBE_URL,
  SHARE_VIDEO_REPOSITORY,
  ERROR_MAP,
  YOUTUBE_EMBED_URL_BASE,
} from "../../common/constant/shareVideo";
import { ConfigService } from "@nestjs/config";
import { ShareVideoResponse } from "./interface/shareVideo.interface";
import { ShareVideoDto } from "./dto/shareVideo.dto";
import axios from "axios";

@Injectable()
export class ShareVideoService {
  shareVideoService: { findOne: jest.Mock<any, any>; };
  constructor(
    @Inject(SHARE_VIDEO_REPOSITORY)
    public shareVideoRepository: typeof ShareVideo,
    public configService: ConfigService,
  ) {}

  /**
   * List and count total record share video
   * @param page
   * @param size
   */
  async listAll(page, size): Promise<any> {
    let offset = 0;
    let limit = 10;

    if (page && size) {
      offset = (Number(page) - 1) * Number(size);
    }
    if (size) {
      limit = Number(size);
    }
    const operator = {
      limit,
      offset,
      attributes: [
        "id",
        "videoUrl",
        "title",
        "description",
        "emailShare",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    };
    return await this.shareVideoRepository
      .findAndCountAll(operator as any)
      .then((data) => {
        return {
          total: Number(data.count),
          data: data.rows,
        };
      });
  }
  /**
   * Share video from youtube service
   * @param videoUrl
   * @param email
   */
  async shareVideo(
    videoUrl: string,
    email: string,
  ): Promise<ShareVideoResponse> {
    const videoId: string = this.getVideoIdFromYoutubeURL(videoUrl);

    if (!videoId) {
      throw new HttpException(ERROR_MAP.VIDEO_URL_CANT_EXTRACT_ID, 402);
    }
    const videoExist = await this.findOneByVideoId(videoId);

    if (videoExist) {
      throw new HttpException(ERROR_MAP.VIDEO_EXIST, 401);
    }

    const externalData = await this.getDataVideoInformationFromYoutube(videoId);
    if (!externalData) {
      throw new HttpException(ERROR_MAP.CANT_GET_DATA_FROM_YOUTUBE, 500);
    }

    const embedUrl = `${YOUTUBE_EMBED_URL_BASE}${videoId}`;

    const shareVideo = await this.createShareVideo(
      videoId,
      externalData.title,
      embedUrl,
      externalData.description,
      email,
    );

    return { id: shareVideo.id, email: email, title: externalData.title };
  }

  /**
   * Create ShareVideo record
   * @param videoId
   * @param title
   * @param videoUrl
   * @param description
   * @param emailShare
   */
  createShareVideo(
    videoId: string,
    title: string,
    videoUrl: string,
    description: string,
    emailShare: string,
  ): Promise<ShareVideo> {
    return this.shareVideoRepository.create({
      videoId,
      title,
      videoUrl,
      description,
      emailShare: emailShare.toLowerCase(),
    });
  }

  /**
   * Get data form Youtube v3 API
   * @param videoId
   */
  async getDataVideoInformationFromYoutube(videoId: string): Promise<any> {
    try {
      const response: any = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${this.configService.get<string>(
          "googleApiKey",
        )}`,
      );
      return {
        title: response.data.items[0].snippet.title,
        description: response.data.items[0].snippet.description,
      };
    } catch (err) {
      console.log("[err axios call to youtube v3]", err);
    }
  }
  /**
   * Find one record share video by videoId
   * @param videoId
   */
  findOneByVideoId(videoId: string): Promise<ShareVideo> {
    return this.shareVideoRepository.findOne({
      where: {
        videoId,
      },
    });
  }
  /**
   * Extract video id from YouTube url
   * Ex: https://youtube.com/shorts/dQw4w9WgXcQ?feature=share => dQw4w9WgXcQ
   * @param videoUrl
   */
  getVideoIdFromYoutubeURL(videoUrl: string): string {
    const splitUrl = videoUrl.match(REGEX_YOUTUBE_URL);
    return splitUrl[1] ? splitUrl[1] : null;
  }
}
