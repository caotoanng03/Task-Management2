import {Request, Response} from "express";

import Task from "../models/task.model";
import paginationHelper from "../../../helpers/pagination";
import searchHelper from "../../../helpers/search";

// [GET] /api/v1/tasks
export const index = async (req: Request, res: Response): Promise<void> => {
    // Find
    interface Find {
        deleted: boolean,
        status?: string,
        title?: RegExp
    }

    const find: Find = {
        deleted: false
    }

    if(req.query.status) {
        find.status = req.query.status.toString();
    }
    // End Find
    
    // Search
    let objectSearch = searchHelper(req.query);

    if(req.query.keyword) {
        find.title = objectSearch.regex;
    }
    // End Search

    // Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 4
    }
    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks
    )
    // End Pagination

    // Sort
    const sort = {};

    if(req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toLocaleString();
        sort[sortKey] = req.query.sortValue;
    }
    // End Sort

    const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

    res.json({
        code: 200,
        data: tasks
    })
}

// [GET] /api/v1/tasks/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
        const task = await Task.findOne({
            _id: id,
            deleted: false
        })
        res.json({
            code: 200,
            data: task
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "None existed id"
        })
    }
}

// [PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: string = req.params.id;
        const status: string = req.body.status;

        await Task.updateOne({ _id : id}, {status: status});
        
        res.json({
            code: 200,
            message: "Updated Successfully"
        })

    } catch (err) {
        res.json({
            code: 400,
            message: "None existed that product"
        })
    }
}

// [PATCH] /api/v1/tasks/change-multi/:id
export const changeMulti = async (req: Request, res: Response): Promise<void> => {
    try {
        const {ids, key, value} = req.body;
        let bodyRequest : [string[], string, string] = [ids, key, value];

        switch(key) {
            case "status":
                await Task.updateMany({
                    _id: { $in: ids }
                }, { status: value } );

                res.json({
                    code: 200,
                    message: "Update Status Successfully"
                });
                break;
            default:
                res.json({
                    code: 400,
                    message: "Bad request"
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Bad request"
        })
    }
}

// [POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = new Task(req.body);
        const data = await task.save();

        res.json({
            code: 201,
            message: "New task was just created",
            data: data
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Bad request!"
        })
    }
}

// [PATCH] /api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: string = req.params.id;

        await Task.updateOne({
            _id: id,
            deleted: false
        }, req.body);

        res.json({
            code: 200,
            message: "Updated successfully"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "None existed that product id"
        })
    }
}

// [DELETE] /api/v1/tasks/delete/:id
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: string = req.params.id;

        await Task.updateOne({ _id: id }, {
            deleted: true,
            deletedAt: new Date()
        });

        res.json({
            code: 200,
            message: "Deleted successfully"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "None existed that product id"
        })
    }
}