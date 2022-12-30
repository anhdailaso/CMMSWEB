var MoningToringModule = MoningToringModule || (function (window, $, config) {
    function init() {
        $(document).ready(function () {
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="collapse"]'))
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl)
            })
        });

        //$("button").hover(function () {
        //    $(".tooltip-inner").css({ "background-color": "#113186" });
        //});
    }
    return {
        init: init
    };

})(window, jQuery, config);

