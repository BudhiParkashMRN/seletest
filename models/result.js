const mongoose = require("mongoose");

const UserActionSchema = new mongoose.Schema({
  userId: Number,
  actions: [String],
});

const ResultSchema = new mongoose.Schema({
  url: String,
  browser: String,
  userActions: [UserActionSchema],
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", ResultSchema);
