//web 路由 设置api相关接口

var express = require('express');
var game = express.Router();
var setting = require('../setting');


game.use('/libs', express.static(setting.gamePath+"/libs"));
game.use('/resource', express.static(setting.gamePath+"/resource"));
game.use('/js', express.static(setting.gamePath+"/js"));

game.get('/*', function (req, res, next) {
    res.sendFile(setting.gamePath + '/index.html');
});

module.exports = game;