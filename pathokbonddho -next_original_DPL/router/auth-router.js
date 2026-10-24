const express = require("express");
const router = express.Router();
const authcontrollers = require("../controllers/auth-controller");
const { signUpSchema, loginSchema } = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");
const authMiddleware = require("../middlewares/auth-middleware");

//home route
router.route("/").get(authcontrollers.home);

router
  .route("/register")
  .post(validate(signUpSchema), authcontrollers.register);
router.route("/login").post(validate(loginSchema), authcontrollers.login);
router.route("/me").get(authMiddleware, authcontrollers.getMe);

module.exports = router;

