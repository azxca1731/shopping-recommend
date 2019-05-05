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
	}
};

export default Query;
