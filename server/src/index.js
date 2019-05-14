import { GraphQLServer, PubSub } from "graphql-yoga";
import session from "express-session";
import connectRedis from "connect-redis";
import cookie from "cookie";
import { Query, Mutation, Subscription } from "./resolvers";
import elastic from "./elastic";
import mongo from "./mongo";

const pubsub = new PubSub();
const redis = connectRedis(session);
const SessionStore = new redis({});

const server = new GraphQLServer({
	typeDefs: "./src/schema.graphql",
	resolvers: {
		Query,
		Mutation,
		Subscription
	},
	context({ request, connection: { context } = {} }) {
		return {
			request,
			elastic,
			mongo,
			pubsub,
			subscriptionContext: context
		};
	}
});

server.express.use(
	session({
		store: SessionStore,
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
	},
	subscriptions: {
		onConnect: async (connectionParams, webSocket) => {
			const header = webSocket.upgradeReq.headers.cookie;
			const { qid } = cookie.parse(header);
			const sessionId = qid.substr("s:".length, qid.indexOf(".") - 2);
			try {
				const { user } = await new Promise((resolve, reject) => {
					SessionStore.get(sessionId, (err, session) => {
						if (err) reject(new Error(err));
						resolve(session);
					});
				});
				return { currentUser: user };
			} catch (err) {
				throw new Error(err);
			}
		}
	}
};

server.start(opts, ({ port }) => {
	console.log(`The server is up! port is ${port}`);
});
