var ThoigianChayMayModule = ThoigianChayMayModule || (function (window, $, config) {
    var contentDataList = "#GetThoigianChayMay";
    var delayTimer;
    var bquyen = false;

    function init() {
        bload = false;
        setDatePicker("#toDate", null, null, null);
        const TNgay = new Date();
        TNgay.setMonth(TNgay.getMonth() - 1);
        setDatePicker("#fromDate", TNgay, null, null);

        $('#cboDiaDiem').on('change', function () {
            LoadMay();
        });

        $(document).on("dp.change", '#toDate', function () {
            GetBaoCaoThoigianChayMay(1);
        })
        $(document).on("dp.change", '#fromDate', function () {
            GetBaoCaoThoigianChayMay(1);
        })

        $(document).on("change", '#cboMay', function () {
            GetBaoCaoThoigianChayMay(1);
        })

        $(document).on('click', '#btnAdd', function () {
            if ($('#cboMay').val() === '-1') {
                showWarning("Bạn cần phải chọn máy trước khi thêm!");
                return;
            }



            ThemThoiGianChayMay();
        });

        $(document).on('click', '#SaveTGCM', function () {
            if ($('#TGCMForm').valid()) {

                if ($('#THEM').val() == 0) {
                    $("#NGAY").prop("disabled", false);
                }

                $.ajax({
                    url: config.SAVE_TGCM,
                    type: "POST",
                    data: $('#TGCMForm').serialize(),
                    success: function (response) {
                        if (response.responseCode == 1) {
                            showSuccess(response.responseMessage);
                            $('#modalLarge').modal('hide');
                            GetBaoCaoThoigianChayMay(1);
                        }
                        else {
                            if ($('#THEM').val() == 0) {
                                $("#NGAY").prop("disabled", true);
                            }
                            showWarning(response.responseMessage)
                        }
                    }

                });
            }

        });

        $(document).on('click', '.btnDelete', function () {
            let ngay = $(this).data('ngay');
            ShowConfirm("bạn có muốn xóa thời gian chạy máy này?", 'warning', '', function (result) {
                if (result == true) {
                    $.ajax({
                        type: "POST",
                        url: config.DELETE_TGCM,
                        data: {
                            msmay: $('#cboMay').val(),
                            ngay: ngay,
                        },
                        success: function (response) {
                            if (response.responseCode == 1) {
                                showSuccess(response.responseMessage)
                                GetBaoCaoThoigianChayMay(1);
                            }
                            else {
                                showWarning(response.responseMessage)
                            }
                        },
                        complete: function () {
                        }
                    });

                }
            });
        });


        $(document).on('click', '.btnEdit', function () {

            console.log($(this).closest('tr').find("td").eq(3).text());

            let model = {
                MS_MAY: $('#cboMay').val(),
                sNGAY: $(this).closest('tr').find("td").eq(0).text().trim(),
                CHI_SO_DONG_HO: 0,
                SO_GIO_LUY_KE: $(this).closest('tr').find("td").eq(3).text().trim(),
                THEM: 0,
            };
            $.ajax({
                type: "POST",
                url: config.EDIT_TGCM,
                data: {
                    model: model,
                },
                success: function (response) {
                    $('#modalLarge .modal-content').html(response);
                    $('#modalLarge').modal('show');
                }
            });
        });


        GetBaoCaoThoigianChayMay(1);
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

    function ThemThoiGianChayMay() {
        let model = {
            MS_MAY: $('#cboMay').val(),
            NGAY: null,
            CHI_SO_DONG_HO: 0,
            SO_GIO_LUY_KE: 0,
            THEM: 1,
        };
        $.ajax({
            type: "POST",
            url: config.INSERT_TGCM,
            data: {
                model: model,
            },
            success: function (response) {
                $('#modalLarge .modal-content').html(response);
                $('#modalLarge').modal('show');
            }
        });
    }

    function GetBaoCaoThoigianChayMay(pageIndex) {
        var currenpage = pageIndex || 1;
        showLoadingOverlay(contentDataList);
        $.ajax({
            type: "GET",
            url: config.GET_ThoigianChayMay,
            data: {
                pageIndex: pageIndex ?? 1,
                pageSize: config.PAGE_SIZE,
                tungay: $('#fromDate').val(),
                denngay: $('#toDate').val(),
                msmay: $('#cboMay').val(),
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
                GetGoodIssue(page)
            });
        }
    }


    return {
        init: init
    };

})(window, jQuery, config);

