 var EmployeesModule = EmployeesModule || (function (window, $, config) {
     var contentDataList = "#GetMyEcomain";
    var delayTimer;

    function init() {
        GetEmployees(1)

        $('#search').on('keyup', function () {
            clearTimeout(delayTimer)
            delayTimer = setTimeout(function () {
                GetEmployees(1)
            }, 1000)
        })

        $(document).on('mouseover', '#tbGetMyEcomain tbody tr', function () {
            let tr = $(this);
            $('#tbGetMyEcomain tbody').find('tr.row-selected').each(function () {
                //if (!$(this).is(tr)) {
                    $(this).removeClass("row-selected")
                //}
            })

            tr.addClass("row-selected")
        })

        $(document).on('mouseout', '#tbGetMyEcomain tbody tr', function () {
            $(this).removeClass("row-selected")
        })

        $(document).on('touchstart', '#tbGetMyEcomain tbody tr', function () {
            let tr = $(this);
            $('#tbGetMyEcomain tbody').find('tr.row-selected').each(function () {
                //if (!$(this).is(tr)) {
                $(this).removeClass("row-selected")
                //}
            })

            tr.addClass("row-selected")
        })

        $(document).on('touchend', '#tbGetMyEcomain tbody tr', function () {
            $(this).removeClass("row-selected")
        })
    }

    function GetEmployees(pageIndex) {
        showLoadingOverlay("#GetMyEcomain");
        var currenpage = pageIndex || 1;
        $.ajax({
            type: "GET",
            url: config.GET_MYECOMAIN_LIST,
            data: {
                keyword: $('#search').val(),
                pageIndex: pageIndex ?? 1,
                pageSize: config.PAGE_SIZE,
                msnx: '-1',
                msmay: '-1',
                denngay: '15/12/2022'
            },
            success: function (response) {
                $(contentDataList).html(response);
                let totalPages = $('#hfTotalPage').val();
                renderPagination(totalPages, 'paggingResult', currenpage);
            },
            complete: function () {
                hideLoadingOverlay("#GetMyEcomain");
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

