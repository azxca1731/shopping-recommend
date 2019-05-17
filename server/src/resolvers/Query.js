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
		{
			elastic,
			request: { session = {} }
		},
		info
	) {
		let userCategory = [];
		if (session && session.categoryMost) {
			const objectArray = Object.entries(session.categoryMost).sort(
				([_, firstNum], [_1, secondNum]) => secondNum - firstNum
			);
			if (objectArray.length === 1) {
				userCategory = [objectArray[0][0]];
			} else if (objectArray.length === 2) {
				userCategory = [objectArray[0][0], objectArray[1][0]];
			} else {
				userCategory = [
					objectArray[0][0],
					objectArray[1][0],
					objectArray[2][0]
				];
			}
		}
		try {
			const {
				body: { hits }
			} = await elastic.search({
				index: "shopping",
				body: {
					query: {
						bool: {
							must: [
								{
									match: {
										name: query
									}
								}
							],
							must_not: [],
							should: [
								{
									terms: {
										categoryId: userCategory
									}
								}
							]
						}
					},
					from,
					size,
					sort: [
						{
							popularity: {
								order: "desc"
							}
						}
					],
					aggs: {}
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
