import mongoose from "mongoose";
/* DB SETTING START */

const db = mongoose.connection;
db.on("error", console.error);
db.once("open", function() {
	console.log("Connected to mongod server");
});

mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.connect("mongodb://localhost/shopping");
/* DB SETTING END */

/* DB SCHEMA START */
const messageSchema = new mongoose.Schema({
	message: String,
	me: Boolean,
	created_date: { type: Date, default: Date.now() + 9 * 3600000 },
	owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
});

const userSchema = new mongoose.Schema({
	name: String,
	email: { type: String, index: true, unique: true },
	message: [{ type: mongoose.Schema.Types.ObjectId, ref: "message" }]
});

/* DB SCHEMA END */
export default {
	Message: mongoose.model("message", messageSchema),
	User: mongoose.model("user", userSchema)
};
