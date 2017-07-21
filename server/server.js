const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path');
const http = require('http');
const axios = require('axios');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const { isRealString } = require('./utils/validation')
const { getJDETimeLineInfo, getJDETimeLineUpdates } = require ('./JDE/jde.js')

const JDEServerURL = 'http://aisdv910.forza-solutions.com:9082';
// const JDEServerURL = 'http://172.19.2.24:9082';

const publicPath = path.join(__dirname, '../public');

const { User } = require('./models/user');
var { mongoose } = require('./db/mongoose');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var jdeUser;

User.find().then((users) => {
    jdeUser = users[0];
}, (e) => {
    console.log(e);
});


io.on('connection', (socket) => {
    console.log('JDE user info to be user', jdeUser);
    console.log('client connected with ID:', socket.id);

    socket.on('findTrack', (params, callback) => {
        console.log(params);

        if (!params || !params.trackID) {
            console.log("Invalid Params");
            return callback('Invalid Params');
        }

        console.log(params.trackID);

        if (!isRealString(params.trackID)) {
            return callback('Empty Track ID!');
        }

        if (!jdeUser || !isRealString(jdeUser.jdeUsername) || !isRealString(jdeUser.jdePassword)) {
            socket.emit('criticalError', 'User invalid. Please contact system administrator!');
        }

        getJDETimeLineInfo(socket, params, jdeUser, false);

        // var trackCreationData = [{
        //     personResp: "Jan",
        //     taskDone: "created Task 123",
        //     responseKey: "Task 123",
        //     responseMessage: "was created",
        //     panelType: "panel-primary",
        //     panelMode: "panel-success",
        //     iconType: "glyphicon-ok",
        //     divID: "1"
        // }, {
        //     personResp: "Karthik",
        //     taskDone: "created Task 123",
        //     responseKey: "Task 123",
        //     responseMessage: "was created",
        //     panelType: "panel-primary",
        //     panelMode: "panel-success",
        //     iconType: "glyphicon-ok",
        //     divID: "2"
        // }, {
        //     personResp: "Zhivko",
        //     taskDone: "created Task 123",
        //     responseKey: "Task 123",
        //     responseMessage: "was created",
        //     panelType: "panel-primary",
        //     panelMode: "panel-success",
        //     iconType: "glyphicon-ok",
        //     divID: "2"
        // }];
        // socket.emit('createTrack', trackCreationData);

        callback();
    });

    socket.on('getTimeLineUpdates', (params, trackLastActivityInfo) => {

        getJDETimeLineUpdates(socket, params, jdeUser, trackLastActivityInfo);

    //     var trackDetail = {
    //         personResp: "Karthik",
    //         taskDone: "created Task 123",
    //         responseKey: "Task 123",
    //         responseMessage: "was created",
    //         panelType: "panel-primary",
    //         panelMode: "panel-danger",
    //         iconType: "glyphicon-cog",
    //         divID: "2"
    //     };

    //     socket.emit('updateTrackDetail', trackDetail);
    });

    socket.on('disconnect', () => {
        // users.removeUserBySocket(socket.id);
        console.log('Client disconnected');
    })
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
