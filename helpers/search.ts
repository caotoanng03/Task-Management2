interface ISearch {
    keyword: string,
    regex?: RegExp
}

const searchHelper = (query: Record<string, any>): ISearch => {
    let objectSearch: ISearch = {
        keyword: ""
    };

    if (query.keyword) {
        objectSearch.keyword = query.keyword;

        const regex = new RegExp(objectSearch.keyword, "i");
        objectSearch.regex = regex;
    };

    return objectSearch;
}

export default searchHelper;
