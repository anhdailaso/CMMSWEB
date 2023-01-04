var MoningToringModule = MoningToringModule || (function (window, $, config) {
    var contentDataList = "#GetMoningToring";
    var delayTimer;
    var bload = false;
    function init() {
        //$(document).ready(function () {
        //    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="collapse"]'))
        //    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        //        return new bootstrap.Tooltip(tooltipTriggerEl)
        //    })
        //});

        //$("button").hover(function () {
        //    $('[role ="tooltip"]').css({ "background-color": "#ffff" });
        //});
        $('#chkanct').on('change', function () {
            if ($(this).is(":checked")) {
                $('.accordion-collapse.collapse').removeClass('show');
            }
            else {
                $('.accordion-collapse.collapse').addClass('show');
            }
        })

        $('input[type=radio][name=flexRadioDefault]').change(function () {
            GetMoningToring();
        });

        bload = true;
        GetMoningToring();
}


    function GetMoningToring() {
        if (bload == false) return;
        showLoadingOverlay(contentDataList);
        $.ajax({
            type: "GET",
            url: config.GET_MONITORING_LIST,
            data: {
                msmay: $('#MS_MAY').val(),
                isDue: $('input[name = "flexRadioDefault"]:checked').val()
            },
            success: function (response) {
                $(contentDataList).html(response);
            },
            complete: function () {
                hideLoadingOverlay(contentDataList);
            }
        });
    }


    return {
        init: init
    };

})(window, jQuery, config);

