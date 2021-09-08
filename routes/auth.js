const router = require("express").Router();
const User = require("../models/User");
const { registerValidation, loginValidation } = require("../validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  //validate user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if the user already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email is already exist!");

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  //create new user
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  //
  try {
    const saveUser = await newUser.save();

    //const { password, ...others } = saveUser._doc;

    //res.status(200).json(others);
    res.status(200).send({ user: saveUser._id });
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email not found");

  //checking password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("wrong credential");

  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);

  // res.status(200).send("Login");
});

module.exports = router;
