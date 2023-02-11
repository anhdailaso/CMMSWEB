var MoveDeviceModule = MoveDeviceModule || (function (window, $, config) {
    var contentDataList = "#GetMoveDevice";
    var delayTimer;
    var bload = false;

    function init() {
        bload = false;
        $('#cboDiaDiemDi').on('change', function () {
            LoadMay();
        });

        $('#btnsave').on('click', function () {
            $.ajax({
                type: "POST",
                url: config.SAVE_DATA_MOVE_DIVE,
                data: { loaidc: $('input[name = "inlineRadioOptions"]:checked').val() },
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
            GetListmoveDevice(1, 1);
            $('input[type=radio][name=inlineRadioOptions]').filter('[value=false]').prop('checked', true).change();


        });

        $('input[type=radio][name=inlineRadioOptions]').change(function () {
            if ($(this).val() == 'true') {
                //đến
                $('#cboDiaDiemDi').parent('.form-floating').addClass('d-none');
                $('#cboDiaDiemDen').parent('.form-floating').addClass('d-none');
                LoadMayDen();
            }
            else {
                $('#cboDiaDiemDi').parent('.form-floating').removeClass('d-none');
                $('#cboDiaDiemDen').parent('.form-floating').removeClass('d-none');
                LoadMay();
            }
            GetListmoveDevice(1,0);
        });


        $('#cboMay').on('change', function () {
            if ($('input[type=radio][name=inlineRadioOptions]') == 'false') {
                if ($('#cboDiaDiemDi').val() == "-1") {
                    showWarning("Bạn chưa chọn nơi chuyển đi nơi chuyển đi!");
                    $('#cboDiaDiemDi').focus();
                    return;
                }
                if ($('#cboDiaDiemDen').val() == "-1") {
                    showWarning("Bạn chưa chọn nơi chuyển đi nơi chuyển đến!");
                    $('#cboDiaDiemDen').focus();
                    return;
                }
                if ($('#cboDiaDiemDi').val() == $('#cboDiaDiemDen').val()) {
                    showWarning("Nơi chuyển đến phải khác nơi chuyển đi!");
                    $('#cboDiaDiemDen').focus();
                    return;
                }
            }
            //add dữ liệu quéc được vào list
            AddListmoveDevice();


        })
        GetListmoveDevice(1,0)
    }
    function GetListmoveDevice(pageIndex,reset) {
        var currenpage = pageIndex || 1;
        showLoadingOverlay("#GetMoveDevice");
        $.ajax({
            type: "GET",
            url: config.GET_MOVE_DIVE,
            data: {
                pageIndex: pageIndex ?? 1,
                pageSize: config.PAGE_SIZE,
                msnx: $('#cboDiaDiemDi').val(),
                msmay: $('#cboMay').val(),
                loaidc: $('input[name = "inlineRadioOptions"]:checked').val(),
                reset: reset,
            },
            success: function (response) {
                $(contentDataList).html(response);
                let totalPages = $('#hfTotalPage').val();
                renderPagination(totalPages, 'paggingResult', currenpage);
            },
            complete: function () {
                hideLoadingOverlay("#GetMoveDevice");
            }
        });
    }

    function AddListmoveDevice() {
        $.ajax({
            type: "POST",
            url: config.SAVE_MOVE_DIVE,
            data: {
                khodi: $('#cboDiaDiemDi').val(),
                khoden: $('#cboDiaDiemDen').val(),
                tenkhodi: $('#cboDiaDiemDi option:selected').text(),
                tenkhoden: $('#cboDiaDiemDen option:selected').text(),
                msmay: $('#cboMay').val(),
                tenmay: $('#cboMay option:selected').text(),
                loaidc: $('input[name = "inlineRadioOptions"]:checked').val(),
            },
            success: function (response) {
                if (response.responseCode == 1) {
                    GetListmoveDevice(1,0);
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
            data: { WorkSiteID: $('#cboDiaDiemDi').val(), coall: 0 },
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

    function LoadMayDen() {
        $('#cboMay option').remove();
        $.ajax({
            type: "POST",
            url: config.GET_MAY_DEN,
            data: { WorkSiteID: $('#cboDiaDiemDi').val(), coall: 0 },
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
                GetListmoveDevice(page,0);
            });
        }
    }


    return {
        init: init,
        GetListmoveDevice: GetListmoveDevice
    };

})(window, jQuery, config);

