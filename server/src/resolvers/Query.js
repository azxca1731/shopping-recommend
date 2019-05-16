import uuid from "uuid/v1";
const Query = {
	async connection(parent, args, context, info) {
		return true;
	},
	async search(
		parent,
		{
			data: { query, from = 0, size = 10 }
		},
		{ elastic },
		info
	) {
		try {
			const {
				body: { hits }
			} = await elastic.search({
				index: "shopping",
				body: {
					from,
					size,
					query: {
						function_score: {
							query: {
								match: { name: query }
							},
							script_score: {
								script: {
									lang: "expression",
									source: "doc['popularity'].value + _score"
								}
							},
							min_score: 1
						}
					}
				}
			});
			const returnDate = hits.hits.reduce(
				(acc, { _id, _source: { name } }) => [
					{ id: _id, name },
					...acc
				],
				[]
			);
			return { total: hits.total, productList: returnDate };
		} catch (err) {
			throw new Error(err);
		}
	},
	async getSearchedArray(
		parent,
		args,
		{
			mongo: { Message, User },
			request: { session }
		},
		info
	) {
		if (!session.user) {
			const newUser = new User({ uid: uuid() });
			await newUser.save();
			session.user = newUser;
		}
		const returnValue = await Message.find({ owner: session.user }).sort(
			"created_date"
		);

		return returnValue;
	},
	async searchByCategory(
		parent,
		{
			data: { categoryId, from = 0, size = 10 }
		},
		{ elastic },
		info
	) {
		try {
			const {
				body: { hits }
			} = await elastic.search({
				index: "shopping",
				body: {
					from,
					size,
					query: {
						function_score: {
							query: {
								match: { categoryId }
							},
							script_score: {
								script: {
									lang: "expression",
									source: "doc['popularity'].value"
								}
							},
							min_score: 1
						}
					}
				}
			});
			const returnData = hits.hits.reduce(
				(acc, { _id, _source: { name } }) => [
					{ id: _id, name },
					...acc
				],
				[]
			);
			return { total: hits.total, productList: returnData };
		} catch (err) {
			throw new Error(err);
		}
	}
};

export default Query;
