class ApiFeatures {
    constructor(query, querystring) {
        this.query = query;
        this.querystring = querystring;
    }

    filter() {
        let queryObj = { ...this.querystring };
        const excludedFields = ['page', 'sort', 'fields', 'limit'];
        excludedFields.forEach(field => delete queryObj[field]);

        let querystring = JSON.stringify(queryObj);
        querystring = querystring.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        queryObj = JSON.parse(querystring);

        this.query = this.query.find(queryObj);
        return this;
    }
}

module.exports = ApiFeatures;