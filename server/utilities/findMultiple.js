const ApiFeatures = require('./apiFeatures');

module.exports = async (query, queryString) => {
    const features = new ApiFeatures(query, queryString)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const all = await features.query;
    return all;
}

