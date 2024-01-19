const messages = require("../../json/message.json");
const apiResponse = require("../../utils/api.response");
const DB = require("../../models");
const helper = require("../../utils/utils");
const EMAIL = require("../../service/mail.service");
const {
	USER_TYPE: { ADMIN, USER },
} = require("../../json/enums.json");

module.exports = exports = {
	signIn: async (req, res) => {
		const user = await DB.USER.findOne({ email: req.body.email })
			.populate("roleId", "name")
			.lean();
		if (!user) return apiResponse.OK({ res, message: messages.USER_NOT_FOUND });

		const isPasswordMatch = await helper.comparePassword({
			password: req.body.password,
			hash: user.password,
		});
		if (!isPasswordMatch)
			return apiResponse.BAD_REQUEST({
				res,
				message: messages.INVALID_PASSWORD,
			});

		const token = helper.generateToken({
			data: { _id: user._id, role: user.roleId.name },
		});

		return apiResponse.OK({
			res,
			message: messages.SUCCESS,
			data: {
				email: user.email,
				name: user.name,
				role: user.roleId.name,
				token,
			},
		});
	},

	signUp: async (req, res) => {
		if (await DB.USER.findOne({ email: req.body.email }))
			return apiResponse.BAD_REQUEST({
				res,
				message: messages.EMAIL_ALREADY_EXISTS,
			});

		const roleData = await DB.ROLE.findOne({
			name: req.body.role ? req.body.role : "user",
		}).lean();
		if (!roleData)
			return apiResponse.NOT_FOUND({ res, message: messages.INVALID_ROLE });
		req.body.roleId = roleData._id;

		const createdUser = await DB.USER.create(req.body);
		return apiResponse.OK({
			res,
			message: messages.SUCCESS,
			data: createdUser,
		});
		// exports.signIn(req, res);
	},

	forgot: async (req, res) => {
		const isUserExists = await DB.USER.findOne({
			email: req.body.email,
			isActive: true,
		})
			.populate("roleId", "name")
			.lean();
		if (!isUserExists)
			return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

		const otp = await EMAIL.sendEmail({
			to: req.body.email,
			subject: " Forgot password",
		});
		console.log("otp ------", otp);
		await DB.OTP.findOneAndUpdate(
			{ email: req.body.email },
			{ otp: otp },
			{ upsert: true, new: true },
		);
		return apiResponse.OK({ res, message: messages.SUCCESS });
	},

	verifyOtp: async (req, res) => {
		if (
			Date.now() >
			(await DB.OTP.findOne({ email: req.body.email, otp: req.body.otp })
				.expireAt)
		)
			return apiResponse.BAD_REQUEST({ res, message: messages.OTP_EXPIRED });

		const verify = await DB.OTP.findOneAndDelete({
			email: req.body.email,
			otp: req.body.otp,
		});
		if (!verify)
			return apiResponse.BAD_REQUEST({ res, message: messages.INVALID_CREDS });
		const hashPass = await helper.hashPassword({ password: req.body.password });

		await DB.USER.findOneAndUpdate(
			{ email: req.body.email },
			{ $set: { password: hashPass } },
		);
		return apiResponse.OK({ res, message: messages.SUCCESS });
	},

	changePassword: async (req, res) => {
		const user = await DB.USER.findOne({ email: req.body.email });
		if (!user)
			return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

		await DB.USER.findOneAndUpdate(
			{ email: req.body.email },
			{ password: await helper.hashPassword({ password: req.body.password }) },
		);
		return apiResponse.OK({ res, message: messages.SUCCESS });
	},

	updatePassword: async (req, res) => {
		const user = await DB.USER.findById(req.user._id);
		if (!user)
			return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

		if (
			!(await helper.comparePassword({
				password: req.body.oldPassword,
				hash: user.password,
			}))
		)
			return apiResponse.BAD_REQUEST({
				res,
				message: messages.INVALID_PASSWORD,
			});

		await DB.USER.findByIdAndUpdate(req.user._id, {
			password: await helper.hashPassword({ password: req.body.newPassword }),
		});
		return apiResponse.OK({ res, message: messages.SUCCESS });
	},

	update: async (req, res) => {
		const user = await DB.USER.findById(req.params._id);
		if (!user)
			return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

		if (await DB.USER.findOne({ email: req.body.email }))
			return apiResponse.DUPLICATE_VALUE({
				res,
				message: messages.EMAIL_ALREADY_EXISTS,
			});
		let data = await DB.USER.findByIdAndUpdate(req.params._id, req.body, {
			new: true,
		});
		return apiResponse.OK({ res, message: messages.SUCCESS, data });
	},

	getUser: async (req, res) => {
		let { page, limit, sortBy, sortOrder, search, ...query } = req.query;

		page = parseInt(page) || 1;
		limit = parseInt(limit) || 10;
		sortBy = sortBy || "createdAt";
		sortOrder = sortOrder || -1;

		query =
			req.user.roleId.name === ADMIN ? { ...query } : { _id: req.user._id };
		search
			? (query = {
					$or: [{ name: { $regex: search, $options: "i" } }],
			  })
			: "";

		const data = await DB.USER.find(query)
			.skip((page - 1) * limit)
			.limit(limit)
			.sort({ [sortBy]: sortOrder })
			.populate("roleId", "name")
			.lean();

		return apiResponse.OK({
			res,
			message: messages.SUCCESS,
			count: await DB.USER.countDocuments(query),
			data,
		});
	},

	dashboardCounts: async (req, res) => {
		const data = {
			userCount: await DB.USER.countDocuments(),
			roleCount: await DB.ROLE.countDocuments(),
			movieCount: await DB.MOVIES.countDocuments(),
		};
		return apiResponse.OK({ res, message: messages.SUCCESS, data });
	},
};
