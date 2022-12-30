var PayslipProductsModule = PayslipProductsModule || (function (window, $, config) {

    function init() {
        $('.tab-detail').on('click', function (event) {
            GetPayslipsProductDetail();
        })

        $('.tab-overview').on('click', function (event) {
            GetPayslipsProductOverview();
        })
        setMonthYearPicker("#months");
        $(document).on("dp.change", '#months', function (e) {
            let tab = $('.nav-tabs li a.active');
            if ($(tab).attr('id') == 'tab-overview') {
                GetPayslipsProductOverview();
            }
            else {
                GetPayslipsProductDetail();
            }

        });
        GetPayslipsProductOverview();
    }

    function GetPayslipsProductOverview() {
        showLoadingOverlay("#payslip-content");
        $.ajax({
            type: "GET",
            url: config.GET_PAYSLIP_PRODUCTS_OVERVIEW,
            data: {
                employeeCode: $('#EmployeeCode').val(),
                month: $('#months').val()
            },
            success: function (response) {
                $('#payslip-content').html(response)
            },
            complete: function () {
                hideLoadingOverlay("#payslip-content");
            }

        });
    }

    function GetPayslipsProductDetail(pageIndex) {
        showLoadingOverlay("#payslip-content");
        var currenpage = pageIndex || 1;
        $.ajax({
            type: "GET",
            url: config.GET_PAYSLIP_PRODUCTS_DETAIL,
            data: {
                employeeCode: $('#EmployeeCode').val(),
                month: $('#months').val(),
                pageIndex: pageIndex ?? 1,
                pageSize: config.PAGE_SIZE
            },
            success: function (response) {
                $('#payslip-content').html(response)
            },
            complete: function () {
                hideLoadingOverlay("#payslip-content");
            }
        });
    }

    return {
        init: init
    };

})(window, jQuery, config);


var PayslipMonthModule = PayslipMonthModule || (function (window, $, config) {

    function init() {
       
        setMonthYearPicker("#months");
        $(document).on("dp.change", '#months', function (e) {
            PayslipMonth()
        });
        PayslipMonth();
    }

    function PayslipMonth() {
        showLoadingOverlay("#payslip-month-content");
        $.ajax({
            type: "GET",
            url: config.GET_PAYSLIP_MONTH,
            data: {
                employeeCode: $('#EmployeeCode').val(),
                month: $('#months').val()
            },
            success: function (response) {
                $('#payslip-month-content').html(response)
            },
            complete: function () {
                hideLoadingOverlay("#payslip-month-content");
            }
        });
    }

    return {
        init: init
    };

})(window, jQuery, config);

