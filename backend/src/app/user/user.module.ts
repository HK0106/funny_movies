import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

/** Module */

/** Controller */
import { UserController } from "./user.controller";

/** Provider */
import { UserService } from "./user.service";
import { UserProvider } from "./user.provider";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategy/jwt.strategy";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      privateKey: process.env.TOKEN_PRIVATE_KEY,
      signOptions: { expiresIn: Number(process.env.TOKEN_EXPIRES_IN) },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, ...UserProvider],
  exports: [UserService, JwtStrategy, PassportModule],
})
export class UserModule {}
