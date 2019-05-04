import { GraphQLServer } from "graphql-yoga";
import { Query } from "./resolvers";
import { config } from "dotenv";

config();

const server = new GraphQLServer({
	typeDefs: "./src/schema.graphql",
	resolvers: {
		Query
	},
	context({ request }) {
		return {
			request
		};
	}
});

server.start(() => {
	console.log("The server is up!");
});
