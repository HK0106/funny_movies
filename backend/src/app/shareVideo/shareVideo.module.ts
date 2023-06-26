import { Module } from "@nestjs/common";
import { ShareVideoController } from "./shareVideo.controller";
import { ShareVideoService } from "./shareVideo.service";
import { ShareVideoProvider } from "./shareVideo.provider";
import { UserModule } from "../user/user.module";

@Module({
  imports: [UserModule],
  controllers: [ShareVideoController],
  providers: [ShareVideoService, ...ShareVideoProvider],
  exports: [ShareVideoService],
})
export class ShareVideoModule {}
