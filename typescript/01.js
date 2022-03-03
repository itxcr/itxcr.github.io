"use strict";
exports.__esModule = true;
var jQuery_1 = require("jQuery");
var User = /** @class */ (function () {
    function User() {
    }
    return User;
}());
console.log(jQuery_1["default"].ajax);
function getUsers(cb) {
    jQuery_1["default"].ajax({
        url: 'api/users',
        method: 'GET',
        success: function (data) {
            cb(data.items);
        },
        error: function (error) {
            cb(null);
        }
    });
}
