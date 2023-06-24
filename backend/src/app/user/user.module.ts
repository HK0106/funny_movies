import { Module } from "@nestjs/common";

/** Module */

/** Controller */
import { UserController } from "./user.controller";

/** Provider */
import { UserService } from "./user.service";
import { UserProvider } from "./user.provider";

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, ...UserProvider],
  exports: [UserService],
})
export class UserModule {}
