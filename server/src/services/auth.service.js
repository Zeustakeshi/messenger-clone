import db from "../database/db.js";
import { calculateExpirationTime } from "../utils/calculateExpirationTime.js";
import tokenService from "./token.service.js";
import * as bcrypt from "bcrypt";
import userService from "./user.service.js";
class AuthService {
    async register(username, password) {
        const data = await userService.findUserByUsername(username);
        const existedUser = data?.dataValues;
        if (existedUser) throw new Error("user already exists!");

        // hash password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        const newUser = await db.User.create(
            {
                username,
                password: hashPassword,
            },
            {
                raw: true,
                returning: ["username", "avatar", "status"],
            }
        );
        const { password: pw, ...responseUser } = newUser.dataValues;

        const token = tokenService.generateToken({
            username: responseUser.username,
        });
        return {
            token: {
                data: token,
                exp: calculateExpirationTime(process.env.JWT_EXPRIES_IN),
            },
            user: responseUser,
        };
    }

    async login(username, password) {
        const data = await userService.findUserByUsername(username);
        const existedUser = data.dataValues;
        if (!existedUser) throw new Error("username not exists!");

        const isValidPassword = bcrypt.compareSync(
            password,
            existedUser.password
        );

        if (!isValidPassword) throw new Error("wrong password");

        const { password: pw, ...responseUser } = existedUser;
        const token = tokenService.generateToken({
            username: existedUser.username,
        });

        return {
            token: {
                data: token,
                exp: calculateExpirationTime(process.env.JWT_EXPRIES_IN),
            },
            user: responseUser,
        };
    }
}

export default new AuthService();
