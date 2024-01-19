const DB = require("../../models");
const messages = require("../../json/message.json");
const apiResponse = require("../../utils/api.response");

module.exports = {
	add: async (req, res) => {
		try {
			console.log("================================================", req.user);
			const bodyData = {
				...req.body,
				image: req.file ? req.file.location : "",
				uid: req.user._id,
			};
			const movie = await DB.MOVIES.create(bodyData);
			return apiResponse.OK({
				res,
				message: messages.SUCCESS,
				data: movie,
			});
		} catch (error) {
			return apiResponse.CATCH_ERROR({ res, message: error.message });
		}
	},

	get: async (req, res) => {
		try {
			let { page, limit, sortBy, sortOrder, search, ...query } = req.query;

			page = parseInt(req.query.page) || 1;
			limit = parseInt(req.query.limit) || 10;
			sortBy = sortBy || "createdAt";
			sortOrder = sortOrder || -1;

			search ? (query = { name: { $regex: search, $options: "i" } }) : "";
			// console.log("+++++++++++++++++++", req.user);
			const data = await DB.MOVIES.find({ ...query, uid: req.user._id })
				.skip((page - 1) * limit)
				.limit(limit)
				.sort({ [sortBy]: sortOrder });
			const count = data.length;
			const totalCount = await DB.MOVIES.find({
				uid: req.user._id,
			}).countDocuments();

			return apiResponse.OK({
				res,
				message: messages.SUCCESS,
				data: { data, count, totalCount },
			});
		} catch (error) {
			return apiResponse.CATCH_ERROR({ res, message: error.message });
		}
	},

	update: async (req, res) => {
		try {
			const user = await DB.MOVIES.findById({
				_id: req.query._id,
				uid: req.user._id,
			});
			if (!user)
				return apiResponse.NOT_FOUND({
					res,
					message: messages.MOVIE_NOT_FOUND,
				});

			const bodyData = {
				...req.body,
				image: req.file ? req.file.location : user.image,
			};
			console.log("--------------------------------", user);
			const data = await DB.MOVIES.findByIdAndUpdate(req.query._id, bodyData, {
				new: true,
			});
			console.log("---data", data);

			return apiResponse.OK({ res, message: messages.SUCCESS, data });
		} catch (error) {
			return apiResponse.CATCH_ERROR({ res, message: messages.FAILED });
		}
	},

	delete: async (req, res) => {
		try {
			const deletedItem = await DB.MOVIES.findByIdAndDelete({
				_id: req.query._id,
				uid: req.user._id,
			});
			if (!deletedItem)
				return apiResponse.NOT_FOUND({
					res,
					message: messages.MOVIE_NOT_FOUND,
				});
			return apiResponse.OK({
				res,
				message: messages.SUCCESS,
				data: deletedItem,
			});
		} catch (error) {
			return apiResponse.CATCH_ERROR({ res, message: error.message });
		}
	},
};
