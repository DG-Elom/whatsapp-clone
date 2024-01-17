const express = require("express");
const router = express.Router();
const { getMessages, sendMessage } = require("../controllers/messages");

router.get("/", getMessages);
router.post("/", sendMessage);

module.exports = router;
