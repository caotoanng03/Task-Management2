interface Pagination {
    currentPage: number,
    limitItems: number,
    skip?: number,
    totalPage?: number
}

const paginationHelper = (objectPagination: Pagination, query: Record<string, any>, countRecords: number): Pagination => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    };

    if (query.limit) {
        objectPagination.limitItems = parseInt(query.limit);
    };

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    objectPagination.totalPage = Math.ceil(countRecords / objectPagination.limitItems);

    return objectPagination;
};

export default paginationHelper;