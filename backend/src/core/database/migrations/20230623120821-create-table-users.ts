"use strict";

import * as Sequelize from "sequelize";
const _tableName = "Users";

export async function up(i: any) {
  const queryInterface = i.getQueryInterface() as Sequelize.QueryInterface;

  return queryInterface
    .createTable(_tableName, {
      id: {
        type: Sequelize.INTEGER(),
        primaryKey: true,
        autoIncrement: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    })
    .then(() => {
      return queryInterface.addConstraint(_tableName, {
        fields: ["email"],
        type: "unique",
      });
    });
}

export async function down(i: any) {
  const queryInterface = i.getQueryInterface() as Sequelize.QueryInterface;

  return queryInterface.dropTable(_tableName, {
    cascade: true,
  });
}
