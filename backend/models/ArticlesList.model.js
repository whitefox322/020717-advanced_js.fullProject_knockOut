import Article from "./Article.model";
import DataSet from "./DataSet.model";
import PagedSet from "./PagedSet.model";

import uuid from "uuid";

export default class ArticlesList extends DataSet{
	constructor(data, usersDataSet) {
		super(data, Article);
		this.__usersDataSet = usersDataSet;
		this.initialize();
	}

	get(id, authorID) {
		const article = this.__data.find(u => u.id === id && u.authorID === authorID);

		this.__setAuthorFullName(article);

		return article;
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

		return this.__setAuthorFullNameForPaged(
			new PagedSet(data, curPage, authorData.length, limit));
	}

	unfilteredPaged(curPage, limit) {
		const startIndex = (curPage - 1) * limit;
		const data = this.__data
			.slice(startIndex, startIndex + +limit);

		return this.__setAuthorFullNameForPaged(
			new PagedSet(data, curPage, this.__data.length, limit));
	}

	__setAuthorFullName(article) {
		if (article) {
			const author = this.__usersDataSet.get(article.authorID);
			article.authorFullName = author.fullName;
		}

		return article;
	}

	__setAuthorFullNameForPaged(paged) {
		if (paged && paged.data && paged.data.length) {
			paged.data.forEach(this.__setAuthorFullName.bind(this));
		}

		return paged;
	}

	__prepend(item) {
		return this.__setAuthorFullName(super.__prepend(item));
	}
}