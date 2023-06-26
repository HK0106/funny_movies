import { Table, Column, Model, DataType } from "sequelize-typescript";

const tableName = "ShareVideos";

@Table({
  paranoid: true,
  tableName,
})
export class ShareVideo extends Model {
  @Column
  videoId: string;

  @Column
  videoUrl: string;

  @Column
  title: string;

  @Column
  description: string;

  @Column
  emailShare: string;
}
