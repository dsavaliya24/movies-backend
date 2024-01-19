const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const moviesSchema = new Schema(
	{
		name: { type: String },

		description: { type: String },

		genre: [{ type: String }],

		imDbRating: { type: Number, default: 0 },

		// imDbRatingVotes: { type: Number, default: 0 },

		releaseYear: { type: Number },

		uid: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

		image: { type: String },
	},
	{ timestamps: true, versionKey: false },
);

let moviesModel = model("movies", moviesSchema, "movies");
module.exports = moviesModel;
