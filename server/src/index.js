import { GraphQLServer } from "graphql-yoga";
import { Query } from "./resolvers";
import elastic from "./elastic";
import mongo from "./mongo";

const server = new GraphQLServer({
	typeDefs: "./src/schema.graphql",
	resolvers: {
		Query
	},
	context({ request }) {
		return {
			request,
			elastic,
			mongo
		};
	}
});

server.start(({ port }) => {
	console.log(`The server is up! port is ${port}`);
});
