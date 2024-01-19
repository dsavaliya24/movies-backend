const Joi = require("joi");
const validator = require("../../middleware/validator");
module.exports = {
	add: validator({
		body: Joi.object({
			name: Joi.string().required(),
			description: Joi.string().required(),
			genre: Joi.array().required(),
			imDbRating: Joi.number().required(),
			// imDbRatingVotes: Joi.number().required(),
			releaseYear: Joi.number().required(),
		}),
	}),

	get: validator({
		query: Joi.object({
			_id: Joi.string()
				.pattern(/^[0-9a-fA-F]{24}$/)
				.message("Invalid ID"),
			uid: Joi.string()
				.pattern(/^[0-9a-fA-F]{24}$/)
				.message("Invalid UID"),
			search: Joi.string(),
			page: Joi.number().default(1),
			limit: Joi.number().default(10),
			sortBy: Joi.string().default("createdAt"),
			sortOrder: Joi.string().default(-1),
		}),
	}),

	update: validator({
		body: Joi.object({
			name: Joi.string(),
			description: Joi.string(),
			genre: Joi.array(),
			imDbRating: Joi.number(),
			// imDbRatingVotes: Joi.number(),
			releaseYear: Joi.number(),
		}),
		query: Joi.object({
			_id: Joi.string()
				.pattern(/^[0-9a-fA-F]{24}$/)
				.required(),
		}),
	}),

	delete: validator({
		query: Joi.object({
			_id: Joi.string()
				.pattern(/^[0-9a-fA-F]{24}$/)
				.required(),
		}),
	}),
};
