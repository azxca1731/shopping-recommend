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
			return hits.reduce(
				(acc, { _id, _source: { name } }) => [
					{ id: _id, name },
					...acc
				],
				[]
			);
		} catch (err) {
			throw new Error(err);
		}
	},
	getSearchedArray(
		parent,
		args,
		{
			mongo: { Message }
		},
		info
	) {
		// TODO: 혹시나 유저 별로 다른 화면을 보여준다고 가정했을 시
		// request를 보아 요청한 유저(JWT로 관리)만 보여줄 것
		return Message.find();
	}
};

export default Query;
