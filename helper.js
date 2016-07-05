/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('helper');
 * mod.thing == 'a thing'; // true
 */
var hashMethods = {
    hashValues: function (hash) {
        var array_values = new Array();

        for (var key in hash) {
            array_values.push(hash[key]);
        }

        return array_values;
    },

    hashKeys: function (hash) {
        var array_keys = new Array();

        for (var key in hash) {
            array_keys.push(key);
        }

        return array_keys;
    }
};
module.exports = hashMethods;