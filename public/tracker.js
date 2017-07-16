var socket = io();

var addButton = jQuery('#addToTimeLine');

addButton.on('click', function () {
    var personResptxt = jQuery('[name=timeline-personResp]');
    var taskDonetxt = jQuery('[name=timeline-taskDone]');
    var responseKeytxt = jQuery('[name=timeline-responseKey]');
    var responseMessagetxt = jQuery('[name=timeline-responseMessage]');
    var panelTypetxt = jQuery('[name=timeline-panelType]');
    var panelModetxt = jQuery('[name=timeline-panelMode]');
    var iconTypetxt = jQuery('[name=timeline-iconType]');
    var divIDtxt = jQuery('[name=timeline-divID]');

    var template = jQuery('#timeline-template').html();
    var html = Mustache.render(template, {
        personResp: personResptxt.val(),
        taskDone: taskDonetxt.val(),
        responseKey: responseKeytxt.val(),
        responseMessage: responseMessagetxt.val(),
        panelType: panelTypetxt.val(),
        panelMode: panelModetxt.val(),
        iconType: iconTypetxt.val(),
        divID: divIDtxt.val()
    });

    console.log('Formed message', html);

    var timelineHtml = jQuery('#timelineID');

    // console.log('Current timeline ', timelineHtml.html());

    timelineHtml.append(html);
})

var updateButton = jQuery('#updateTimeLine');

updateButton.on('click', function () {
    var divIDtxt = jQuery('[name=timeline-updateDivID]');
    var personResptxt = jQuery('[name=timeline-personResp]');
    var taskDonetxt = jQuery('[name=timeline-taskDone]');
    var responseKeytxt = jQuery('[name=timeline-responseKey]');
    var responseMessagetxt = jQuery('[name=timeline-responseMessage]');
    var panelTypetxt = jQuery('[name=timeline-panelType]');
    var panelModetxt = jQuery('[name=timeline-panelMode]');
    var iconTypetxt = jQuery('[name=timeline-iconType]');

    // var template = jQuery('#' + divIDtxt.val()).html();
    var template = jQuery('#timeline-template').html();
    var html = Mustache.render(template, {
        personResp: personResptxt.val(),
        taskDone: taskDonetxt.val(),
        responseKey: responseKeytxt.val(),
        responseMessage: responseMessagetxt.val(),
        panelType: panelTypetxt.val(),
        panelMode: panelModetxt.val(),
        iconType: iconTypetxt.val(),
        divID: divIDtxt.val()
    });

    console.log('Div ID will be updated to', html);

    var timelineHtml = jQuery('#' + divIDtxt.val());

    // // console.log('Current timeline ', timelineHtml.html());

    timelineHtml.replaceWith(html);
})

jQuery('#timeline-form').on('submit', function (e) {
    e.preventDefault();

    var personResptxt = jQuery('[name=timeline-personResp]');
    var taskDonetxt = jQuery('[name=timeline-taskDone]');
    var responseKeytxt = jQuery('[name=timeline-responseKey]');
    var responseMessagetxt = jQuery('[name=timeline-responseMessage]');
    var panelTypetxt = jQuery('[name=timeline-panelType]');
    var panelModetxt = jQuery('[name=timeline-panelMode]');
    var iconTypetxt = jQuery('[name=timeline-iconType]');
    var divIDtxt = jQuery('[name=timeline-divID]');

    var template = jQuery('#timeline-template').html();
    var html = Mustache.render(template, {
        personResp: personResptxt.val(),
        taskDone: taskDonetxt.val(),
        responseKey: responseKeytxt.val(),
        responseMessage: responseMessagetxt.val(),
        panelType: panelTypetxt.val(),
        panelMode: panelModetxt.val(),
        iconType: iconTypetxt.val(),
        divID: divIDtxt.val()
    });

    console.log('Formed message', html);

    var timelineHtml = jQuery('#timelineID');

    // console.log('Current timeline ', timelineHtml.html());

    timelineHtml.append(html);

})

jQuery('#timeline-updateForm').on('submit', function (e) {
    e.preventDefault();

    var divIDtxt = jQuery('[name=timeline-updateDivID]');
    var personResptxt = jQuery('[name=timeline-personResp]');
    var taskDonetxt = jQuery('[name=timeline-taskDone]');
    var responseKeytxt = jQuery('[name=timeline-responseKey]');
    var responseMessagetxt = jQuery('[name=timeline-responseMessage]');
    var panelTypetxt = jQuery('[name=timeline-panelType]');
    var panelModetxt = jQuery('[name=timeline-panelMode]');
    var iconTypetxt = jQuery('[name=timeline-iconType]');

    // var template = jQuery('#' + divIDtxt.val()).html();
    var template = jQuery('#timeline-template').html();
    var html = Mustache.render(template, {
        personResp: personResptxt.val(),
        taskDone: taskDonetxt.val(),
        responseKey: responseKeytxt.val(),
        responseMessage: responseMessagetxt.val(),
        panelType: panelTypetxt.val(),
        panelMode: panelModetxt.val(),
        iconType: iconTypetxt.val(),
        divID: divIDtxt.val()
    });

    console.log('Div ID will be updated to', template);

    var timelineHtml = jQuery('#' + divIDtxt.val());

    // // console.log('Current timeline ', timelineHtml.html());

    timelineHtml.replaceWith(html);

})

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

    // socket.emit('join', params, function(err) {
    //     if(err){
    //         alert(err);
    //         window.location.href = '/';
    //     }else{
    //         console.log('No Error');
    //     }
    // })
});

socket.on('createTrack', function (trackInfo) {
    var timelineHtml = jQuery('#timelineID');
    timelineHtml.empty();
    console.log(trackInfo);

    timelineHtml.append("<div class='line text-muted'></div>");

    trackInfo.forEach(function (trackDetail) {
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

socket.on('disconnect', function () {
    console.log('Server disconnected');
});

