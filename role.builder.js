/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

var nextConstruction = require('next.Construction');
var roles = require('role').names;
var roleFunctions = require('role').roleFunctions;

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            var targetID = creep.memory.site;
            var sites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targetID == undefined && sites.length > 0) {
                creep.memory.site = sites[0].id;
                targetID = creep.memory.site;
            }
            var target = Game.getObjectById(targetID);
            if (target != undefined && target != null) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                if (sites.length > 0)
                    creep.memory.site = sites[0].id;
                else {
                    var result = nextConstruction.createNextSite(creep.room);
                    if (!result) {
                        creep.memory.oldRole = creep.memory.role;
                        creep.memory.currTime = Game.time;
                        creep.memory.role = roles.REPAIR;
                    }
                }
            }
        }
        else {
            roleFunctions.harvestSource(creep);
        }
    }
};

module.exports = roleBuilder;