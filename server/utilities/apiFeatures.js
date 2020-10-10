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

    sort() {
        if (this.querystring.sort) {
            const sortBy = this.querystring.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if (this.querystring.fields) {
            const fields = this.querystring.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
}

module.exports = ApiFeatures;