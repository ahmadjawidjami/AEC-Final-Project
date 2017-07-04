module.exports = class Database {

    constructor(model) {
        this.Model = model;
    }

    getAll() {
        return this.Model.find();
    }

    update(data, query) {
        return this.Model.findByIdAndUpdate(data, query, {safe: true, upsert: true});
    }

    getProjectsByAddress(query) {
        return this.Model.find(query).select('projects -_id');
    }


    updatePull(data){

        console.log("called")

     return this.Model.update(
            {},
            { $pull: { "projects": {address: data.project} } },
            false,
            false

        )
    }

}