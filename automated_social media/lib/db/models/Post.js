import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

class Post extends Model {}

Post.init(
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
    content_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    media_url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    scheduled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "processing", "completed", "partial_failure", "failed"),
      defaultValue: "processing",
    },
    platform_customizations: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "posts",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["user_id", "status"],
      },
      {
        fields: ["scheduled_at"],
      },
    ],
  }
);

export default Post;
