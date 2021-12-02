const { UserModel } = require("./model");
const bcrypt = require("bcrypt");
const saltRound = 10;

const signUp = async (req, res) => {
  console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRound);
    const response = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(200).json({
      data: response,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "Fail",
      err: err.message,
    });
  }
};
module.exports = { signUp };
