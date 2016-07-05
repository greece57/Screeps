/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role');
 * mod.thing == 'a thing'; // true
 */
 
var names = {
    HARVESTER: 0,
    BUILDER: 1,
    UPGRADER: 2,
    REPAIR: 3
}

var roleFunctions = {
    findSource :function(creep)
    {
        var sources = creep.room.find(FIND_SOURCES);
        var target;
        if (creep.memory.role == names.HARVESTER)
            target = creep.room.find(FIND_MY_SPAWNS)[0];
        if (creep.memory.role == names.UPGRADER)
            target = creep.room.controller;
        if (creep.memory.role == names.BUILDER){
            if (creep.memory.site != undefined)
                target = Game.getObjectById(creep.memory.site);
                
            if (target == undefined) {
                var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                if (sites.length > 0)
                    target = sites[0];
                else
                    target = creep.room.find(FIND_MY_SPAWNS)[0];
            }
        }
        
        if (target.memory != undefined && target.memory.mySource != undefined)
            creep.memory.mySource = target.memory.mySource;
          
        var nearestSource = roleFunctions.findNearestSource(target, sources, creep.room);  
        
        creep.memory.mySource = nearestSource.source.id;
        
        
    },
    
    findNearestSource: function(target, sources, currRoom) {
        var nearestSource = {source: sources[0], pathLength: 100000};
        
        for(var i = 0; i < sources.length; i++) {
            var source = sources[i];
            var pathLength = currRoom.findPath(target.pos, source.pos).length;
            //var pathLength = PathFinder.search({pos: spawn.pos, range: 1}, {pos: source.pos, range: 1}).path;
            if (pathLength < nearestSource.pathLength)
                nearestSource = {source: source, pathLength: pathLength};
        }
        
        return nearestSource;
    },
    
    harvestSource: function(creep) {
        var sourceID = creep.memory.mySource;
        if (sourceID == undefined)
            roleFunctions.findSource(creep);
        else {
            var source = Game.getObjectById(sourceID);
            
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
}

module.exports = {names, roleFunctions};