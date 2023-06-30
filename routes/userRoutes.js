const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJwt = require("../middleware/verifyJwt");

router.use(verifyJwt);

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .put(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
