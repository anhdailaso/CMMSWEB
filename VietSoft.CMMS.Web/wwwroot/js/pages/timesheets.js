var TimeSheetOverviewModule = TimeSheetOverviewModule || (function (window, $, config) {

    function init() {
        $('.tab-detail').on('click', function (event) {
            GetTimesheetDetail();
        })

        $('.tab-overview').on('click', function (event) {
            GetTimesheetOverview();
        })

        setMonthYearPicker("#months");

        $(document).on("dp.change", '#months', function (e) {
            let tab = $('.nav-tabs li a.active');
            if ($(tab).attr('id') == 'tab-overview') {
                GetTimesheetOverview();
            }
            else {
                GetTimesheetDetail();
            }
        });

        GetTimesheetOverview();
    }

    function GetTimesheetOverview() {
        showLoadingOverlay("#detail");
        $.ajax({
            type: "GET",
            url: config.GET_TIMESHEET_OVERVIEW,
            data: {
                employeeCode: $('#EmployeeCode').val(),
                month: $('#months').val()
            },
            success: function (response) {
                $('#overview').html(response)
            },
            complete: function () {
                hideLoadingOverlay("#detail");
            }

        });
    }

    function GetTimesheetDetail(pageIndex) {
        showLoadingOverlay("#overview");
        var currenpage = pageIndex || 1;
        $.ajax({
            type: "GET",
            url: config.GET_TIMESHEET_DETAIL,
            data: {
                employeeCode: $('#EmployeeCode').val(),
                month: $('#months').val(),
                pageIndex: pageIndex ?? 1,
                pageSize: config.PAGE_SIZE
            },
            success: function (response) {
                $('#overview').html(response)
                let totalPages = $('#hfTotalPage').val();
                renderPagination(totalPages, 'paggingResult', currenpage);
            },
            complete: function () {
                hideLoadingOverlay("#overview");
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
                GetTimesheetDetail(page)
            });
        }
    }
    
    return {
        init: init
    };

})(window, jQuery, config);

