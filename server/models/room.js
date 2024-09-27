const mongoose = require('mongoose');
const playerSchema = require('./player');

const roomSchema = new mongoose.Schema({
    occupancy: {
        type:number,
        default:2,
    },
    maxRound:{
        type:number,
        default: 6,
    },
    currentRound:{
        required: true,
        type:number,
        default:1,
    },
    players:[
        playerSchema
    ],
    isJoin:{
        type:Boolean,
        default:true,
    },
    turn: playerSchema,
    turnIndex:{
        type:Number,
        default:0,
    },
})
const roomModel = mongoose.model('Room', roomSchema);
module.exports=roomModel;