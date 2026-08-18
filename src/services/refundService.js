const {
  User,
  Wallet,
  Transaction,
  sequelize,
} = require("../../models");

async function refundUser(userId, amount, txn) {
  const t = await sequelize.transaction();

  try {
    const user = await User.findByPk(userId, {
      transaction: t,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const wallet = await Wallet.findOne({
      where: {
        user_id: userId,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const refundAmount = Number(amount);

    wallet.balance =
      Number(wallet.balance) + refundAmount;

    await wallet.save({
      transaction: t,
    });

    await Transaction.create(
      {
        user_id: userId,
        wallet_id: wallet.wallet_id,
        amount: refundAmount,
        type: "credit",
        status: "successful",
        payment_reference: txn.transaction_ref,
      },
      {
        transaction: t,
      }
    );

    await txn.update(
      {
        refunded: true,
      },
      {
        transaction: t,
      }
    );

    await t.commit();

    console.log(
      `💰 Refunded ${refundAmount} to user ${userId}`
    );

    return true;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

module.exports = refundUser;