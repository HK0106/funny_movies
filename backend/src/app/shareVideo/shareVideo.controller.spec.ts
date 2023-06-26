import { HttpException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { Test, TestingModule } from "@nestjs/testing";
import { ShareVideoService } from "./shareVideo.service";
import { ShareVideo } from "../../core/database/models/shareVideo";
import {
  SHARE_VIDEO_REPOSITORY,
} from "../../common/constant/shareVideo";

describe("ShareVideoService", () => {
  let service: ShareVideoService;
  let shareVideoRepository: typeof ShareVideo;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShareVideoService,
        {
          provide: SHARE_VIDEO_REPOSITORY,
          useClass: MockShareVideoRepository, // Create a mock repository for testing
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue("mockApiKey"),
          },
        },
      ],
    }).compile();

    service = module.get<ShareVideoService>(ShareVideoService);
    shareVideoRepository = module.get<typeof ShareVideo>(
      SHARE_VIDEO_REPOSITORY,
    );
    configService = module.get<ConfigService>(ConfigService);
  });

  describe("shareVideo", () => {
    const videoUrl = "https://www.youtube.com/watch?v=video1";
    const email = "test@example.com";

    it("should share a video and return the share video response", async () => {
      const videoId = "video1";
      const expectedResponse = {
        id: 1,
        email: email,
        title: "Video 1",
      };

      jest.spyOn(service, "getVideoIdFromYoutubeURL").mockReturnValue(videoId);
      jest.spyOn(service, "findOneByVideoId").mockResolvedValue(null);
      jest
        .spyOn(service, "getDataVideoInformationFromYoutube")
        .mockResolvedValue({
          title: "Video 1",
          description: "Description 1",
        });
      jest.spyOn(service, "createShareVideo").mockResolvedValue({
        id: 1,
        videoId: "video1",
        title: "Video 1",
        videoUrl: "https://www.youtube.com/embed/video1",
        description: "Description 1",
        emailShare: email,
        createdAt: new Date(),
      } as any);

      const result = await service.shareVideo(videoUrl, email);

      expect(service.getVideoIdFromYoutubeURL).toHaveBeenCalledWith(videoUrl);
      expect(service.findOneByVideoId).toHaveBeenCalledWith(videoId);
      expect(service.getDataVideoInformationFromYoutube).toHaveBeenCalledWith(
        videoId,
      );
      expect(service.createShareVideo).toHaveBeenCalledWith(
        videoId,
        "Video 1",
        "https://www.youtube.com/embed/video1",
        "Description 1",
        email,
      );
      expect(result).toEqual(expectedResponse);
    });

    it("should throw an HttpException if the video URL is invalid", async () => {
      jest.spyOn(service, "getVideoIdFromYoutubeURL").mockReturnValue(null);

      await expect(service.shareVideo(videoUrl, email)).rejects.toThrowError(
        HttpException,
      );
      expect(service.getVideoIdFromYoutubeURL).toHaveBeenCalledWith(videoUrl);
    });

    it("should throw an HttpException if the video already exists", async () => {
      const videoId = "video1";

      jest.spyOn(service, "getVideoIdFromYoutubeURL").mockReturnValue(videoId);
      jest.spyOn(service, "findOneByVideoId").mockResolvedValue({
        id: 1,
        videoId: "video1",
        title: "Video 1",
        videoUrl: "https://www.youtube.com/embed/video1",
        description: "Description 1",
        emailShare: "test@example.com",
        createdAt: new Date(),
      } as any);

      await expect(service.shareVideo(videoUrl, email)).rejects.toThrowError(
        HttpException,
      );
      expect(service.getVideoIdFromYoutubeURL).toHaveBeenCalledWith(videoUrl);
      expect(service.findOneByVideoId).toHaveBeenCalledWith(videoId);
    });

    it("should throw an HttpException if unable to get data from YouTube", async () => {
      const videoId = "video1";

      jest.spyOn(service, "getVideoIdFromYoutubeURL").mockReturnValue(videoId);
      jest.spyOn(service, "findOneByVideoId").mockResolvedValue(null);
      jest
        .spyOn(service, "getDataVideoInformationFromYoutube")
        .mockResolvedValue(null);

      await expect(service.shareVideo(videoUrl, email)).rejects.toThrowError(
        HttpException,
      );
      expect(service.getVideoIdFromYoutubeURL).toHaveBeenCalledWith(videoUrl);
      expect(service.findOneByVideoId).toHaveBeenCalledWith(videoId);
      expect(service.getDataVideoInformationFromYoutube).toHaveBeenCalledWith(
        videoId,
      );
    });
  });

  describe("createShareVideo", () => {
    it("should create a share video record and return the created share video object", async () => {
      const videoId = "video1";
      const title = "Video 1";
      const videoUrl = "https://www.youtube.com/embed/video1";
      const description = "Description 1";
      const emailShare = "test@example.com";
      const expectedShareVideo = {
        id: 1,
        videoId: videoId,
        title: title,
        videoUrl: videoUrl,
        description: description,
        emailShare: emailShare.toLowerCase(),
        createdAt: new Date(),
      };

      jest
        .spyOn(service.shareVideoRepository, "create")
        .mockResolvedValue(expectedShareVideo);

      const shareVideo = await service.createShareVideo(
        videoId,
        title,
        videoUrl,
        description,
        emailShare,
      );

      expect(service.shareVideoRepository.create).toHaveBeenCalledWith({
        videoId: videoId,
        title: title,
        videoUrl: videoUrl,
        description: description,
        emailShare: emailShare.toLowerCase(),
      });
      expect(shareVideo).toEqual(expectedShareVideo);
    });
  });

  describe("getDataVideoInformationFromYoutube", () => {
    it("should return video information from YouTube API", async () => {
      const videoId = "video1";
      const youtubeApiKey = "API_KEY";
      const responseData = {
        items: [
          {
            snippet: {
              title: "Video 1",
              description: "Description 1",
            },
          },
        ],
      };

      jest.spyOn(service.configService, "get").mockReturnValue(youtubeApiKey);
      jest.spyOn(axios, "get").mockResolvedValue({ data: responseData });

      const result = await service.getDataVideoInformationFromYoutube(videoId);

      expect(service.configService.get).toHaveBeenCalledWith("googleApiKey");
      expect(axios.get).toHaveBeenCalledWith(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`,
      );
      expect(result).toEqual({
        title: "Video 1",
        description: "Description 1",
      });
    });

  });

  describe("findOneByVideoId", () => {
    it("should find and return a share video by videoId", async () => {
      const videoId = "video1";
      const expectedShareVideo = {
        id: 1,
        videoId: videoId,
        title: "Video 1",
        videoUrl: "https://www.youtube.com/embed/video1",
        description: "Description 1",
        emailShare: "test@example.com",
        createdAt: new Date(),
      };

      jest
        .spyOn(service.shareVideoRepository, "findOne")
        .mockResolvedValue(expectedShareVideo as any);

      const shareVideo = await service.findOneByVideoId(videoId);

      expect(service.shareVideoRepository.findOne).toHaveBeenCalledWith({
        where: {
          videoId: videoId,
        },
      });
      expect(shareVideo).toEqual(expectedShareVideo);
    });
  });

  describe("getVideoIdFromYoutubeURL", () => {
    it("should extract and return the video ID from a YouTube URL", () => {
      const videoUrl = "https://www.youtube.com/watch?v=video1";
      const videoId = service.getVideoIdFromYoutubeURL(videoUrl);

      expect(videoId).toBe("video1");
    });

    it("should return null if the YouTube URL is invalid", () => {
      const videoUrl = "https://www.invalidurl.com/watch?v=";
      const videoId = service.getVideoIdFromYoutubeURL(videoUrl);

      expect(videoId).toBeNull();
    });
  });
});
class MockShareVideoRepository {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  findOne() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  create() {}
}
