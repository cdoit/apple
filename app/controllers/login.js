
//检查是否已经登陆
exports.checkin = function (req, res, next) {
    var admin = req.session.admin;
    if (admin == null) {
        return res.redirect("/manager/login/");
    }
    next();
}
