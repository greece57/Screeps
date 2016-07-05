var helper = require('helper');
var roleFunctions = require('role').roleFunctions;

var nextConstruction = {
    
    createNextSite: function(currRoom) {
        
        
        var nextConstType = helperMethods.identifyNextType(currRoom);
        
        if (nextConstType.type == undefined)
            return false;
        
        if (nextConstType.type == STRUCTURE_EXTENSION)
            helperMethods.createNextExtension(currRoom, currRoom.find(FIND_MY_SPAWNS)[0]);
            
        if (nextConstType.type == STRUCTURE_ROAD) {
            return true;
        }
        
        return true;
    },
    
    structuresOfType: function(currRoom, Type)
    {
        var allStructures = helper.hashValues(Game.structures);
        
        return allStructures.filter(function (struct) { return (struct.structureType == Type && struct.room == currRoom) });
    },
    
    countStructures: function(currRoom, Type) {
        var allStructures = helper.hashValues(Game.structures);
        
        return allStructures.filter(function (struct) { return (struct.structureType == Type && struct.room == currRoom) }).length;
    }
};

var helperMethods = {
    
    identifyNextType: function(currRoom) {
        var countExtensions = nextConstruction.countStructures(currRoom, STRUCTURE_EXTENSION);
            
        if ((currRoom.controller.level == 2 && countExtensions < 5) ||
            (currRoom.controller.level > 2 && countExtensions < Math.min(currRoom.controller.level, 8) * 10 - 20))
            return {type: STRUCTURE_EXTENSION};
            
        var nextRoad = helperMethods.createNextRoad(currRoom);
        if (nextRoad)
            return {type: STRUCTURE_ROAD};
            
        var nextWall = helperMethods.createNextWall(currRoom);
        if (nextWall)
            return {type: STRUCTURE_WALL};
            
        var nextTower = helperMethods.createNextTower(currRoom);
        if (nextTower != false)
            return {type: STRUCTURE_TOWER, pos: nextTower};
            
        var nextContainer = helperMethods.createNextContainer(currRoom);
        if (nextContainer)
            return {type: STRUCTURE_CONTAINER};
            
        return {type: undefined};
    },
    
    createNextExtension: function(currRoom, currSpawn) {

        var relativeX = -1;
        var relativeY = -1;
        var iteration = 1;
        var round = 1;
        do {
            console.log("X: ", relativeX, "Y: ", relativeY);
            if (!((relativeX == 0 && relativeY % 2 == 0) || (relativeY == 0 && relativeX % 2 == 0))) {
                var result = currRoom.createConstructionSite((currSpawn.pos.x + relativeX), (currSpawn.pos.y + relativeY), STRUCTURE_EXTENSION);
                
            }
            var writeX = Math.floor(((iteration % (4 * round))/round));
            writeX = -1*(writeX-2)%2;
            var writeY = Math.floor(((iteration % (4 * round))/round));
            writeY = (writeY-1) %2;
            
            relativeX += writeX * 2;
            relativeY += writeY * 2;
            
            if (iteration % (4* round) === 0) {
                round++;
                iteration = 0;    
                relativeX -= 1;
                relativeY += 1;
            }
            
            iteration++;
        } while (result == -7)
        console.log('Creating next Extension: ', result);
    },
    
    createNextRoad: function(currRoom) {
        var targets = currRoom.find(FIND_MY_SPAWNS);
        targets.push(currRoom.controller);
        targets = targets.concat(currRoom.find(FIND_STRUCTURES).filter(function (s) {return s.structureType == STRUCTURE_EXTENSION}));
        
        for (var t in targets)
        {
        
            var target = targets[t];
            var targetSource;
            if (target.memory != undefined && target.memory.mySource != undefined) {
                targetSource = Game.getObjectById(target.memory.mySource);
            } else {
                targetSource = roleFunctions.findNearestSource(target, currRoom.find(FIND_SOURCES), currRoom).source;
            }
            
            var paths = currRoom.findPath(target.pos, targetSource.pos, {ignoreCreeps: true});
            var roads = currRoom.find(STRUCTURE_ROAD);
            // first direct path
            for(var p in paths)
            {
                var path = paths[p];
                if (currRoom.lookAt(path.x, path.y).length <= 1)
                {
                    if(roads.filter(item => (item.pos.x == path.x && item.pos.y == path.y)).length == 0) {
                        var result = helperMethods.buildNextRoad(currRoom, new RoomPosition(path.x, path.y, currRoom.name));
                        if (result == 0)
                            return true;
                    }
                }
            }
            if (target.structureType == STRUCTURE_SPAWN)
            {
                // then path around it
                for(var p in paths)
                {
                    var path = paths[p];
                    for (var dx = path.x - 2; dx <= path.x + 2; dx++)
                    {
                        for (var dy = path.y - 2; dy <= path.y + 2; dy++)
                        {
                            if (currRoom.lookAt(dx, dy).length <= 1)
                            {
                                if(roads.filter(item => (item.pos.x == dx && item.pos.y == dy)).length == 0) {
                                    var result = helperMethods.buildNextRoad(currRoom, new RoomPosition(dx, dy, currRoom.name));
                                    if (result == 0)
                                        return true;
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return false;
    },
    
    buildNextRoad: function(currRoom, position) {
            
        var result = currRoom.createConstructionSite(position, STRUCTURE_ROAD);
        console.log('Creating next Road: ', result);
        return result;
    },
    
    createNextWall: function(currRoom) {
        return false;
    },
    
    createNextTower: function(currRoom)  {
        return false;
    },
    
    createNextContainer: function(currRoom) {
        return false;
    }
};

module.exports = nextConstruction;