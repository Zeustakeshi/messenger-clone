import { Sequelize, DataTypes } from "sequelize";

/**
 * @param {Sequelize} sequelize
 */
export default (sequelize) => {
    const Room = sequelize.define(
        "Room",
        {
            // Model attributes are defined here
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            name: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            // Other model options go here
            modelName: "Room",
            tableName: "Rooms",
            createdAt: true,
            updatedAt: true,
        }
    );
    return Room;
};
