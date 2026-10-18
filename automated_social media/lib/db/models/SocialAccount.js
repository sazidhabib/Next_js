import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";
import { encryptToken, decryptToken } from "../../security/encryption";

class SocialAccount extends Model {
  getDecryptedTokens() {
    return {
      accessToken: decryptToken(this.encrypted_access_token),
      refreshToken: decryptToken(this.encrypted_refresh_token),
    };
  }

  isTokenExpired() {
    if (!this.token_expires_at) return false;
    // Check if within 5 minutes of expiration
    return new Date(this.token_expires_at).getTime() - Date.now() < 5 * 60 * 1000;
  }
}

SocialAccount.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    provider: {
      type: DataTypes.ENUM("linkedin", "facebook", "instagram", "twitter", "youtube"),
      allowNull: false,
    },
    account_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    account_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Platform external user or page ID",
    },
    encrypted_access_token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    encrypted_refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    token_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Profile avatar, handle, page details",
    },
  },
  {
    sequelize,
    modelName: "SocialAccount",
    tableName: "social_accounts",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "provider", "account_id"],
      },
    ],
  }
);

// Encrypt tokens before saving
SocialAccount.beforeSave((account) => {
  if (account.changed("encrypted_access_token") && account.encrypted_access_token) {
    if (!account.encrypted_access_token.includes(":")) {
      account.encrypted_access_token = encryptToken(account.encrypted_access_token);
    }
  }
  if (account.changed("encrypted_refresh_token") && account.encrypted_refresh_token) {
    if (!account.encrypted_refresh_token.includes(":")) {
      account.encrypted_refresh_token = encryptToken(account.encrypted_refresh_token);
    }
  }
});

export default SocialAccount;
