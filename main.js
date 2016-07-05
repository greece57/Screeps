var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var nextCreep = require('next.Creep');
var roles = require('role').names;

module.exports.loop = function () {

    // Always place this memory cleaning code at the very top of your main loop!

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    nextCreep.spawn(Game.spawns.InitSpawn);

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == roles.HARVESTER) {
            var result = roleHarvester.run(creep);
            if (result == -1) {
                roleBuilder.run(creep);
            }
        }
        if (creep.memory.role == roles.UPGRADER) {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == roles.BUILDER) {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == roles.REPAIR) {
            roleRepair.run(creep);
        }
    }
}