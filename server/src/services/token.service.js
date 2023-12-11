import jwt from "jsonwebtoken";

class TokenService {
    generateToken(payload) {
        const token = jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: process.env.JWT_EXPRIES_IN || 60 * 60,
        });
        return token;
    }

    verifyToken(token) {
        try {
            const data = jwt.verify(token, process.env.JWT_KEY);
            return data;
        } catch (error) {
            throw new Error(`not authorized (Error: ${error.message})`);
        }
    }
}

export default new TokenService();
