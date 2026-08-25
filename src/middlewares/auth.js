const adminAuth = (req, res, next) => {
  const token = "abc";
  const isAdminAuthorized = token === "abc";
  if (!isAdminAuthorized) {
    res.status(401).send("User not authorized");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
};
