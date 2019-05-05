const Query = {
	async connection(parent, args, { reques, elastic }, info) {
		try {
			const result = await elastic.search({
				index: "basketball",
				body: {
					query: {
						term: {
							points: 30
						}
					}
				}
			});
			console.log(result.body.hits.hits[0]._source);
		} catch (err) {
			throw new Error(err);
		}

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
