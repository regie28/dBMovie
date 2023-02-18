import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { infoLogger, errorLogger } from "../utils/logger.js"

export const auth = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(403).json(
            {
                message: "Authorization not allowed"

            });
        }
            try {
                jwt.verify(token, process.env.JWT_SECRET_KEY,(err, user) => {
                    if (err) {
                        return res.status(403).json(err.message);
                    }
                    req.user = user;
                    next();
                });
            } catch (err){
                infoLogger.error(err.message);
                res.status(401).json({message: "Token not Valid"})
            }
    }

    export const admin = (req, res, next) => {
        const isAdmin = req.user.role;
        if(!isAdmin){
            return res.status(403).json({message: "You are not authorized to perform this action"})
        }
    }
