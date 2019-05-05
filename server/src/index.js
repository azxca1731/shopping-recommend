import { GraphQLServer } from "graphql-yoga";
import { Query } from "./resolvers";
import elastic from "./elastic";

const server = new GraphQLServer({
	typeDefs: "./src/schema.graphql",
	resolvers: {
		Query
	},
	context({ request }) {
		return {
			request,
			elastic
		};
	}
});

server.start(({ port }) => {
	console.log(`The server is up! port is ${port}`);
});
