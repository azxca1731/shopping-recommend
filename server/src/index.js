import { GraphQLServer, PubSub } from "graphql-yoga";
import session from "express-session";
import { Query, Mutation, Subscription } from "./resolvers";
import elastic from "./elastic";
import mongo from "./mongo";

const pubsub = new PubSub();

const server = new GraphQLServer({
	typeDefs: "./src/schema.graphql",
	resolvers: {
		Query,
		Mutation,
		Subscription
	},
	context({ request }) {
		return {
			request,
			elastic,
			mongo,
			pubsub
		};
	}
});

server.express.use(
	session({
		name: "qid",
		secret: `shopping-recommend`,
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
		}
	})
);

const opts = {
	port: 4000,
	cors: {
		credentials: true,
		origin: ["http://localhost:3000"]
	}
};

server.start(opts, ({ port }) => {
	console.log(`The server is up! port is ${port}`);
});
