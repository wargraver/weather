function showLoader(){
    $("#loaderMask").show();
}

function hideLoader(){
    $("#loaderMask").hide();
}

$('.setDate').datetimepicker({
    format:'Y-m-d H:i',
    step:5,
    minDate:0,
});

function setDateFormat(dateFormat){
    $('.dateSet').datetimepicker({
        format: dateFormat,
        step:5,
        minDate:0,
    });
}