import { Sequelize, DataTypes } from "sequelize";
import { FriendStatus } from "../utils/friend.util.js";

/**
 * @param {Sequelize} sequelize
 */
export default (sequelize) => {
    const Friend = sequelize.define(
        "Friend",
        {
            // Model attributes are defined here
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            type: {
                type: DataTypes.ENUM(
                    FriendStatus.PENDING,
                    FriendStatus.ACCEPTED
                ),
            },
        },
        {
            // Other model options go here
            modelName: "Friend",
            tableName: "Friends",
            createdAt: true,
            updatedAt: true,
        }
    );
    return Friend;
};
