const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("open", () => {
  console.log("Mongo : db connection success");
});

const employeeShema = new mongoose.Schema({
  firstName: String,
  LastName: String,
  email: { type: String, index: false },
  age: Number,
  gender: String,
  isActive: Boolean,
});

const Employee = mongoose.model("Employee", employeeShema);
module.exports = Employee;
