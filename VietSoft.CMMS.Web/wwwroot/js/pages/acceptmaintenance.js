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

        $(document).on("dp.change", '#toDate', function () {
            console.log($('#search'));
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

