import Article from "./Article.model";
import DataSet from "./DataSet.model";
import PagedSet from "./PagedSet.model";

import uuid from "uuid";

export default class ArticlesList extends DataSet{
	constructor(data) {
		super(data, Article);
	}

	get(id, authorID) {
		return this.__data.find(u => u.id === id && u.authorID === authorID);
	}

	add(item) {
		item = this.__ensureIsCorrectStructureInstance(item);
		item.id = uuid.v4();

		if (!item.authorID) {
			throw new Error("authorID is required");
		}

		return this.__prepend(item);
	}

	update(changedItem) {
		changedItem = this.__ensureIsCorrectStructureInstance(changedItem);
		const oldItem = this.get(changedItem.id, changedItem.authorID);

		if (oldItem) {
			this.remove(oldItem.id, oldItem.authorID);
			return this.__prepend(changedItem);
		} else {
			throw new Error("You cannot update. Specified item does not exists or have different id.");
		}
	}

	remove(id, authorID) {
		const known = this.get(id, authorID);
		if (known) {
			const index = this.__data.indexOf(known);
			this.__data.splice(index, 1);
		}
	}

	paged(curPage, limit, authorID) {
		const startIndex = (curPage - 1) * limit;
		const authorData = this.__data.filter(u => u.authorID === authorID);
		const data = authorData
			.slice(startIndex, startIndex + +limit);

		return new PagedSet(data, curPage, authorData.length, limit);
	}

	unfilteredPaged(curPage, limit) {
		const startIndex = (curPage - 1) * limit;
		const data = this.__data
			.slice(startIndex, startIndex + +limit);

		return new PagedSet(data, curPage, this.__data.length, limit);
	}
}