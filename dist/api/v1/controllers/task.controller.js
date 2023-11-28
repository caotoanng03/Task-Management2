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
exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const pagination_1 = __importDefault(require("../../../helpers/pagination"));
const search_1 = __importDefault(require("../../../helpers/search"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status.toString();
    }
    let objectSearch = (0, search_1.default)(req.query);
    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }
    let initPagination = {
        currentPage: 1,
        limitItems: 4
    };
    const countTasks = yield task_model_1.default.countDocuments(find);
    const objectPagination = (0, pagination_1.default)(initPagination, req.query, countTasks);
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toLocaleString();
        sort[sortKey] = req.query.sortValue;
    }
    const tasks = yield task_model_1.default.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    res.json({
        code: 200,
        data: tasks
    });
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const task = yield task_model_1.default.findOne({
            _id: id,
            deleted: false
        });
        res.json({
            code: 200,
            data: task
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "None existed id"
        });
    }
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const status = req.body.status;
        yield task_model_1.default.updateOne({ _id: id }, { status: status });
        res.json({
            code: 200,
            message: "Updated Successfully"
        });
    }
    catch (err) {
        res.json({
            code: 400,
            message: "None existed that product"
        });
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Key;
        (function (Key) {
            Key["STATUS"] = "status";
            Key["DELETE"] = "delete";
        })(Key || (Key = {}));
        const { ids, key, value } = req.body;
        let bodyRequest = [ids, key, value];
        switch (key) {
            case Key.STATUS:
                yield task_model_1.default.updateMany({
                    _id: { $in: ids }
                }, { status: value });
                res.json({
                    code: 200,
                    message: "Update Status Successfully"
                });
                break;
            case Key.DELETE:
                yield task_model_1.default.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: true,
                    deletedAt: new Date()
                });
                res.json({
                    code: 200,
                    message: "Deleted multiple tasks successfully"
                });
                break;
            default:
                res.json({
                    code: 400,
                    message: "Bad request"
                });
                break;
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Bad request"
        });
    }
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = new task_model_1.default(req.body);
        const data = yield task.save();
        res.json({
            code: 201,
            message: "New task was just created",
            data: data
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Bad request!"
        });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({
            _id: id,
            deleted: false
        }, req.body);
        res.json({
            code: 200,
            message: "Updated successfully"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "None existed that product id"
        });
    }
});
exports.edit = edit;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({ _id: id }, {
            deleted: true,
            deletedAt: new Date()
        });
        res.json({
            code: 200,
            message: "Deleted successfully"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "None existed that product id"
        });
    }
});
exports.deleteTask = deleteTask;
