import {Request, Response} from "express";

import Task from "../models/task.model";
import paginationHelper from "../../../helpers/pagination";

export const index = async (req: Request, res: Response): Promise<void> => {
    // Find
    interface Find {
        deleted: boolean,
        status?: string
    }

    const find: Find = {
        deleted: false
    }

    if(req.query.status) {
        find.status = req.query.status.toString();
    }
    // End Find

    // Sort
    const sort = {};

    if(req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toLocaleString();
        sort[sortKey] = req.query.sortValue;
    }
    // End Sort

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

    const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

    res.json({
        code: 200,
        data: tasks
    })
}

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

