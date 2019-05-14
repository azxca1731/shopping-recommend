const Mutation = {
	async saveChat(
		parent,
		{ query },
		{
			mongo: { Message },
			request: {
				session: { user }
			},
			pubsub
		},
		info
	) {
		try {
			const newMessage = new Message({
				message: query,
				me: true,
				query: "",
				owner: user,
				created_date: Date.now() + 9 * 1000 * 60 * 60
			});
			newMessage.save();
			pubsub.publish("MESSAGE", {
				Message: { ...newMessage._doc, id: newMessage._id }
			});
			const serverMessage = new Message({
				message: "",
				query,
				me: false,
				owner: user,
				created_date: Date.now() + 9 * 1000 * 60 * 60 + 50
			});
			serverMessage.save();
			pubsub.publish("MESSAGE", {
				Message: { ...serverMessage._doc, id: serverMessage._id }
			});
			return true;
		} catch (err) {
			throw new Error(err);
		}
	}
};
export default Mutation;
