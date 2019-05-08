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
						term: {
							name: query
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
			mongo: { Message }
		},
		info
	) {
		// TODO: 혹시나 유저 별로 다른 화면을 보여준다고 가정했을 시
		// request를 보아 요청한 유저(JWT로 관리)만 보여줄 것
		// 혹시 순서가 바뀔 수도 있기에
		const returnValue = await Message.find().sort("created_date");

		return returnValue;
	}
};

export default Query;
