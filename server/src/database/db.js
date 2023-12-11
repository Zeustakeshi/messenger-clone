import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import userModel from "../models/user.model.js";
import roomModel from "../models/room.model.js";
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
    logging: false,
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
db.Room = roomModel(sequelize);
db.Message = messageModel(sequelize);
db.Friend = friendModel(sequelize);

// ======================= RELATION =======================
// user - room
db.Room.belongsToMany(db.User, {
    through: "Rooms_Users",
    foreignKey: "roomId",
    otherKey: "username",
});

db.User.belongsToMany(db.Room, {
    through: "Rooms_Users",
    foreignKey: "username",
    otherKey: "roomId",
});

// user - friend

db.User.hasMany(db.Friend, { foreignKey: "username1", as: "friends" });
db.User.hasMany(db.Friend, { foreignKey: "username2", as: "friendOf" });
db.Friend.belongsTo(db.User, { foreignKey: "username1" });
db.Friend.belongsTo(db.User, { foreignKey: "username2" });

// message - user
db.Message.belongsTo(db.User, {
    foreignKey: "username",
});
db.User.hasMany(db.Message, { as: "messages", foreignKey: "username" });

// message  - room
db.Message.belongsTo(db.Room, { foreignKey: "roomId" });
db.Room.hasMany(db.Message, { as: "messages", foreignKey: "roomId" });

// message - message
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

// =========================================
export const initDatabase = async () => {
    try {
        await db.sequelize.authenticate();
        console.log("Connection has been established successfully.");

        // await db.sequelize.sync({ force: true });
        console.log("Drop and re-sync db.");
    } catch (error) {
        console.log(`inint database with error: \n >> ${error}`);
    }
};

export default db;
