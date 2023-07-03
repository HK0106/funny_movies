import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

/** Modules */
import { DatabaseModule } from "./core/database/database.module";
import { MigrationModule } from "./core/migration/migration.module";
import { UserModule } from "./app/user/user.module";

/** Controllers */
import { AppController } from "./app.controller";
import { ShareVideoModule } from "./app/shareVideo/shareVideo.module";
/** Providers */
import { AppService } from "./app.service";
import configuration from "./config/configuration";
import { SocketGateway } from "./app.gateway";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [async () => configuration()],
      isGlobal: true,
      cache: true,
    }),
    DatabaseModule,
    MigrationModule,
    UserModule,
    ShareVideoModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule {}
