var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');

    var template = jQuery('#loadingTrackID-template').html();
    var html = Mustache.render(template, {
        divID: "initialTimeLineMessage"
    });
    var timelineHtml = jQuery('#timelineID');
    timelineHtml.append(html);

    var params = jQuery.deparam(window.location.search);

    socket.emit('findTrack', params, function (err) {
        if (err) {
            // console.log(err);
            template = jQuery('#invalidTrackID-template').html();
            html = Mustache.render(template, {
                divID: "initialTimeLineMessage"
            });
            // console.log('Div ID will be updated to', template);
            timelineHtml = jQuery('#initialTimeLineMessage');
            // console.log(timelineHtml.html());
            timelineHtml.replaceWith(template);
        } else {

        }
    });

});

socket.on('createTrack', function (trackInfo) {
    var timelineHtml = jQuery('#timelineID');
    timelineHtml.empty();
    console.log(trackInfo);

    timelineHtml.append("<div class='line text-muted'></div>");

    trackInfo.forEach(function (trackDetail) {
        var template = jQuery('#timeline-template').html();
        var html = Mustache.render(template, {
            headingStrong: trackDetail.headingStrong,
            headingContent: trackDetail.headingContent,
            bodyStrong: trackDetail.bodyStrong,
            bodyContent: trackDetail.bodyContent,
            footerStrong: trackDetail.footerStrong,
            footerContent: trackDetail.footerContent,
            panelType: trackDetail.panelType,
            panelMode: trackDetail.panelMode,
            iconType: trackDetail.iconType,
            divID: trackDetail.divID
        });

        console.log('Formed message', html);
        // console.log('Current timeline ', timelineHtml.html());
        timelineHtml.append(html);
    });
});

socket.on('updateTrackDetail', function (trackDetail) {
    var template = jQuery('#timeline-template').html();
    var html = Mustache.render(template, {
        personResp: trackDetail.personResp,
        taskDone: trackDetail.taskDone,
        responseKey: trackDetail.responseKey,
        responseMessage: trackDetail.responseMessage,
        panelType: trackDetail.panelType,
        panelMode: trackDetail.panelMode,
        iconType: trackDetail.iconType,
        divID: trackDetail.divID
    });

    var timelineHtml = jQuery('#' + trackDetail.divID);

    // // console.log('Current timeline ', timelineHtml.html());

    timelineHtml.replaceWith(html);
});

socket.on('criticalError', function (err) {
    alert(err);
    window.location.href = 'http://www.forzaconsulting.eu/en/';
});

socket.on('invalidTrackID', function (err) {
    var template = jQuery('#invalidTrackID-template').html();
    var html = Mustache.render(template, {
        divID: "initialTimeLineMessage"
    });
    // console.log('Div ID will be updated to', template);
    timelineHtml = jQuery('#initialTimeLineMessage');
    // console.log(timelineHtml.html());
    timelineHtml.replaceWith(template);
});

socket.on('disconnect', function () {
    console.log('Server disconnected');
});

socket.on('trackLastActivity', function (trackLastActivityInfo) {
    // start timer to track the activity
    timerFunction(trackLastActivityInfo);
});

function timerFunction(trackLastActivityInfo) {
    var params = jQuery.deparam(window.location.search);
    setInterval(function () {
        console.log("Calling socket.emit with info", params, trackLastActivityInfo);
        socket.emit('getTimeLineUpdates', params, trackLastActivityInfo);
    }, 3000);
}
