const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const apiResponse = require("./api.response");
const messages = require("../json/message.json");

module.exports = {
	hashPassword: async ({ password }) => {
		console.log("=-=-=-=-=-=-=-=-=-=-=-", password);

		const hash = await bcrypt.hash(password, 10);
		console.log("=-=-=-=-=-=-=-=-=-=-=-", hash);
		return hash;
	},

	generateToken: ({ data }) => {
		const token = jwt.sign(data, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN,
		});
		return token;
	},
	decodeToken: ({ token }) => {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		return decoded;
	},
	comparePassword: async ({ password, hash }) => {
		const isPasswordMatch = await bcrypt.compare(password, hash);
		return isPasswordMatch;
	},
	uploadImage: async (req, res) => {
		try {
			if (!req.file)
				return apiResponse.BAD_REQUEST({
					res,
					message: messages.IMAGE_REQUIRED,
				});
			return apiResponse.OK({
				res,
				message: messages.SUCCESS,
				data: req.file.location,
			});
		} catch (error) {
			return apiResponse.CATCH_ERROR({ res, message: error.message });
		}
	},
};
