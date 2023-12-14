import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import userModel from "../models/user.model.js";
import messageModel from "../models/message.model.js";
import friendModel from "../models/friend.model.js";

dotenv.config();

const sequelize = new Sequelize({
    dialect: "postgres",
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    logging: !!(process.env.LOG === "ON"),
    sync: {
        alter: {
            drop: true,
        },
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = userModel(sequelize);
db.Message = messageModel(sequelize);
db.Friend = friendModel(sequelize);

// ======================= RELATION ====================== //

/** USER - FRIEND */

db.User.hasMany(db.Friend, { foreignKey: "username1", as: "friends" });
db.User.hasMany(db.Friend, { foreignKey: "username2", as: "friendOf" });
db.Friend.belongsTo(db.User, { foreignKey: "username1" });
db.Friend.belongsTo(db.User, { foreignKey: "username2" });

/** MESSAGE USER */
db.Message.belongsTo(db.User, {
    foreignKey: "senderId",
});

db.Message.belongsTo(db.User, {
    foreignKey: "receiverId",
});

db.User.hasMany(db.Message, { as: "sendedMessage", foreignKey: "senderId" });
db.User.hasMany(db.Message, {
    as: "receivedMessage",
    foreignKey: "receiverId",
});

/** MESSAGE - MESSAGE */
db.Message.belongsToMany(db.Message, {
    through: "Replies",
    foreignKey: "parentId",
    otherKey: "childrenId",
    as: "children",
});

db.Message.belongsToMany(db.Message, {
    through: "Replies",
    foreignKey: "childrenId",
    otherKey: "parentId",
    as: "parent",
});

// ========================================= //
export const initDatabase = async () => {
    try {
        await db.sequelize.authenticate();
        console.log("Connection has been established successfully.");

        if (!!(process.env.DB_SYNC === "ON")) {
            await db.sequelize.sync({ force: true });
            console.log("Drop and re-sync db.");
        }
    } catch (error) {
        console.log(`inint database with error: \n >> ${error}`);
    }
};

export default db;
