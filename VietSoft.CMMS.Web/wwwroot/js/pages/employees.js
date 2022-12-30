var EmployeesModule = EmployeesModule || (function (window, $, config) {
    var contentDataList = "#employeeList";
    var delayTimer;

    function init() {
        GetEmployees(1)

        $('#search').on('keyup', function () {
            clearTimeout(delayTimer)
            delayTimer = setTimeout(function () {
                GetEmployees(1)
            }, 1000)
        })

        $(document).on('mouseover', '#tblEmployeeList tbody tr', function () {
            let tr = $(this);
            $('#tblEmployeeList tbody').find('tr.row-selected').each(function () {
                //if (!$(this).is(tr)) {
                    $(this).removeClass("row-selected")
                //}
            })

            tr.addClass("row-selected")
        })

        $(document).on('mouseout', '#tblEmployeeList tbody tr', function () {
            $(this).removeClass("row-selected")
        })

        $(document).on('touchstart', '#tblEmployeeList tbody tr', function () {
            let tr = $(this);
            $('#tblEmployeeList tbody').find('tr.row-selected').each(function () {
                //if (!$(this).is(tr)) {
                $(this).removeClass("row-selected")
                //}
            })

            tr.addClass("row-selected")
        })

        $(document).on('touchend', '#tblEmployeeList tbody tr', function () {
            $(this).removeClass("row-selected")
        })
    }

    function GetEmployees(pageIndex) {
        showLoadingOverlay("#employeeList");
        var currenpage = pageIndex || 1;
        $.ajax({
            type: "GET",
            url: config.GET_EMPLOYEE_LIST,
            data: {
                keyword: $('#search').val(),
                pageIndex: pageIndex ?? 1,
                pageSize: config.PAGE_SIZE
            },
            success: function (response) {
                $(contentDataList).html(response);
                let totalPages = $('#hfTotalPage').val();
                renderPagination(totalPages, 'paggingResult', currenpage);
            },
            complete: function () {
                hideLoadingOverlay("#employeeList");
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
                GetEmployees(page)
            });
        }
    }
   
    return {
        init: init
    };

})(window, jQuery, config);

