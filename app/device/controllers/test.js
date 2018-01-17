
var db = null;
module.exports = function (dbbase) {

    db = dbbase;

    this.add = function (opendid) {


        console.log(db.User);

       db.User.findOne({
            where: {
                openid: opendid
            }
        }).then(function (result) {
            if (result == null) {
              db.User.create({
                    openid: opendid,
                    roleid: 111,
                    active: true
                });
            }
        });

    }
};