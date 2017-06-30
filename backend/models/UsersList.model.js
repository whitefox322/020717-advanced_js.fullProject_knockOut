const User = require("./User.model");
const UserSnapshot = require("./UserSnapshot.model");
const DataSet = require("./DataSet.model");

class UsersList extends DataSet{
	constructor(data) {
		super(data, User);
	}

	pagedSnapshots(curPage, limit) {
		let page = this.paged(curPage, limit);
		page.data = page.data.map(u => new UserSnapshot(u));
		return page;
	}
}

module.exports = UsersList;