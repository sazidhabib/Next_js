import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

class PostDelivery extends Model {}

PostDelivery.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    social_account_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    provider: {
      type: DataTypes.ENUM("linkedin", "facebook", "instagram", "twitter", "youtube"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "published", "failed"),
      defaultValue: "pending",
    },
    external_post_id: {
      type: DataTypes.STRING(512),
      allowNull: true,
      comment: "URL or ID of post on the target platform",
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    retry_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "PostDelivery",
    tableName: "post_deliveries",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["post_id"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["provider"],
      },
    ],
  }
);

export default PostDelivery;
