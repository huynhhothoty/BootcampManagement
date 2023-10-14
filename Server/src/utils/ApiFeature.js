const mongoose = require('mongoose');
class ApiFeatures {
    constructor(myQuery, queryFields) {
        this.myQuery = myQuery;
        this.queryFields = queryFields;
    }

    filter() {
        // filter
        const queryFields = { ...this.queryFields };
        const excludeFields = ['sort', 'page', 'limit'];
        excludeFields.forEach((ele) => delete queryFields[ele]);

        // turn on case insensitive
        for (const key in queryFields) {
            if (
                queryFields.hasOwnProperty(key) &&
                typeof queryFields[key] === 'string' &&
                isNaN(queryFields[key]) &&
                !mongoose.Types.ObjectId.isValid(queryFields[key])
            ) {
                queryFields[key] = {
                    $regex: new RegExp(queryFields[key], 'i'),
                };
            }
        }

        this.myQuery = this.myQuery.find(queryFields);
        return this;
    }

    sorting() {
        if (this.queryFields.sort) {
            let sortField = this.queryFields.sort;
            sortField = sortField.split(',').join(' ');
            this.myQuery = this.myQuery.sort(sortField);
        }
        return this;
    }

    pagination() {
        const thePage = this.queryFields.page || 1;
        const theLimit = this.queryFields.limit || 100;
        this.myQuery.skip(Math.abs(thePage - 1) * theLimit).limit(theLimit);

        return this;
    }
}

module.exports = ApiFeatures;
