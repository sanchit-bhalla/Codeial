module.exports.profile = function (req, res) {
  console.log(req.url);
  return res.end("<h1>User Profile </h1>");
};
