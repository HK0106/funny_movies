import { Table, Column, Model, DataType } from "sequelize-typescript";

const tableName = "Users";

@Table({
  paranoid: true,
  tableName,
})
export class User extends Model {
  @Column
  videoId: string;

  @Column
  videoUrl: string;

  @Column
  title: string;

  @Column
  description: string;

  @Column
  set emailShare(value: string) {
    this.setDataValue("email", value.toLowerCase());
  }
}
