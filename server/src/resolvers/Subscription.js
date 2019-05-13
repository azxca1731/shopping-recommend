const Subscription = {
	Message: {
		subscribe(parent, args, { pubsub }) {
			return pubsub.asyncIterator("MESSAGE");
		}
	}
};
export default Subscription;
