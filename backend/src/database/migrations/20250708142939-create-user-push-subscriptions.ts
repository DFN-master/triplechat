module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UserPushSubscriptions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Companies", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      endpoint: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      expirationTime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      keys_p256dh: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      keys_auth: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      browser: {
        type: Sequelize.STRING,
        allowNull: true
      },
      platform: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("UserPushSubscriptions");
  }
};
