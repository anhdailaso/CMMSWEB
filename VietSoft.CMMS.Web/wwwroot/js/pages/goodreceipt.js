var GoodReceiptModule = GoodReceiptModule || (function (window, $, config) {
    var contentDataList = "#GetGoodReceipt";
    var delayTimer;
    var bload = false;

    function init() {
        bload = false;
        setDatePicker("#toDate", null, null, null);
        const TNgay = new Date();
        TNgay.setFullYear(TNgay.getFullYear() - 1);
        setDatePicker("#fromDate", TNgay, null, null);

        $('#cbokho').on('change', function () {
            GetGoodReceipt(1,0);
        });
        GetGoodReceipt(1,0);
    }
    function GetGoodReceipt(pageIndex, reset) {
        var currenpage = pageIndex || 1;
        showLoadingOverlay(contentDataList);
        $.ajax({
            type: "GET",
            url: config.GET_GOODRECEIPT,
            data: {
                keyword: $('#search').val(),
                pageIndex: pageIndex ?? 1,
                pageSize: config.PAGE_SIZE,
                reset: reset,
                mskho: $('#cbokho').val(),
                tungay: $('#fromDate').val(),
                denngay: $('#toDate').val(),
            },
            success: function (response) {
                $(contentDataList).html(response);
                let totalPages = $('#hfTotalPage').val();
                renderPagination(totalPages, 'paggingResult', currenpage);
            },
            complete: function () {
                hideLoadingOverlay(contentDataList);
            }
        });
    }

    function renderPagination(totalPages, divRender, currentPage) {
        var pagination = $("#" + divRender);
        var divPagingId = divRender + '-dvPagination';
        pagination.html('');
        pagination.html('<div id="' + divPagingId + '"></div>');
        if (totalPages > 0) {
            initTwbsPagination("#" + divPagingId, currentPage, totalPages, function (page) {
                GetGoodReceipt(1);
            });
        }
    }


    return {
        init: init
    };

})(window, jQuery, config);

