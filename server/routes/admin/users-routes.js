const express = require("express");

const {
  getAllUsers,
  banUser,
  unbanUser,
} = require("../../controllers/admin/users-controller");

const router = express.Router();

router.get("/get", getAllUsers);
router.put("/ban/:id", banUser);
router.put("/unban/:id", unbanUser);

module.exports = router;