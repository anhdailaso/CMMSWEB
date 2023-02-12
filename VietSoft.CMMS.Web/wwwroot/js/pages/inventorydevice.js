var InVenToryDeviceModule = InVenToryDeviceModule || (function (window, $, config) {
    var contentDataList = "#GetIndentoryDevice";
    var delayTimer;
    var bload = false;

    function init() {
        bload = false;
        $('#cboDiaDiem').on('change', function () {
            LoadMay();
        });

        $('#btnsave').on('click', function () {
            $.ajax({
                type: "POST",
                url: config.SAVE_DATAINDENTORY_DIVE,
                success: function (response) {
                    if (response.responseCode == 1) {
                        showSuccess(response.responseMessage);
                    }
                    else {
                        showWarning(response.responseMessage);
                    }
                }
            });
        });

        $('#btnhuy').on('click', function () {
            GetListIndventoryDevice(1,1);
        });


        $('#cboMay').on('change', function () {
            if ($('#cboDiaDiem').val() == "-1") {
                showWarning("Bạn chưa chọn nơi chuyển đi nơi chuyển đi!");
                $('#cboDiaDiem').focus();
                return;
            }
            //add dữ liệu quéc được vào list
            AddListmoveDevice();
        })
        GetListIndventoryDevice(1,0);
    }
    function GetListIndventoryDevice(pageIndex, reset) {
        var currenpage = pageIndex || 1;
        showLoadingOverlay(contentDataList);
        $.ajax({
            type: "GET",
            url: config.GET_INDENTORY_DIVE,
            data: {
                pageIndex: pageIndex ?? 1,
                pageSize: config.PAGE_SIZE,
                reset: reset,
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

    function AddListmoveDevice() {
        $.ajax({
            type: "POST",
            url: config.SAVE_INDENTORY_DIVE,
            data: {
                mskho: $('#cboDiaDiem').val(),
                tenkho: $('#cboDiaDiem option:selected').text(),
                msmay: $('#cboMay').val(),
                tenmay: $('#cboMay option:selected').text(),
            },
            success: function (response) {
                if (response.responseCode == 1) {
                    GetListIndventoryDevice(1, 0);
                }
                else {
                    showWarning(response.responseMessage);
                }
            }
        });
    }
    function LoadMay() {
        $('#cboMay option').remove();
        $.ajax({
            type: "POST",
            url: config.GET_MAY,
            data: { WorkSiteID: $('#cboDiaDiem').val(), coall: 0 },
            success: function (data) {
                $('#cboMay').html('');
                var s = '';
                for (var i = 0; i < data.length; i++) {
                    s += '<option value="' + data[i].value + '">' + data[i].text + '</option>';
                }
                $("#cboMay").html(s);
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
                GetListIndventoryDevice(1);
            });
        }
    }


    return {
        init: init
    };

})(window, jQuery, config);

