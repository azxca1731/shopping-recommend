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
			mongo: { Message },
			request: {
				session: { user }
			}
		},
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
									source:
										"(doc['popularity'].value +1) * _score"
								}
							}
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
			if (from !== 0) {
				const newMessage = new Message({
					message: query,
					me: true,
					query: "",
					owner: user
				});
				newMessage.save();
				//TODO: 서버측의 응답을 더 좋은 방법으로 가지고 있을 수 있나 확인
				const serverMessage = new Message({
					message: "",
					query,
					me: false,
					owner: user
				});
				serverMessage.save();
			}
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
	}
};

export default Query;
