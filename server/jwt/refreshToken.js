import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const refreshToken = (email) => {
    return jwt.sign(email, process.env.TokenJWT, {expiresIn: '1d'});
}