module.exports = {
  checklogin: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash("error_msg", "Not Authorized");
    res.redirect(`${rootpath}/users/login`);
  }
};
