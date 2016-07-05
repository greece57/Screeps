/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.repair');
 * mod.thing == 'a thing'; // true
 */

var roleRepair = {
    run: function (creep) {
        if (creep.memory.collecting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.collecting = false;
            creep.memory.target = undefined;
            creep.memory.path = undefined;
        } else if (!creep.memory.collecting && creep.carry.energy == 0) {
            creep.memory.collecting = true;
            creep.memory.target = undefined;
            creep.memory.path = undefined;
        }
        if (creep.memory.oldRole != undefined) {
            if ((Game.time - creep.memory.currTime) > 50)
                var oldRole = creep.memory.oldRole
            delete Memory.creeps[creep.name];
            creep.memory.role = oldRole;
        }


        if (creep.memory.collecting) {
            if (!creep.memory.path) {
                // find next path
                var path;
                var collectables = creep.room.find(FIND_DROPPED_RESOURCES);
                if (collectables.length > 0) {
                    path = creep.room.findPath(creep.pos, collectables[0].pos, { serialize: true });
                    creep.memory.target = collectables[0].id;
                } else {
                    var sources = creep.room.find(FIND_SOURCES);
                    var bestSource = sources[0];
                    for (var s in sources) {
                        var source = sources[s];
                        if (source.energy > bestSource.energy)
                            bestSource = source;
                    }

                    path = creep.room.findPath(creep.pos, bestSource.pos, { serialize: true });
                    creep.memory.target = bestSource.id;
                }

                if (path != undefined)
                    creep.memory.path = path;
                else
                    creep.memory.collecting = false;
            } else {
                // move to saved Path
                var moved = creep.moveByPath(creep.memory.path);
                if (!moved) {
                    var target = Game.getObjectById(creep.memory.target);
                    if (target != undefined) {
                        var result;
                        if (target.amount != undefined)
                            result = creep.pickup(target);
                        else
                            result = creep.harvest(target);

                        if (result == -7) {
                            creep.memory.path = undefined;
                            creep.memory.target = undefined;
                        } else if (result != 0)
                            console.log("Error while trying to harvest/pickup", result);
                    } else {
                        console.log("ERROR IN ROLE.REPAIR");
                    }
                }
            }
        } else {
            if (creep.memory.path == undefined) {
                var structs = creep.room.find(FIND_STRUCTURES);
                console.log(structs);
                var structsToRepair = structs.filter(function (item) { return (item.hits < item.hitsMax && (item.owner == undefined || item.owner == creep.owner)) });

                if (structsToRepair.length == 0) {
                    console.log("Nothing to repair?");
                }

                creep.memory.path = creep.room.findPath(creep.pos, structsToRepair[0].pos, { serialize: true });
                creep.memory.target = structsToRepair[0].id;
            } else {
                var notMoved = creep.moveByPath(creep.memory.path);
                if (notMoved) {
                    var target = Game.getObjectById(creep.memory.target);
                    console.log(target);
                    if (target != undefined) {
                        var result = creep.repair(target);

                        if (result == -6) {
                            creep.memory.collecting = true;
                            creep.memory.path = undefined;
                            creep.memory.target = undefined;
                        } else if (result != 0)
                            console.log("Error while trying to ", result);

                        if (target.hits == target.hitsMax) {
                            console.log("FAUL");
                            creep.memory.path = undefined;
                            creep.memory.target = undefined;
                        }
                    } else {
                        console.log("ERROR IN ROLE.REPAIR");
                    }
                }
            }


        }
    }
};

module.exports = roleRepair;