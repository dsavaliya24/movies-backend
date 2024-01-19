const DB = require("../../models");
const messages = require("../../json/message.json");
const apiResponse = require("../../utils/api.response");

module.exports = {
  createRole: async (req, res) => {
    if (await DB.ROLE.findOne({ name: req.body.name })) return apiResponse.DUPLICATE_VALUE({ res, message: messages.DUPLICATE_KEY });
      const role = await DB.ROLE.create(req.body);
    return apiResponse.OK({ res, message: messages.SUCCESS, data: role });
  },
  get: async (req, res) => {
    const role = await DB.ROLE.find();
    return apiResponse.OK({ res, message: messages.SUCCESS, data: role });
  },
};
