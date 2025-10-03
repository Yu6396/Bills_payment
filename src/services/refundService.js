// services/refundService.js
const { User,Wallet } = require("../../models");

async function refundUser(userId, amount, txn) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");
  const wallet = await Wallet.findOne({where:{user_id:userId}});
  wallet.balance = parseFloat(wallet.balance) + parseFloat(amount);
  await wallet.save();


  // Update txn
  await txn.update({ refunded: true });

  console.log(`💰 Refunded ${amount} to user ${userId}`);
  return true;
}

module.exports = refundUser;
