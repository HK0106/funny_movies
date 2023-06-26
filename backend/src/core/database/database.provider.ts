import { Sequelize } from "sequelize-typescript";
import { ConfigService } from "@nestjs/config";

import { User } from "./models/users";
import { ShareVideo } from "./models/shareVideo";

export const DatabaseProvider = [
  {
    provide: "SEQUELIZE",
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      // Get database configuration from configService
      const database: any = configService.get<any>("database");

      const sequelize = new Sequelize({
        ...database,
        models: [User, ShareVideo],
      });

      console.log("Connect database successfully!!!!");

      return sequelize;
    },
  },
];
