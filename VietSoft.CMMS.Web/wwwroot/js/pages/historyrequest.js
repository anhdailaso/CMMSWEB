var HistoryRequestModule = HistoryRequestModule || (function (window, $, config) {
    var contentDataList = "#GetHistoryRequest";
    var delayTimer;
    var bload = false;

    function init() {
        bload = false;


        setDatePicker("#toDate", null, null, null);

        const TNgay = new Date();
        TNgay.setFullYear(TNgay.getFullYear() - 1);
        setDatePicker("#fromDate", TNgay, null, null);

        $('#search').on('keyup', function () {
            clearTimeout(delayTimer)
            delayTimer = setTimeout(function () {
                GetListHistoryRequest(1);
            }, 1000)
        })

        $('#cboMaThietBi').on('change', function () {
            GetListHistoryRequest(1);
        })

        $('#cboNguoiYeuCau').on('change', function () {
            GetListHistoryRequest(1);
        })

        $(document).on("dp.change", '#fromDate', function () {
            GetListHistoryRequest(1);
        })

        $(document).on("dp.change", '#toDate', function () {
            GetListHistoryRequest(1);
        })

        //chọn phụ tùng
        $(document).on("click", '.showPBT', function () {
            $.ajax({
                type: "GET",
                url: config.ViewChiTietPBT,
                data: {
                    mspbt: $(this).data('mspbt'),
                },
                success: function (response) {
                    $('#modalLarge .modal-content').html(response);
                    $('#modalLarge').modal('show');
                }
            });
        });

        GetListHistoryRequest(1);
    }

    function GetListHistoryRequest(pageIndex) {
        var currenpage = pageIndex || 1;
        showLoadingOverlay("#GetHistoryRequest");

        $.ajax({
            type: "GET",
            url: config.GET_LIST_HISTORYREQUEST,
            data: {
                keySeach: $('#search').val(),
                pageIndex: pageIndex ?? 1,
                pageSize: config.PAGE_SIZE,
                msmay: $('#cboMaThietBi').val(),
                tungay: $('#fromDate').val(),
                denngay: $('#toDate').val(),
                nguoiyc: $('#cboNguoiYeuCau').val(),
            },
            success: function (response) {
                $(contentDataList).html(response);
                let totalPages = $('#hfTotalPage').val();
                renderPagination(totalPages, 'paggingResult', currenpage);
            },
            complete: function () {
                hideLoadingOverlay("#GetHistoryRequest");
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
                GetListHistoryRequest(page);
            });
        }
    }

    return {
        init: init
    };

})(window, jQuery, config);

