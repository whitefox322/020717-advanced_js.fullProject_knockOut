import uuid from "uuid";

export default class Article {
	constructor(json) {
		this.id = (json.id || "").toLowerCase();
		this.authorID = (json.authorID || "").toLowerCase();
		this.title = json.title;
		this.content = json.content;
		this.shortContent = json.shortContent;
		this.thumbnail = json.thumbnail || "http://loremflickr.com/150/150/boy?random=" + uuid.v4()
	}
}