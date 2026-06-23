const express = require("express");
const router = express.Router();
//const {home, register} = require("../controllers/auth-controller");
const authcontrollers = require("../controllers/auth-controller");
const { signUpSchema, loginSchema } = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");

//home route
router.route("/").get(authcontrollers.home);

router
  .route("/register")
  .post(validate(signUpSchema), authcontrollers.register);
router.route("/login").post(validate(loginSchema), authcontrollers.login);

module.exports = router;
