import { Module } from "@nestjs/common";

import { MigrationProvider } from "./migration.provider";

@Module({
  providers: [MigrationProvider],
  exports: [MigrationProvider],
})
export class MigrationModule {}
