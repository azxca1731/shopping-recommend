import { GraphQLServer } from "graphql-yoga";
import session from "express-session";
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
