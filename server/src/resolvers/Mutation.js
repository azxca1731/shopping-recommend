const Mutation = {
	async saveChat(
		parent,
		{ query },
		{
			mongo: { Message },
			request: { session },
			pubsub,
			elastic
		},
		info
	) {
		try {
			const newMessage = new Message({
				message: query,
				me: true,
				query: "",
				owner: session.user,
				created_date: Date.now() + 9 * 1000 * 60 * 60
			});
			newMessage.save();
			pubsub.publish(`MESSAGE-${session.user._id}`, {
				Message: { ...newMessage._doc, id: newMessage._id }
			});
			if (query === "추천") {
				if (!session.categoryMost) {
					throw new Error("현재 검색된 데이터가 없습니다.");
				}
				const [[first]] = Object.entries(session.categoryMost).sort(
					([_, firstNum], [_1, secondNum]) => secondNum - firstNum
				);
				const serverMessage = new Message({
					message: "",
					query,
					categoryId: first,
					me: false,
					owner: session.user,
					created_date: Date.now() + 9 * 1000 * 60 * 60 + 50
				});
				serverMessage.save();
				pubsub.publish(`MESSAGE-${session.user._id}`, {
					Message: { ...serverMessage._doc, id: serverMessage._id }
				});
			} else {
				const serverMessage = new Message({
					message: "",
					query,
					me: false,
					owner: session.user,
					created_date: Date.now() + 9 * 1000 * 60 * 60 + 50
				});
				serverMessage.save();
				pubsub.publish(`MESSAGE-${session.user._id}`, {
					Message: { ...serverMessage._doc, id: serverMessage._id }
				});

				//추천을 위한 카테고리화
				const {
					body: {
						hits: { hits }
					}
				} = await elastic.search({
					index: "shopping",
					body: {
						from: 0,
						size: 10,
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
				let usermost = {};
				hits.map(({ _source: { categoryId } }) => {
					if (usermost[`${categoryId}`]) usermost[`${categoryId}`]++;
					else usermost[`${categoryId}`] = 1;
					return false;
				});
				const [[first]] = Object.entries(usermost).sort(
					([_, firstNum], [_1, secondNum]) => secondNum - firstNum
				);
				if (!session.categoryMost) {
					session.categoryMost = {};
					session.categoryMost[`${first}`] = 3;
				} else {
					if (session.categoryMost[`${first}`])
						session.categoryMost[`${first}`] += 3;
					else session.categoryMost[`${first}`] = 3;
				}
				session.save();
			}

			return true;
		} catch (err) {
			throw new Error(err);
		}
	}
};
export default Mutation;
