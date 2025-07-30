module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define('Wallet', {
    wallet_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }
  }, {
    tableName: 'Wallet',
    timestamps: true
  });

  Wallet.associate = (models) => {
    Wallet.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
  };

  return Wallet;
}

