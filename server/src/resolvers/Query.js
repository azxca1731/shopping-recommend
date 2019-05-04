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
	}
};

export default Query;
