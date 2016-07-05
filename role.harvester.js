var roleFunctions = require('role').roleFunctions;

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var workParts = creep.body.filter( (part) => {return (part.type == WORK)}).length;
        
        if(creep.memory.harvesting && creep.carry.energy >= creep.carryCapacity - workParts*2) {
            creep.memory.harvesting = false;
        }
        if(!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        
        if(creep.memory.harvesting) {
            roleFunctions.harvestSource(creep);
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                return -1;
            }
        }
    }
};

module.exports = roleHarvester;