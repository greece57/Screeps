var constructions = require('next.Construction');
var roles = require('role').names;

var nextCreep = {
    spawn: function(currSpawn) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == roles.HARVESTER);
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == roles.UPGRADER);
        var builders = _.filter(Game.creeps, (creep) => (creep.memory.role == roles.BUILDER || creep.memory.oldRole == roles.BUILDER));
        var repairs = _.filter(Game.creeps, (creep) => (creep.memory.role == roles.REPAIR && creep.memory.oldRole != roles.BUILDER))
        
        var extensions = constructions.structuresOfType(currSpawn.room, STRUCTURE_EXTENSION);
        var currEnergy = currSpawn.energy;
        var maxEnergy = currSpawn.energyCapacity;
        
        for(var ext in extensions) {
            currEnergy += extensions[ext].energy;
            maxEnergy += extensions[ext].energyCapacity;
        }
        
        // min. Creeps:
        if (harvesters.length < 4 && currEnergy >= 300) {
            var newName = currSpawn.createCreep(helperMethods.nextBody(currEnergy, roles.HARVESTER), undefined, {role: roles.HARVESTER});
            console.log('Spawning new harvester: ' + newName);
        } else if (currEnergy == maxEnergy) {
            var newName = '';
            var r = '';
            if (upgraders.length < 1) {
                newName = currSpawn.createCreep(helperMethods.nextBody(currEnergy, roles.UPGRADER), undefined, {role: roles.UPGRADER});
                r = 'upgrader';
            } else if(builders.length < 1) {
                newName = currSpawn.createCreep(helperMethods.nextBody(currEnergy, roles.BUILDER), undefined, {role: roles.BUILDER});
                r = 'builder';
            } else if(harvesters.length < helperMethods.maxOfRole(roles.HARVESTER, currSpawn.room)) {
                newName = currSpawn.createCreep(helperMethods.nextBody(currEnergy, roles.HARVESTER), undefined, {role: roles.HARVESTER});
                r = 'harvester';
            } else if (upgraders.length < helperMethods.maxOfRole(roles.UPGRADER, currSpawn.room)) {
                newName = currSpawn.createCreep(helperMethods.nextBody(currEnergy, roles.UPGRADER), undefined, {role: roles.UPGRADER});
                r = 'upgrader';
            } else if (builders.length < helperMethods.maxOfRole(roles.BUILDER, currSpawn.room)) {
                newName = currSpawn.createCreep(helperMethods.nextBody(currEnergy, roles.BUILDER), undefined, {role: roles.BUILDER});
                r = 'builder';
            } else if (repairs.length < helperMethods.maxOfRole(roles.REPAIR, currSpawn.room)) {
                newName = currSpawn.createCreep(helperMethods.nextBody(currEnergy, roles.REPAIR), undefined, {role: roles.REPAIR});
                r = 'repair';
            }
            if (newName != '')
                console.log('Spawning new creep: ' + newName + ' Role: ' + r);
        }
    }
};

var helperMethods = {
    
    maxOfRole :function(role, currRoom) {
        var countExtensions = constructions.structuresOfType(currRoom, STRUCTURE_EXTENSION);
        switch(role) {
            case roles.HARVESTER:
                if (countExtensions <= 5) {
                    return 8;
                } else {
                    return 6;
                }
                break;
            case roles.UPGRADER:
                if (countExtensions <= 5)
                    return 4;
                else
                    return 2;
                break;
            case roles.BUILDER:
                if (countExtensions < 5 || currRoom.controller.level > 2)
                    return 4;
                else
                    return 2;
                break;
            case role.REPAIR:
                return 2;
                break;
        }
    },
    
    nextBody :function(maxEnergy, role) {
        switch(role) {
            case roles.HARVESTER:
                return helperMethods.nextHarvesterBody(maxEnergy);
                break;
            case roles.BUILDER:
                return helperMethods.nextBuilderBody(maxEnergy);
                break;
            case roles.UPGRADER:
                return helperMethods.nextBuilderBody(maxEnergy);
                break;
                
        }
    },
    
    nextHarvesterBody: function(maxEnergy) {
        var Bodyarray = [WORK, MOVE, CARRY];
        var restEnergy = maxEnergy - 200;
        
        
        if (restEnergy < 100)
            return Bodyarray;
        
        var xtraWorkParts = 0;
        var xtraCarryParts = 0;
        for (i = 100; i <= (restEnergy); i+=100) {
            Bodyarray.push(WORK);
            xtraWorkParts++;
            if (xtraWorkParts % 5 == 0 && i <= (restEnergy + 100)) {
                Bodyarray.push(CARRY);
                xtraCarryParts++;
                i += 50;
            }
        }
        
        restEnergy -= (xtraWorkParts)*100;
        restEnergy -= (xtraCarryParts)*50;
        
        for (i = 50; i <= (restEnergy); i+=50) {
            Bodyarray.push(MOVE);
        }
        
        return Bodyarray;
    },
    
    nextBuilderBody: function(maxEnergy) {
        var Bodyarray = [WORK, MOVE, CARRY];
        var restEnergy = maxEnergy - 200;
        
        
        if (restEnergy < 100)
            return Bodyarray;
        
        var xtraWorkParts = 0;
        for (i = 100; i <= (restEnergy - 100); i+=100) {
            Bodyarray.push(WORK);
            xtraWorkParts++;
        }
        
        restEnergy -= (xtraWorkParts)*100;
        
        for (i = 50; i <= (restEnergy); i+=50) {
            Bodyarray.push(MOVE);
        }
        
        return Bodyarray;
    }
};


module.exports = nextCreep;