const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");

let urlencoded = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
app.use(urlencoded);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.post(
  "/formData",
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name can not be empty..")
      .isLength({ min: 3 })
      .withMessage("Name has to be at least 3 characters.")
      .isAlpha()
      .withMessage("Name can not contain numbers or special characters.."),
    check("email", "Email is not valid").isEmail(),
    check("phone1")
      .not()
      .isEmpty()
      .withMessage("Phone number can not be empty")
      .isInt()
      .withMessage("Phone number must contain digits only")
      .isLength({
        min: 3,
        max: 3,
      })
      .withMessage("The area code must be 3 digits"),
    check("zipCode", "there is a problem..")
      .not()
      .isEmpty()
      .withMessage("Zip code can not be empty..")
      .isPostalCode("NL")
      .withMessage("Not a valid NL zip code"),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }
    res.status(202).json({ success: "Ok" });
  }
);

app.listen(port, () => console.log("server running"));
