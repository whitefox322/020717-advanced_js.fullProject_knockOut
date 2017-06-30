import PagedSet from "./PagedSet.model";
import uuid from "uuid";

export default class DataSet {
	constructor(data, dataClassCtor) {
		if (typeof data === "string") {
			data = JSON.parse(data);
		}

		if (!Array.isArray(data)) {
			throw new Error("Only array supported for initial data!");
		}
		this.__data = [];
		this.__rawData = data;

		this.DataItemCtor = dataClassCtor;
	}

	initialize() {
		this.__rawData.forEach(this.__prepend.bind(this));
	}

	get(id) {
		return this.__data.find(u => u.id === id);
	}

	paged(curPage, limit) {
		const startIndex = (curPage - 1) * limit;
		const data = this.__data.slice(startIndex, startIndex + +limit);
		return new PagedSet(data, curPage, this.__data.length, limit);
	}

	add(item) {
		item = this.__ensureIsCorrectStructureInstance(item);
		item.id = uuid.v4();
		return this.__prepend(item);
	}

	update(changedItem) {
		changedItem = this.__ensureIsCorrectStructureInstance(changedItem);
		const oldItem = this.get(changedItem.id);

		if (oldItem) {
			this.remove(oldItem.id);
			return this.__prepend(changedItem);
		} else {
			throw new Error("You cannot update. Specified item does not exists or have different id.");
		}
	}

	remove(id) {
		const known = this.get(id);
		if (known) {
			const index = this.__data.indexOf(known);
			this.__data.splice(index, 1);
		}
	}

	get rawDatabase() {
		return this.__data.slice();
	}

	__prepend(user) {
		user = this.__ensureIsCorrectStructureInstance(user);
		this.__data.unshift(user);

		return user;
	}
	__ensureIsCorrectStructureInstance(u) {
		return u instanceof this.DataItemCtor ? u : new this.DataItemCtor(u);
	}
}