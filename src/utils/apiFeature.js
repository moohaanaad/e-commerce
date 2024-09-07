
export class ApiFeature {

    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery
        this.queryData = queryData
    }
    pagination() {
        let { size, page } = this.queryData
        size = parseInt(size)
        page = parseInt(page)
        if (size <= 0) size = 1
        if (page <= 0) page = 1
        const skip = (page - 1) * size
        this.mongooseQuery.limit(size).skip(skip)
        return this
    }
    sort() {
        this.mongooseQuery.sort(this.queryData.sort?.replaceAll(',', ' '))
        return this
    }
    select() {
        this.mongooseQuery.select(this.queryData.select?.replaceAll(',', " "))
        return this
    }
    filter() {
        let { size, page, sort, select, ...filter } = this.queryData
        filter = JSON.parse(JSON.stringify(filter).replaceAll(/gt|gte|lt|lte/g, match => `$${match}`))
        this.mongooseQuery.find(filter)
        return this
    }
}