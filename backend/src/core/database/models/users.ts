import { Table, Column, Model, DataType } from "sequelize-typescript";

const tableName = "Users";

@Table({
  paranoid: true,
  tableName,
})
export class User extends Model {

  @Column
  password: string;

  @Column
  set email(value: string) {
    this.setDataValue("email", value.toLowerCase());
  }
}
