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

        $(document).on("dp.change", '#toDate', function () {
            GetGoodReceipt(1);
        })
        $(document).on("dp.change", '#fromDate', function () {
            GetGoodReceipt(1);
        })
        $('#search').on('keyup', function () {
            clearTimeout(delayTimer)
            delayTimer = setTimeout(function () {
                GetGoodReceipt(1)
            }, 1000)
        })
     
        $('#search').on('change', function () {
            clearTimeout(delayTimer)
            delayTimer = setTimeout(function () {
                GetGoodReceipt(1)
            }, 1000)
        })

        $(document).on('mouseover', '#tbGoodReceipt tbody tr', function () {
            let tr = $(this);
            $('#tbGoodReceipt tbody').find('tr.row-selected').each(function () {
                //if (!$(this).is(tr)) {
                $(this).removeClass("row-selected")
                //}
            })

            tr.addClass("row-selected")
        })
        $(document).on('mouseout', '#tbGoodReceipt tbody tr', function () {
            $(this).removeClass("row-selected")
        })
        $(document).on('touchstart', '#tbGoodReceipt tbody tr', function () {
            let tr = $(this);
            $('#tbGoodReceipt tbody').find('tr.row-selected').each(function () {
                //if (!$(this).is(tr)) {
                $(this).removeClass("row-selected")
                //}
            })

            tr.addClass("row-selected")
        })
        $(document).on('touchend', '#tbGoodReceipt tbody tr', function () {
            $(this).removeClass("row-selected")
        })

        $('#cbokho').on('change', function () {
            GetGoodReceipt(1);
        });
        GetGoodReceipt(1);
    }
    function GetGoodReceipt(pageIndex) {
        var currenpage = pageIndex || 1;
        showLoadingOverlay(contentDataList);
        $.ajax({
            type: "GET",
            url: config.GET_GOODRECEIPT,
            data: {
                keyword: $('#search').val(),
                pageIndex: pageIndex ?? 1,
                pageSize: config.PAGE_SIZE,
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
                GetGoodReceipt(page)
            });
        }
    }


    return {
        init: init
    };

})(window, jQuery, config);

