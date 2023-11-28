"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detail = exports.logout = exports.login = exports.register = exports.index = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const md5_1 = __importDefault(require("md5"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find({
        deleted: false
    }).select("fullName email");
    res.json({
        code: 200,
        message: "Success",
        users: users
    });
});
exports.index = index;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingEmail = yield user_model_1.default.findOne({
        email: req.body.email,
        deleted: false
    });
    if (!existingEmail) {
        req.body.password = (0, md5_1.default)(req.body.password);
        const user = new user_model_1.default(req.body);
        const data = yield user.save();
        res.cookie("token", data.token);
        res.json({
            code: 201,
            message: "New account was just created",
            token: data.token
        });
    }
    else {
        res.json({
            code: 400,
            message: "Email is already in use!"
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const reqBody = [email, password];
    const user = yield user_model_1.default.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        res.json({
            code: 400,
            message: "Email does not exists!"
        });
        return;
    }
    ;
    if ((0, md5_1.default)(password) != user.password) {
        res.json({
            code: 400,
            message: "Password is incorrect!"
        });
    }
    ;
    const token = user.token;
    res.cookie("token", token);
    res.json({
        code: 200,
        message: "Logged in successfully"
    });
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.cookie) {
        res.clearCookie("token");
        res.json({
            code: 200,
            message: "Logged out successfully"
        });
    }
    else {
        res.json({
            code: 400,
            message: "Bad request!"
        });
    }
});
exports.logout = logout;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        code: 200,
        message: "Success",
        info: req["user"]
    });
});
exports.detail = detail;
