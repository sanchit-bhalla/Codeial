const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

let transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "codeialcodeial@gmail.com",
    pass: "",
  },
});

let renderTemplate = (data, relativePath) => {
  let mailHtml;
  ejs.renderFile(
    path.join(__dirname, "../views/mailers", relativePath),
    data,
    function (err, template) {
      if (err) {
        console.log("Error in rendering template", err);
        return;
      }

      mailHtml = template;
    }
  );

  return mailHtml;
};

module.exports = {
  transporter: transport,
  renderTemplate: renderTemplate,
};
