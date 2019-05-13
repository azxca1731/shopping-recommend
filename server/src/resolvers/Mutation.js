const Mutation = {
	async saveChat(
		parent,
		{ query },
		{
			mongo: { Message },
			request: {
				session: { user }
			}
		},
		info
	) {
		console.log(query);
		try {
			const newMessage = new Message({
				message: query,
				me: true,
				query: "",
				owner: user
			});
			newMessage.save();
			const serverMessage = new Message({
				message: "",
				query,
				me: false,
				owner: user,
				created_date: Date.now() + 9 * 1000 * 60 * 60 + 500
			});
			serverMessage.save();
			return true;
		} catch (err) {
			throw new Error(err);
		}
	}
};
export default Mutation;
