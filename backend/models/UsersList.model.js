import User from "./User.model";
import UserSnapshot from "./UserSnapshot.model";
import DataSet from "./DataSet.model";

export default class UsersList extends DataSet{
	constructor(data) {
		super(data, User);
		this.initialize();
	}

	pagedSnapshots(curPage, limit) {
		let page = this.paged(curPage, limit);
		page.data = page.data.map(u => new UserSnapshot(u));
		return page;
	}
}