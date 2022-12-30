var UserRequestModule = UserRequestModule || (function (window, $, config) {
    function init() {
        $(document).ready(function () {
            var auctionImages = null;
            var imagesloader = $('[data-type=imagesloader]').imagesloader({
                maxFiles: 4
                , minSelect: 1
                , imagesToLoad: auctionImages
            });
        });

        setDatePicker("#toDate", null, null, null);
    }
    return {
        init: init
    };

})(window, jQuery, config);

