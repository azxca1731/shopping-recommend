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
			mongo: { Message }
		},
		info
	) {
		try {
			const {
				body: {
					hits: { hits }
				}
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
			const newMessage = new Message({ message: query, me: true });
			newMessage.save();
			//TODO: 서버측의 응답을 더 좋은 방법으로 가지고 있을 수 있나 확인
			const returnDate = hits.reduce(
				(acc, { _id, _source: { name } }) => [
					{ id: _id, name },
					...acc
				],
				[]
			);
			const serverMessage = new Message({
				message: returnDate.reduce(
					(acc, { name }, index) => `${acc} ${index + 1}:${name}`,
					""
				),
				me: false
			});
			serverMessage.save();
			return returnDate;
		} catch (err) {
			throw new Error(err);
		}
	},
	async getSearchedArray(
		parent,
		args,
		{
			mongo: { Message },
			request: { session }
		},
		info
	) {
		console.log(session.user);
		if (!session.user) {
			session.user = {
				name: "Junghun",
				age: 25,
				createCurTime: new Date()
			};
		}
		const returnValue = await Message.find().sort("created_date");

		return returnValue;
	}
};

export default Query;
