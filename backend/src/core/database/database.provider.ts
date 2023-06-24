import {Sequelize} from "sequelize-typescript";
import {ConfigService} from "@nestjs/config";

import {User} from "./models/users";

export const DatabaseProvider = [
  {
    provide: "SEQUELIZE",
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      // Get database configuration from configService
      const database: any = configService.get<any>("database");

      const sequelize = new Sequelize({
        ...database,
        models: [
          User,
        ],
      });

      console.log("Connect database successfully!!!!");

      return sequelize;
    },
  },
];
