import { Request, Response, NextFunction } from "express";

import User from "../models/user.model";

export const requireAuth = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<void> => {

    if (req.headers.cookie) {
        const token: string = req.headers.cookie.substring(6);

        const user = await User.findOne({
            token: token,
            deleted: false
        }).select("-password");

        if (!user) {
            res.json({
                code: 400,
                message: "Token is not valid"
            });
            return;
        };

        req["user"] = user;
        next();

    } else {
        res.json({
            code: 400,
            message: "Please send with token"
        });
        return;
    }
}