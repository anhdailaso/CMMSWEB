var ApprovalModule = ApprovalModule || (function (window, $, config) {

    function init() {
        setMonthYearPicker("#months")
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
        })

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

    function LoadDataWithTabActive(page){
        let tab = $('.nav-tabs li a.active');
        if ($(tab).attr('id') == 'tab-pending-request') {
            GetRequestList(page, config.TAB_PENDING)
        }
        else {
            GetRequestList(page, config.TAB_ALL)
        }
    }
    function ConfirmAprroval() {
        $(document).on('click', '.approval-request-content', function () {
            let requestStatus = $(this).data('status')
            let requestId = $(this).data('request-id')
            ApprovalRequest(requestStatus, requestId)
        })

        $(document).on('change', `input[name='approvalAction']`, function () {
            $('#btnSave').removeClass('disabled');
        });

        $(document).on('click', '#btnSave', function () {
            showLoadingOverlay();
            let model = {
                RequestId: $('#RequestId').val(),
                Note: $('#Note').val(),
                RequestStatus: $('input[name=approvalAction]:checked').val()
            }
            $.ajax({
                type: "POST",
                url: config.SAVE_APPROVAL,
                data: {
                    model: model
                },
                success: function (response) {
                    if (response.responseCode == 1) {
                        GetRequestList(1, config.TAB_PENDING)
                        showSuccess(response.responseMessage)
                    }
                    else {
                        showWarning(response.responseMessage)
                    }
                },
                complete: function () {
                    hideLoadingOverlay();
                    $('#modal').modal('hide');
                }
            });
        });
    }
    function ApprovalRequest(requestStatus, requestId) {
        let statusPending = config.STATUS_PENDING;
        if (requestStatus == statusPending) {
            $.ajax({
                type: "GET",
                data: {
                    requestId: requestId
                },
                url: config.SHOW_CONFRIM_APPROVAL,
                success: function (response) {
                    $('#modal .modal-content').html(response);
                    $('#modal').modal('show');
                }
            });
        }
        else return;
    }
    function GetRequestList(pageIndex, status) {
        showLoadingOverlay("#request-list");
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

    return {
        init: init,
        confirmApproval: ConfirmAprroval
    };

})(window, jQuery, config);

