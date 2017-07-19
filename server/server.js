const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const { isRealString } = require('./utils/validation')

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
    jdeUser = users;
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

        //     var jdePassword = params.jdePassword;
        //     var jdeUser = params.jdeUser;

        //     /* New functionality to directly access the page from JDE, passing the user info as query string */

        //     if (jdePassword && jdeUser) {
        //         /* password and jdeUser exists, so create user profile dynamically since they would have not come via login screen */
        //         users.removeUser(params.user);
        //         users.addUser(jdeUser, jdePassword, params.user);
        //     }

        //     var user = users.getUser(params.user);

        //     if (!user) {
        //         return callback('User invalid/Session refreshed. Please login again!');
        //     }

        //     if (!isRealString(user.jdePassword)) {
        //         users.removeUser(params.user);
        //         return callback('Empty Password!');
        //     }

        //     // validate JDE login

        //     var jdeLoginURL = `${JDEServerURL}/jderest/tokenrequest`;
        //     var jdeLoginData = {
        //         "username": user.jdeUserID,
        //         "password": user.jdePassword,
        //         "deviceName": "nodeJSServer",
        //         "environment": "JDV910",
        //         "role": "*ALL"
        //     };

        //     axios.post(jdeLoginURL, jdeLoginData).then((response) => {
        //         // Logged in sucessfully
        //         var jdeLogoutURL = `${JDEServerURL}/jderest/tokenrequest/logout`;
        //         var jdeLogoutData = {
        //             "token": response.data.userInfo.token
        //         };

        //         axios.post(jdeLogoutURL, jdeLogoutData).then((response) => {

        //         });

        //         users.updateSocketID(params.user, socket.id);
        //         socket.emit('loggedIn');

        //     }).catch((e) => {
        //         console.log('Invalid User Credentials');
        //         users.removeUser(user.jdeUserID);
        //         socket.emit('invalidJDEUser');
        //     })

        var trackCreationData = [{
            personResp: "Jan",
            taskDone: "created Task 123",
            responseKey: "Task 123",
            responseMessage: "was created",
            panelType: "panel-primary",
            panelMode: "panel-success",
            iconType: "glyphicon-ok",
            divID: "1"
        }, {
            personResp: "Karthik",
            taskDone: "created Task 123",
            responseKey: "Task 123",
            responseMessage: "was created",
            panelType: "panel-primary",
            panelMode: "panel-success",
            iconType: "glyphicon-ok",
            divID: "2"
        }, {
            personResp: "Zhivko",
            taskDone: "created Task 123",
            responseKey: "Task 123",
            responseMessage: "was created",
            panelType: "panel-primary",
            panelMode: "panel-success",
            iconType: "glyphicon-ok",
            divID: "2"
        }];
        socket.emit('createTrack', trackCreationData);

        callback();
    });

    socket.on('getTrackUpdates', (params, callback) => {
        var trackDetail = {
            personResp: "Karthik",
            taskDone: "created Task 123",
            responseKey: "Task 123",
            responseMessage: "was created",
            panelType: "panel-primary",
            panelMode: "panel-danger",
            iconType: "glyphicon-cog",
            divID: "2"
        };

        socket.emit('updateTrackDetail', trackDetail);
    });

    // socket.on('getAvailabilityData', () => {
    //     // var itemAvailabilityData = {
    //     //     itemNames : ['Item Z', 'Item Y', 'Item X', 'Item W', 'Item V'],
    //     //     itemAvailableNos : [getRandomInt(-100, 100), getRandomInt(-100, 100), getRandomInt(-100, 100), getRandomInt(-100, 100), getRandomInt(-100, 100)]
    //     // };

    //     // socket.emit('updateAvailabilityData', itemAvailabilityData);

    //     // var itemAvailabilityData = {
    //     //     itemNames : ['Item Z', 'Item Y', 'Item X', 'Item W', 'Item V'],
    //     //     itemAvailableNos : [getRandomInt(-100, 100), getRandomInt(-100, 100), getRandomInt(-100, 100), getRandomInt(-100, 100), getRandomInt(-100, 100)]
    //     // };

    //     // socket.emit('updateAvailabilityData2', itemAvailabilityData);

    //     var user = users.getUserBySocketID(socket.id);

    //     if (user) {
    //         getJDEAvailability(socket, user);
    //     }

    // });

    socket.on('disconnect', () => {
        // users.removeUserBySocket(socket.id);
        console.log('Client disconnected');
    })
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
