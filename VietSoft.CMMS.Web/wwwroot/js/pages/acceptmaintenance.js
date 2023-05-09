var AcceptMaintenanceModule = AcceptMaintenanceModule || (function (window, $, config) {
    var contentDataList = "#GetAcceptMaintenance";
    var delayTimer;
    var bload = false;

    function init() {
        bload = false;
        setDatePicker("#toDate", null, null, null);

        const TNgay = new Date();
        TNgay.setMonth(TNgay.getMonth() - 1);
        setDatePicker("#fromDate", TNgay, null, null);

        $('#search').on('keyup', function () {
            clearTimeout(delayTimer)
            delayTimer = setTimeout(function () {
                GetListAcceptMaintenance(1);
            }, 1000)
        })

        $(document).on("dp.change", '#fromDate', function () {
            GetListAcceptMaintenance(1);
        })

        //chọn phụ tùng
        $(document).on("click", '#btnNgungMay', function () {
            $.ajax({
                type: "GET",
                url: config.urlViewNgungMay,
                data: {
                    mspbt: $('#MS_PBT').text(),
                    msmay: $('#MS_MAY').text()
                },
                success: function (response) {
                    $('#modalLarge .modal-content').html(response);
                    $('#modalLarge').modal('show');
                    DanhSachNgungMay();
                }
            });
        });

        //refresh thời gian ngừng máy
        $(document).on("click", '#btnRefreshTGNM', function () {
            showLoadingOverlay("#resultContent");
            $.ajax({
                type: "GET",
                url: config.urlRefreshNgungMay,
                data: {
                    tungay: $('#fromDateNM').val(),
                    denngay: $('#toDateNM').val(),
                    msnn: $('#cboNguyennhan').val(),
                    msmay: $('.emp-code').text()

                },
                success: function (response) {
                    if (response.responseCode == -1) {
                        showWarning(response.responseMessage)
                    }
                    else {
                        $("#resultContent").html(response);
                    }
                },
                complete: function () {
                    hideLoadingOverlay("#resultContent");

                }
            });
        });


        $(document).on("click", '.remove-row', function () {
            $(this).closest("tr").remove();
        });

        //add thời gian ngừng máy
        $(document).on("click", '#btnAddTGNM', function () {
            let model = [];
            $("#tbNguyenNhanNgungMay tbody tr").each(function () {
                var row = {};
                row.MS_NGUYEN_NHAN = $(this).find(".cboLuoiNN").val();
                row.TEN_NGUYEN_NHAN = '';
                row.ID_CA = $(this).find("td[data-ca]").data("ca");
                row.TEN_CA = '';
                row.TU_GIO = $(this).find("td[data-tugio]").data("tugio");
                row.DEN_GIO = $(this).find("td[data-dengio]").data("dengio");
                model.push(row);
            });
            showLoadingOverlay("#resultContent");
            $.ajax({
                type: "GET",
                url: config.urlAddNgungMay,
                data: {
                    tungay: $('#fromDateNM').val(),
                    denngay: $('#toDateNM').val(),
                    msnn: $('#cboNguyennhan').val(),
                    msmay: $('#MS_MAY').text(),
                    json: JSON.stringify(model),
                },
                success: function (response) {
                    if (response.responseCode == -1) {
                        showWarning(response.responseMessage)
                    }
                    else {
                        $("#resultContent").html(response);
                    }
                },
                complete: function () {
                    hideLoadingOverlay("#resultContent");

                }
            });
        });

        //save thời gian ngừng máy
        $(document).on("click", '#btnSaveNgungMay', function () {
            let model = [];
            $("#tbNguyenNhanNgungMay tbody tr").each(function () {
                var row = {};
                row.MS_NGUYEN_NHAN = $(this).find(".cboLuoiNN").val();
                row.ID_CA = $(this).find("td[data-ca]").data("ca");
                row.TU_GIO = $(this).find("td[data-tugio]").data("tugio");
                row.DEN_GIO = $(this).find("td[data-dengio]").data("dengio");
                model.push(row);
            });
            $.ajax({
                type: "GET",
                url: config.urlSaveNgungMay,
                data: {
                    mspbt: $('#MS_PBT').text(),
                    json: JSON.stringify(model),
                },
                success: function (response) {
                    if (response.responseCode == 1) {
                        showSuccess(response.responseMessage);
                    }
                    else {
                        showWarning(response.responseMessage)
                    }
                },
                complete: function () {
                }
            });
        });



        function DanhSachNgungMay() {
            showLoadingOverlay("#resultContent");
            $.ajax({
                type: "GET",
                url: config.urlNgungMay,
                data: {
                    mspbt: $('#MS_PBT').text(),
                    msmay: $('#MS_MAY').text()
                },
                success: function (response) {
                    $("#resultContent").html(response);
                },
                complete: function () {
                    hideLoadingOverlay("#resultContent");
                  
                }
            });
        }


        $(document).on("dp.change", '#toDate', function () {
            $('#search').val("");
            GetListAcceptMaintenance(1);
        })

        GetListAcceptMaintenance(1);

    }

    function nghiemthuPBT(e) {
    //    $.ajax({
    //        type: "POST",
    //        url: config.urlSaveAcceptMaintenance,
    //        data: { mspbt: $(e).attr('data-src') },
    //        success: function (response) {
    //            if (response.responseCode == 1) {
    //                showSuccess(response.responseMessage);
    //                GetListAcceptMaintenance(1);
    //            }
    //            else {
    //                showWarning(response.responseMessage);
    //            }
    //        }
    //    });
        $.ajax({
            type: "GET",
            data: {
                mspbt: $(e).attr('data-src'),
                msmay: $(e).attr('data-msmay'),
            },
            url: config.urlAcceptMaintenance,
            success: function (response) {
                $('#modal .modal-content').html(response);
                $('#modal').modal('show');
            }
        });
    }
    //form-control input-validation-error
    //aria-invalid="true"
    //span class="field-validation-error"
    $(document).on('click', '#btnYes', function () {
        console.log($("#TT_SAU_BT").is(":invalid"));
        if ($('#AcceptWorkOrderForm').valid()) {
            $.ajax({
                url: config.urlSaveAcceptMaintenance,
                type: "POST",
                data: $('#AcceptWorkOrderForm').serialize(),
                success: function (response) {
                    if (response.responseCode == 1) {
                        showSuccess(response.responseMessage);
                        $('#modal').modal('hide');
                        GetListAcceptMaintenance(1);
                    }
                    else {
                        showWarning(response.responseMessage)
                    }
                }

            });
        }
    })

    $(document).on('click', '#btnNo', function () {
        $('#modal').modal('hide');
    })


    function GetListAcceptMaintenance(pageIndex) {
        var currenpage = pageIndex || 1;
        showLoadingOverlay("#GetAcceptMaintenance");
        $.ajax({
            type: "GET",
            url: config.GET_LIST_AcceptMaintenance,
            data: {
                keySeach: $('#search').val(),
                pageIndex: pageIndex ?? 1,
                pageSize: config.PAGE_SIZE,
                tungay: $('#fromDate').val(),
                denngay: $('#toDate').val(),
            },
            success: function (response) {
                $(contentDataList).html(response);
                let totalPages = $('#hfTotalPage').val();
                renderPagination(totalPages, 'paggingResult', currenpage);
            },
            complete: function () {
                hideLoadingOverlay("#GetAcceptMaintenance");
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
                GetListAcceptMaintenance(page);
            });
        }
    }


    return {
        init: init,
        nghiemthuPBT: nghiemthuPBT
    };

})(window, jQuery, config);

