"use strict";

import * as Sequelize from "sequelize";
const _tableName = "ShareVideos";

export async function up(i: any) {
  const queryInterface = i.getQueryInterface() as Sequelize.QueryInterface;

  return queryInterface
    .createTable(_tableName, {
      id: {
        type: Sequelize.INTEGER(),
        primaryKey: true,
        autoIncrement: true,
      },
      videoId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      videoUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      emailShare: {
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
        fields: ["videoId"],
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
