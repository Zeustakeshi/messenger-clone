import { DataTypes, Sequelize } from "sequelize";
import { USER_STATUS } from "../utils/user.util.js";

/**
 * @param {Sequelize} sequelize
 */
export default (sequelize) => {
    const User = sequelize.define(
        "User",
        {
            // Model attributes are defined here
            username: {
                type: DataTypes.TEXT,
                primaryKey: true,
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM([USER_STATUS.OFFLINE, USER_STATUS.ONLINE]),
                defaultValue: USER_STATUS.ONLINE,
            },
            avatar: {
                type: DataTypes.TEXT,
                allowNull: true,
                defaultValue: "https://source.unsplash.com/random",
            },
        },
        {
            // Other model options go here
            modelName: "User",
            tableName: "users",
            createdAt: true,
            updatedAt: true,
        }
    );

    return User;
};
