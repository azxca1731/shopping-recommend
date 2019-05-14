const Subscription = {
	Message: {
		subscribe(parent, args, { pubsub, subscriptionContext }) {
			return pubsub.asyncIterator(
				`MESSAGE-${subscriptionContext.currentUser._id}`
			);
		}
	}
};
export default Subscription;
