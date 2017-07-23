var socket = io();
var lastActivityInfo = null;

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
            panelType: trackDetail.panelType,
            panelMode: trackDetail.panelMode,
            iconType: trackDetail.iconType,
            divID: trackDetail.divID
        });

        console.log('Formed message', html);
        // console.log('Current timeline ', timelineHtml.html());
        timelineHtml.append(html);

        jqueryTimeline(trackDetail);

    });
});

socket.on('updateTrackDetail', function (trackDetail) {
    var template = jQuery('#timeline-template').html();
    var html = Mustache.render(template, {
        panelType: trackDetail.panelType,
        panelMode: trackDetail.panelMode,
        iconType: trackDetail.iconType,
        divID: trackDetail.divID
    });

    var timelineHtml = jQuery('#' + trackDetail.divID);

    // // console.log('Current timeline ', timelineHtml.html());

    timelineHtml.replaceWith(html);

    jqueryTimeline(trackDetail);

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
    lastActivityInfo = trackLastActivityInfo;
    timerFunction();
});

socket.on('updateTrackLastActivity', function (trackLastActivityInfo) {
    //update the activity info
    lastActivityInfo = trackLastActivityInfo;
});

function timerFunction() {
    var params = jQuery.deparam(window.location.search);
    setInterval(function () {
        console.log("Calling socket.emit with info", params, lastActivityInfo);
        socket.emit('getTimeLineUpdates', params, lastActivityInfo);
    }, 7000);
}

function jqueryTimeline(trackDetail) {
    var timelinedetailHtml = jQuery('#' + trackDetail.divID);

    if ((!trackDetail.headingStrong || /^\s*$/.test(trackDetail.headingStrong))
        && (!trackDetail.headingContent || /^\s*$/.test(trackDetail.headingContent))) {
        // blank heading and content
    } else {
        var headingtemplate = jQuery('#timeline-heading-template').html();
        var headingHtml = Mustache.render(headingtemplate, {
            headingStrong: trackDetail.headingStrong,
            headingContent: trackDetail.headingContent
        });
        timelinedetailHtml.append(headingHtml);
    }

    if ((!trackDetail.bodyStrong || /^\s*$/.test(trackDetail.bodyStrong))
        && (!trackDetail.bodyContent || /^\s*$/.test(trackDetail.bodyContent))) {
        // blank body and content
    } else {
        if (trackDetail.option1 === "1") {
            var bodytemplate = jQuery('#timeline-body-iframe-template').html();
            var bodyHtml = Mustache.render(bodytemplate, {
                trackIDLink: trackDetail.bodyStrong
            });
            timelinedetailHtml.append(bodyHtml);
        } else {
            var bodytemplate = jQuery('#timeline-body-template').html();
            var bodyHtml = Mustache.render(bodytemplate, {
                bodyStrong: trackDetail.bodyStrong,
                bodyContent: trackDetail.bodyContent
            });
            timelinedetailHtml.append(bodyHtml);
        }
    }

    if ((!trackDetail.footerStrong || /^\s*$/.test(trackDetail.footerStrong))
        && (!trackDetail.footerContent || /^\s*$/.test(trackDetail.footerContent))) {
        // blank body and content
    } else {
        var footertemplate = jQuery('#timeline-footer-template').html();
        var footerHtml = Mustache.render(footertemplate, {
            footerStrong: trackDetail.footerStrong,
            footerContent: trackDetail.footerContent
        });
        timelinedetailHtml.append(footerHtml);
    }
    
    $("html, body").animate({ scrollTop: ($("#" + trackDetail.divID).offset().top - 50 )+ 'px' }, 500);
}
