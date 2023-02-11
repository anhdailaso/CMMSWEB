var HistoryModule = HistoryModule || (function (window, $, config) {
    var contentDataList = "#GetHistory";
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
                GetListHistory(1);
            }, 1000)
        })

        $('#cboMaThietBi').on('change', function () {
            LoadBoPhan();
            LoadPhuTung();
        })

        $('#cboMaBoPhan').on('change', function () {
            LoadPhuTung();
        })

        $('#cboMaPhuTung').on('change', function () {
            GetListHistory(1);
        })

        $('#chkThayThePT').on('change', function () {
            console.log($('#chkThayThePT').is(":checked"));
            GetListHistory(1);
        })

        $(document).on("dp.change", '#fromDate', function () {
            GetListHistory(1);
        })

        $(document).on("dp.change", '#toDate', function () {
            console.log($('#search'));
            $('#search').val("");
            GetListHistory(1);
        })

        GetListHistory(1);

    }

    function LoadBoPhan() {
        $('#cboMaBoPhan option').remove();
        $.ajax({
            type: "POST",
            url: config.GET_BO_PHAN,
            data: { msmay: $('#cboMaThietBi').val() },
            success: function (data) {
                $('#cboMaBoPhan').html('');
                var s = '';
                for (var i = 0; i < data.length; i++) {
                    s += '<option value="' + data[i].value + '">' + data[i].text + '</option>';
                }
                $("#cboMaBoPhan").html(s);
            }
        });
    }

    function LoadPhuTung() {
        $('#cboMaPhuTung option').remove();
        $.ajax({
            type: "POST",
            url: config.GET_PHU_TUNG,
            data: { msmay: $('#cboMaThietBi').val(), msbp: $('#cboMaBoPhan').val() },
            success: function (data) {
                $('#cboMaPhuTung').html('');
                var s = '';
                for (var i = 0; i < data.length; i++) {
                    s += '<option value="' + data[i].value + '">' + data[i].text + '</option>';
                }
                $("#cboMaPhuTung").html(s);
                GetListHistory(1);
            }
        });
    }

    function GetListHistory(pageIndex) {
        var currenpage = pageIndex || 1;
        showLoadingOverlay("#GetHistory");

        $.ajax({
            type: "GET",
            url: config.GET_LIST_HISTORY,
            data: {
                keySeach: $('#search').val(),
                pageIndex: pageIndex ?? 1,
                pageSize: config.PAGE_SIZE,
                msmay: $('#cboMaThietBi').val(),
                tungay: $('#fromDate').val(),
                denngay: $('#toDate').val(),
                ttphutung: $('#chkThayThePT').is(":checked"),
                mabp: $('#cboMaBoPhan').val(),
                mapt: $('#cboMaPhuTung').val(),
            },
            success: function (response) {
                $(contentDataList).html(response);
                let totalPages = $('#hfTotalPage').val();
                renderPagination(totalPages, 'paggingResult', currenpage);
            },
            complete: function () {
                hideLoadingOverlay("#GetHistory");
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
                GetListHistory(page);
            });
        }
    }


    return {
        init: init
    };

})(window, jQuery, config);

