import { DataTypes, Sequelize } from "sequelize";
import { MESSAGE_RECEIVER_TYPE } from "../utils/chat.util.js";

/**
 * @param {Sequelize} sequelize
 */
export default (sequelize) => {
    const Message = sequelize.define(
        "Message",
        {
            // Model attributes are defined here
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            data: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            receiverType: {
                type: DataTypes.ENUM([
                    MESSAGE_RECEIVER_TYPE.GROUP,
                    MESSAGE_RECEIVER_TYPE.USER,
                ]),
                allowNull: false,
            },
        },
        {
            // Other model options go here
            modelName: "Message",
            tableName: "Messages",
            createdAt: true,
            updatedAt: true,
        }
    );
    return Message;
};
