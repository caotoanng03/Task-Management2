import { Request, Response } from "express";
import User from "../models/user.model";

import md5 from "md5";

// [POST] /api/v1/users/register
export const register = async (req: Request, res: Response): Promise<void> => {
    const existingEmail = await User.findOne({ 
        email: req.body.email,
        deleted: false
     });

     if(!existingEmail) {
        req.body.password = md5(req.body.password);

        const user = new User(req.body);
        const data = await user.save();

        res.cookie("token", data.token);

        res.json({
            code: 201,
            message: "New account was just created",
            token: data.token
        });
        
     } else {
        res.json({
            code: 400,
            message: "Email is already in use!"
        })
     }
}