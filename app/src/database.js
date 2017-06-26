module.exports = class Database {

    constructor(model) {
        this.Model = model;
    }

    getAll() {
        return this.Model.find();
    }

    update(data, query) {
        return this.Model.findByIdAndUpdate(data, query, { safe: true, upsert: true });
    }

    getProjectsBy(address){
        return this.Model.find({
            _id: address
        }).select('projects');
    }

}