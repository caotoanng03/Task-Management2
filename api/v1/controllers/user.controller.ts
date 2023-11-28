import { Request, Response } from "express";
import User from "../models/user.model";

import md5 from "md5";

//[GET] /api/v1/users/
export const index = async (req: Request, res: Response): Promise<void> => {
    const users = await User.find({
        deleted: false
    }).select("fullName email");

    res.json({
        code: 200,
        message: "Success",
        users: users
    })
}


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

// [POST] /api/v1/users/login
export const login = async (req: Request, res: Response): Promise<void> => {
    const {email, password} = req.body;
    const reqBody : [string, string] = [email, password];

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user) {
        res.json({
            code: 400,
            message: "Email does not exists!"
        });
        return;
    };

    if(md5(password) != user.password) {
        res.json({
            code: 400,
            message: "Password is incorrect!"
        });
    };

    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Logged in successfully"
    });
}