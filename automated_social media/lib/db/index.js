import sequelize from "./sequelize";
import User from "./models/User";
import SocialAccount from "./models/SocialAccount";
import Post from "./models/Post";
import PostDelivery from "./models/PostDelivery";

// Setup Model Associations
User.hasMany(SocialAccount, { foreignKey: "user_id", as: "socialAccounts" });
SocialAccount.belongsTo(User, { foreignKey: "user_id", as: "user" });

User.hasMany(Post, { foreignKey: "user_id", as: "posts" });
Post.belongsTo(User, { foreignKey: "user_id", as: "user" });

Post.hasMany(PostDelivery, { foreignKey: "post_id", as: "deliveries" });
PostDelivery.belongsTo(Post, { foreignKey: "post_id", as: "post" });

SocialAccount.hasMany(PostDelivery, { foreignKey: "social_account_id", as: "deliveries" });
PostDelivery.belongsTo(SocialAccount, { foreignKey: "social_account_id", as: "socialAccount" });

let isInitialized = false;

export async function initDB() {
  if (isInitialized) return { isConnected: true };

  try {
    await sequelize.authenticate();
    // In dev mode, alter table schemas if needed
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true });
    }
    isInitialized = true;
    console.log("MySQL database connected and Sequelize models synchronized.");
    return { isConnected: true };
  } catch (error) {
    console.warn("MySQL database connection warning:", error.message);
    return { isConnected: false, error: error.message };
  }
}

export {
  sequelize,
  User,
  SocialAccount,
  Post,
  PostDelivery,
};
