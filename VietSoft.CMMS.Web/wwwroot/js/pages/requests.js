var RequestModule = RequestModule || (function (window, $, config) {

    function init() {
        setMonthYearPicker("#months");

      

        GetRequestList(1, config.TAB_PENDING)

        $('.tab-pending-request').on('click', function () {
            $('#chkAll').closest('.form-check').show()
            $('#chkAll').prop('checked', true)
            $('#monthsContainer').addClass('disabled')
            LoadDataWithTabActive(1)
        })

        $('.tab-old-request').on('click', function () {
            $('#chkAll').closest('.form-check').hide()
            $('#chkAll').prop('checked', false)
            $('#monthsContainer').removeClass('disabled')
            LoadDataWithTabActive(1)
        })

        $(document).on("dp.change", '#months', function () {
            LoadDataWithTabActive(1)
        });

        $('#chkAll').on('change', function () {
            if (this.checked) {
                $('#monthsContainer').addClass('disabled')
            }
            else {
                $('#monthsContainer').removeClass('disabled')
            }
            LoadDataWithTabActive(1)
        })
    }

    function LoadDataWithTabActive(page) {
        let tab = $('.nav-tabs li a.active');
        if ($(tab).attr('id') == 'tab-pending-request') {
            GetRequestList(page, config.TAB_PENDING)
        }
        else {
            GetRequestList(page, config.TAB_ALL)
        }
    }

    function GetRequestList(pageIndex, status) {
        showLoadingOverlay("#request-list")
        let currenpage = pageIndex || 1;
        $.ajax({
            type: "GET",
            url: config.GET_REQUEST_LIST,
            data: {
                isCheckAll: $('#chkAll').prop('checked'),
                month: $('#months').val(),
                status: status,
                pageIndex: pageIndex ?? 1,
                pageSize: config.PAGE_SIZE
            },
            success: function (response) {
                $('#request-list').html(response)
                let totalPages = $('#hfTotalPage').val();
                renderPagination(totalPages, 'paggingResult', currenpage);
            },
             complete: function () {
                 hideLoadingOverlay("#request-list");
            }
        });
    }

    function renderPagination(totalPages, divRender, currentPage) {
        let pagination = $("#" + divRender);
        let divPagingId = divRender + '-dvPagination';
        pagination.html('');
        pagination.html('<div id="' + divPagingId + '"></div>');
        if (totalPages > 0) {
            initTwbsPagination("#" + divPagingId, currentPage, totalPages, function (page) {
                LoadDataWithTabActive(page)
            });
        }
    }

    function initApplyRequest() {
        setDatePicker("#fromDate", null, new Date())
        setDatePicker("#toDate", null, new Date())
        setTimePicker("#fromHours")
        setTimePicker("#toHours")

        initDateTimeEvent()

        $('#btnApply').on('click', function () {
            if ($('#formSubmitRequest').valid()) {
                if (isWeekend()) {
                    showConfirm();
                }
                else {
                    submitApplyRequest();
                }
            }
        });

        $(document).on('click', '#btnConfirm', function () {
            submitApplyRequest()
        })

        initValidation()
    }

    function initDateTimeEvent() {
        $(document).on("dp.change", '#fromDate, #toDate', function (e) {
            let diffDays = getDiffDays($('#fromDate').val(), $('#toDate').val()) + 1
            if (diffDays) {
                $('#totalDay').text(diffDays)
            }
            calculateTotalHours()
        });

        $(document).on("dp.hide", '#fromDate', function (e) {
            $('#toDate').focus()
        });

        $(document).on("dp.change", '#fromHours, #toHours', function (e) {
            let diffTime = getDiffTimes($('#fromHours').val(), $('#toHours').val())
            $('#hoursInDayHidden').val(diffTime)
            $('#hours').text(getHoursAndMinusText(diffTime))
            calculateTotalHours()
        });

        $(document).on("dp.hide", '#fromHours', function (e) {
            $('#toHours').focus()
        });

        $('#leaveByHours').on('change', function () {
            if ($(this).is(':checked')) {
                $('#content-leave-by-hours').removeClass('disabled-content')
                addHoursValidation()
            }
            else {
                $('#content-leave-by-hours').addClass('disabled-content')
                removeHoursValidation()
                clearHours()
            }
        })
    }

    function addHoursValidation() {
        $("#fromHours, #toHours").each(function () {
            $(this).rules("add", {
                required: true,
                messages: {
                    required: "Không được để trống."
                }
            })
        })
    }

    function removeHoursValidation() {
        $("#fromHours, #toHours").each(function () {
            $(this).rules("remove")
        })
    }

    function clearHours() {
        $('#fromHours').val('')
        $('#toHours').val('')
        $('#hours').val('')
        $('#totalHours').val('')
        $('#hoursInDayHidden').val('')
        $('#totalHoursHidden').val('')
    }

    function initValidation() {
        $("#formSubmitRequest").validate({
            ignore: '',
            rules: {
                "ReasonCode": {
                    required: true,
                },
                "fromDate": {
                    required: true,
                    //fromDateNotGreaterThan: "#toDate"
                },
                "toDate": {
                    required: true,
                    toDateGreaterThan: "#fromDate"
                },
                "toHours": {
                    toHoursGreaterThan: "#fromHours"
                }
            },
            messages:
            {
                "ReasonCode": {
                    required: "Không được để trống."
                },
                "fromDate": {
                    required: "Không được để trống."
                },
                "toDate": {
                    required: "Không được để trống."
                }
            },
            errorPlacement: function (error) {
                let id = error[0].id;
                $("#" + id).replaceWith(error);
            },
            success: function (error) {
                //error.remove();
                let id = error[0].id;
                $("#" + id).empty();
            }
        });

        $.validator.addMethod("toDateGreaterThan",
            function (value, element, params) {
                if (!isNaN(value) || !isNaN($(params).val()))
                    return true;

                let newValue = value.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");
                let paramValue = $(params).val().replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");

                if (!/Invalid|NaN/.test(new Date(newValue))) {
                    return new Date(newValue) >= new Date(paramValue);
                }

                return Number(newValue) >= Number(paramValue);
            }, "Đến ngày phải lớn hơn Từ ngày.");

        $.validator.addMethod("toHoursGreaterThan",
            function (value, element, params) {
                let fromHours = $(params).val();
                let toHours = value;
                if (!isNaN(fromHours) || !isNaN(toHours))
                    return true;

                let fromHoursValue = fromHours.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");
                let toHoursValue = toHours.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3");

                return toHoursValue > fromHoursValue;
            }, "Đến giờ phải lớn hơn Từ giờ.");
    }

    function submitApplyRequest() {
        showLoadingOverlay()
        let model = getSubmitData()

        $.ajax({
            type: "POST",
            url: config.APPLY_REQUEST_LEAVE,
            data: {
                model: model
            },
            success: function (response) {
                if (response.responseCode == 1) {
                    showSuccess(response.responseMessage)
                    setTimeout(function () { window.location.href = config.GET_OLD_REQUEST }, 3000)
                }
                else {
                    showWarning(response.responseMessage)
                }
            },
            complete: function () {
                hideLoadingOverlay()
                $('#modal').modal('hide')
            }
        });
    }

    function getSubmitData() {
        let todate = getDateFromDateTimepicker($('#toDate').val()).getDate;
        let fromDate = getDateFromDateTimepicker($('#fromDate').val()).getDate;
        let fromHours = getDateFromDateTimepicker($('#fromHours').val(), 'LT').getDate;
        let toHours = getDateFromDateTimepicker($('#toHours').val(), 'LT').getDate;
        let model = {
            ReasonCode: $('#ReasonCode').val(),
            FromDate: fromDate.toJSON(),
            ToDate: todate.toJSON(),
            TotalDay: $('#totalDay').text(),
            IsLeaveTimes: $('#leaveByHours').prop('checked'),
            FromTimes: fromHours.toJSON(),
            ToTimes: toHours.toJSON(),
            TotalTimes: $('#totalHoursHidden').val(),
            TotalTimesInDay: $('#hoursInDayHidden').val()
        };
        return model;
    }

    function showConfirm() {
        $.ajax({
            type: "GET",
            url: config.SHOW_CONFIRM_SUBMIT_FOR_WEEKEN,
            success: function (response) {
                $('#modal .modal-content').html(response);
                $('#modal').modal('show');
            }
        });
    }

    function isWeekend() {
        return checkIsWeekend(getDateFromDateTimepicker($('#fromDate').val()).getDate, getDateFromDateTimepicker($('#toDate').val()).getDate)
    }

    function calculateTotalHours() {
        let diffDays = getDiffDays($('#fromDate').val(), $('#toDate').val()) + 1
        let diffTime = getDiffTimes($('#fromHours').val(), $('#toHours').val())
        if (diffDays && diffTime) {
            let totalHours = diffTime * diffDays
            $('#totalHoursHidden').val(totalHours)
            $('#totalHours').text(getHoursAndMinusText(totalHours))
        }
    }

    return {
        init: init,
        initApplyRequest: initApplyRequest,
        initValidation: initValidation,
        initDateTimeEvent: initDateTimeEvent,
        showConfirm: showConfirm,
        getSubmitData: getSubmitData,
        isWeekend: isWeekend
    };

})(window, jQuery, config);

var RequestDetailModule = RequestDetailModule || (function (window, $, config) {

    RequestModule.initValidation()

    function init() {
        setDatePicker("#fromDate", null, moment($("#fromDate").val(), 'DD/MM/YYYY').toDate())
        setDatePicker("#toDate", null, moment($("#fromDate").val(), 'DD/MM/YYYY').toDate())
        setTimePicker("#fromHours")
        setTimePicker("#toHours")
       
        RequestModule.initDateTimeEvent()

        $('#btnUpdate').on('click', function () {
            debugger
            if ($('#formSubmitRequest').valid()) {
                if (RequestModule.isWeekend()) {
                    RequestModule.showConfirm()
                }
                else {
                    updateRequest()
                }
            }
        });
    }

    function updateRequest() {
        showLoadingOverlay()
        let model = RequestModule.getSubmitData()
        model.RequestId = $('#RequestId').val()

        $.ajax({
            type: "POST",
            url: config.UPDATE_REQUEST_LEAVE,
            data: {
                model: model
            },
            success: function (response) {
                if (response.responseCode == 1) {
                    showSuccess(response.responseMessage)
                    setTimeout(function () { window.location.href = config.GET_OLD_REQUEST }, 3000)
                }
                else {
                    showWarning(response.responseMessage)
                }
            },
            complete: function () {
                hideLoadingOverlay()
            }
        });
    }

    return {
        init: init
    };

})(window, jQuery, config);


