const axios = require('axios');
const socketIO = require('socket.io');
const JDEServerURL = 'http://aisdv910.forza-solutions.com:9082';
// const JDEServerURL = 'http://172.19.2.24:9082';

getJDETimeLineInfo = (socket, params, jdeUser, fromUpdateModule) => {
    var jdeLoginURL = `${JDEServerURL}/jderest/tokenrequest`;
    var jdeLoginData = {
        "username": jdeUser.jdeUsername,
        "password": jdeUser.jdePassword,
        "deviceName": "nodeJSServer",
        "environment": "JDV910",
        "role": "*ALL"
    };

    var token;

    console.log("About to make login call", jdeLoginData);

    axios.post(jdeLoginURL, jdeLoginData).then((response) => {

        console.log("Succesfully logged-in");

        token = response.data.userInfo.token;

        var jdeFormServiceURL = `${JDEServerURL}/jderest/formservice`;
        var jdeFormServiceData = {
            "token": response.data.userInfo.token,
            "role": "*ALL",
            "environment": "JDV910",
            "formInputs": [
                {
                    "value": params.trackID,
                    "id": "1"
                }
            ],
            "formActions": [
                {
                    "command": "DoAction",
                    "controlID": "15"
                }
            ],
            "deviceName": "nodeJSServer",
            "formName": "PFZPCM03_WFZPCM03E"
        };

        return axios.post(jdeFormServiceURL, jdeFormServiceData);

    }).then((response) => {

        console.log("Form service call OK");
        if (response.data.fs_PFZPCM03_WFZPCM03E.data.gridData.summary.records === 0) {
            console.log("No records found");
            socket.emit('invalidTrackID', 'Track ID not found!');
        } else {

            var trackCreationData = [];

            response.data.fs_PFZPCM03_WFZPCM03E.data.gridData.rowset.forEach((gridLine) => {

                var timelineDetail = {
                    headingStrong: gridLine.sHeadingStrong_31.value,
                    headingContent: gridLine.sHeadingContent_32.value,
                    bodyStrong: gridLine.sBodyStrong_33.value,
                    bodyContent: gridLine.sBodyContent_34.value,
                    footerStrong: gridLine.sFooterStrong_35.value,
                    footerContent: gridLine.sFooterContent_36.value,
                    panelType: gridLine.sPanelTypeJSCode_41.value,
                    panelMode: gridLine.sPanelColourJSCode_40.value,
                    iconType: gridLine.sGraphicIconJSCode_42.value,
                    divID: `${gridLine.sTrackerID_21.value}-${gridLine.mnPreviousSeq_22.internalValue}-${gridLine.mnNextSeq_23.internalValue}`,
                    option1: gridLine.chOption1_43.internalValue
                }

                trackCreationData.push(timelineDetail);
            });

            console.log("After populating the array", trackCreationData);
            socket.emit('createTrack', trackCreationData);

            // Find the last activity info and send it to the client

            var trackLastActivityInfo = {
                lastActivityDateJulian: response.data.fs_PFZPCM03_WFZPCM03E.data.txtLastActivityDateString_50.internalValue,
                lastActivityTime: response.data.fs_PFZPCM03_WFZPCM03E.data.txtLastActivityTime_48.internalValue
            }

            console.log("Track last activity info", trackLastActivityInfo);

            if (fromUpdateModule) {
                 console.log("Just update the last activity at client");
                socket.emit('updateTrackLastActivity', trackLastActivityInfo);
            } else {
                console.log("Update the last activity at client and start timer");
                socket.emit('trackLastActivity', trackLastActivityInfo);
            }

        }

        // Finally logout
        var jdeLogoutURL = `${JDEServerURL}/jderest/tokenrequest/logout`;
        var jdeLogoutData = {
            "token": token
        };

        axios.post(jdeLogoutURL, jdeLogoutData).then((response) => {
            console.log("Successfully logged out");
        });
    }).catch((e) => {
        socket.emit('criticalError', 'System error. Please contact system administrator!');
    })
}

getJDETimeLineUpdates = (socket, params, jdeUser, trackLastActivityInfo) => {
    var jdeLoginURL = `${JDEServerURL}/jderest/tokenrequest`;
    var jdeLoginData = {
        "username": jdeUser.jdeUsername,
        "password": jdeUser.jdePassword,
        "deviceName": "nodeJSServer",
        "environment": "JDV910",
        "role": "*ALL"
    };

    var token;

    console.log("About to make login call", jdeLoginData);

    axios.post(jdeLoginURL, jdeLoginData).then((response) => {

        console.log("Succesfully logged-in");

        token = response.data.userInfo.token;

        var jdeFormServiceURL = `${JDEServerURL}/jderest/formservice`;
        var jdeFormServiceData = {
            "token": response.data.userInfo.token,
            "role": "*ALL",
            "environment": "JDV910",
            "formInputs": [
                {
                    "value": params.trackID,
                    "id": "1"
                },
                {
                    "value": trackLastActivityInfo.lastActivityTime,
                    "id": "5"
                },
                {
                    "value": trackLastActivityInfo.lastActivityDateJulian,
                    "id": "6"
                }
            ],
            "formActions": [
                {
                    "command": "DoAction",
                    "controlID": "15"
                }
            ],
            "deviceName": "nodeJSServer",
            "formName": "PFZPCM03_WFZPCM03F"
        };

        return axios.post(jdeFormServiceURL, jdeFormServiceData);

    }).then((response) => {

        console.log("Form service call OK");
        if (response.data.fs_PFZPCM03_WFZPCM03F.data.gridData.summary.records === 0) {
            console.log("No updates on the timeline at this moment");
        } else {

            // check if there are any additions are deletions to this timeline, if yes we need to redraw it
            // instead of updating.

            var deleteoraddtracks = response.data.fs_PFZPCM03_WFZPCM03F.data.gridData.rowset.filter((gridLine) => {
                return (gridLine.chModeProcessing_47.internalValue === "A" || gridLine.chModeProcessing_47.internalValue === "D")
            });

            console.log("Tracks added or deleted", deleteoraddtracks.length);

            if (deleteoraddtracks.length > 0) {
                getJDETimeLineInfo(socket, params, jdeUser, true);
            }
            else {
                // update the existing timeline
                response.data.fs_PFZPCM03_WFZPCM03F.data.gridData.rowset.forEach((gridLine) => {
                    var timelineDetail = {
                        headingStrong: gridLine.sHeadingStrong_31.value,
                        headingContent: gridLine.sHeadingContent_32.value,
                        bodyStrong: gridLine.sBodyStrong_33.value,
                        bodyContent: gridLine.sBodyContent_34.value,
                        footerStrong: gridLine.sFooterStrong_35.value,
                        footerContent: gridLine.sFooterContent_36.value,
                        panelType: gridLine.sPanelTypeJSCode_41.value,
                        panelMode: gridLine.sPanelColourJSCode_40.value,
                        iconType: gridLine.sGraphicIconJSCode_42.value,
                        divID: `${gridLine.sTrackerID_19.value}-${gridLine.mnPreviousSeq_22.internalValue}-${gridLine.mnNextSeq_23.internalValue}`,
                        option1: gridLine.chOption1_48.internalValue
                    }

                    console.log("Timeline detail to be updated", timelineDetail);
                    socket.emit('updateTrackDetail', timelineDetail);

                    // update the last activity info

                    var trackLastActivityInfoNew = {
                        lastActivityDateJulian: gridLine.sDateUpdatedJulian_53.internalValue,
                        lastActivityTime: gridLine.mnTimeUpdated_52.internalValue
                    }

                    console.log("Track last activity info will be updated to", trackLastActivityInfoNew);
                    socket.emit('updateTrackLastActivity', trackLastActivityInfoNew);
                });
            }



            // socket.emit('trackLastActivity', trackLastActivityInfo);
        }

        // Finally logout
        var jdeLogoutURL = `${JDEServerURL}/jderest/tokenrequest/logout`;
        var jdeLogoutData = {
            "token": token
        };

        axios.post(jdeLogoutURL, jdeLogoutData).then((response) => {
            console.log("Successfully logged out");
        });
    }).catch((e) => {
        socket.emit('criticalError', 'System error. Please contact system administrator!');
    })
}

module.exports = { getJDETimeLineInfo, getJDETimeLineUpdates };