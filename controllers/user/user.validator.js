const Joi = require("joi");
const validator = require("../../middleware/validator");
module.exports = {
	signup: validator({
		body: Joi.object({
			email: Joi.string().required(),
			password: Joi.string().required(),
			name: Joi.string().required(),
			role: Joi.string(),
		}),
	}),
	signIn: validator({
		body: Joi.object({
			email: Joi.string().required(),
			password: Joi.string().required(),
		}),
	}),
	forgot: validator({
		body: Joi.object({
			email: Joi.string().required(),
		}),
	}),
	verifyOtp: validator({
		body: Joi.object({
			email: Joi.string().required(),
			otp: Joi.string().required(),
			password: Joi.string().allow(),
		}),
	}),
	changePassword: validator({
		body: Joi.object({
			email: Joi.string().required(),
			password: Joi.string().required(),
		}),
	}),
	updatePassword: validator({
		body: Joi.object({
			oldPassword: Joi.string().required(),
			newPassword: Joi.string().required(),
		}),
	}),
	update: validator({
		body: Joi.object({
			email: Joi.string(),
			name: Joi.string(),
		}),
		params: Joi.object({
			_id: Joi.string()
				.pattern(/^[0-9a-fA-F]{24}$/)
				.required(),
		}),
	}),
	fetch: validator({
		query: Joi.object({
			_id: Joi.string()
				.pattern(/^[0-9a-fA-F]{24}$/)
				.message("Invalid ID"),
			search: Joi.string(),
			name: Joi.string(),
			email: Joi.string(),
			page: Joi.number().default(1),
			limit: Joi.number().default(10),
			sortBy: Joi.string().default("createdAt"),
			sortOrder: Joi.string().default(-1),
		}),
	}),
};
