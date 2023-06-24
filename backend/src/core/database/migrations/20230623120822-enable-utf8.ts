"use strict";

// module.exports = {
//   up: (queryInterface, Sequelize) => {
//     return queryInterface.sequelize.query(
//       `ALTER DATABASE ${process.env.DATABASE_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
//     );
//   },
//   down: (queryInterface, Sequelize) => {},
// };
"use strict";

import * as Sequelize from "sequelize";

export async function up(i: any) {
  const queryInterface = i.getQueryInterface() as Sequelize.QueryInterface;

  return queryInterface.sequelize.query(
    `ALTER DATABASE ${process.env.DATABASE_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  );
}

export async function down(i: any) {
  return;
}
