const { Router } = require("express");
const { signUp } = require("./controller");
const passport=require("passport")

const router = Router();

router.post("/signup", signUp);

router.get("/", (req, res) => {
  res.render("index");
});


module.exports = router;
