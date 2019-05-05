import { Client } from "@elastic/elasticsearch";
import { config } from "dotenv";
config();
const elastic = new Client({
	node: `http://${process.env.ES_HOST}:${process.env.ES_PORT}/`
});

export default elastic;
