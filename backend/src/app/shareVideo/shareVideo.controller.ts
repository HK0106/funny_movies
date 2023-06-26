import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ShareVideoService } from "./shareVideo.service";
import { AuthGuard } from "@nestjs/passport";
import { ShareVideoDto } from "./dto/shareVideo.dto";
import { ShareVideoResponse } from "./interface/shareVideo.interface";

@Controller("share-video")
export class ShareVideoController {
  constructor(private shareVideoService: ShareVideoService) {}

  @Post("shareVideo")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(AuthGuard())
  async shareVideo(
    @Body() shareVideo: ShareVideoDto,
    @Req() request: any,
  ): Promise<ShareVideoResponse> {
    return await this.shareVideoService.shareVideo(
      shareVideo.videoUrl,
      request.user.email,
    );
  }

  @Get("list-all")
  async listVideo(@Req() request: any) {
    return await this.shareVideoService.listAll(
      request.query.page,
      request.query.size,
    );
  }
}
