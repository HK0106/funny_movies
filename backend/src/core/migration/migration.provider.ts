require("ts-node/register");

import { Inject } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import Umzug = require("umzug");
import { DatabaseProvider } from "../database/database.provider";

export class MigrationProvider {
  constructor(@Inject("SEQUELIZE") sequelize: typeof DatabaseProvider) {
    const umzug = new Umzug({
      migrations: {
        path: "src/core/database/migrations",
        params: [sequelize, Sequelize],
        pattern: /\.ts$/,
      },
      logging: console.log,
      storage: "sequelize",
      storageOptions: { sequelize },
    });

    // Migrate all
    umzug.up();
  }
}
