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
        personResp : personResptxt.val(),
        taskDone : taskDonetxt.val(),
        responseKey : responseKeytxt.val(),
        responseMessage : responseMessagetxt.val(),
        panelType : panelTypetxt.val(),
        panelMode : panelModetxt.val(),
        iconType : iconTypetxt.val(),
        divID : divIDtxt.val()
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
        personResp : personResptxt.val(),
        taskDone : taskDonetxt.val(),
        responseKey : responseKeytxt.val(),
        responseMessage : responseMessagetxt.val(),
        panelType : panelTypetxt.val(),
        panelMode : panelModetxt.val(),
        iconType : iconTypetxt.val(),
        divID : divIDtxt.val()
    });

    console.log('Div ID will be updated to', template);

    var timelineHtml = jQuery('#' + divIDtxt.val());

    // // console.log('Current timeline ', timelineHtml.html());

    timelineHtml.replaceWith(html);

})

    