var MyEcomaintModule = MyEcomaintModule || (function (window, $, config) {
    var contentDataList = "#GetMyEcomain";
    var delayTimer;
    var bload = false;

    function init() {
        bload = false;

        //setDatePicker("#toDate", null, moment($("#toDate").val(), 'DD/MM/YYYY').toDate())
        //$('#cboDiaDiem').val('-1').change();
        $('#cboLMay').val('-1').change();
        $('#search').on('keyup', function () {
            clearTimeout(delayTimer)
            delayTimer = setTimeout(function () {
                GetMyEcomaint(1)
            }, 1000)
        })
        $('#search').on('change', function () {
            clearTimeout(delayTimer)
            delayTimer = setTimeout(function () {
                GetMyEcomaint(1)
            }, 1000)
        })
        $('#cboDiaDiem').on('change', function () {
            GetMyEcomaint(1);
        })
        $('#chkxuly').on('change', function () {
            GetMyEcomaint(1);
        })
        $('#chkNV').on('change', function () {
            GetMyEcomaint(1);
        })
        $('#cboLMay').on('change', function () {
            GetMyEcomaint(1);
        })

        $(document).on("dp.change", '#toDate', function () {
            GetMyEcomaint(1)
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
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        console.log(futureDate);

        // Truyền futureDate vào hàm setDatePicker()
        setDatePicker("#toDate", futureDate, null, null);
        $(document).on('touchend', '#tbGetMyEcomain tbody tr', function () {
            $(this).removeClass("row-selected")
        })
        bload = true;
        GetMyEcomaint(1)

    }

    function GetMyEcomaint(pageIndex) {
        if (bload == false) return;
        showLoadingOverlay("#GetMyEcomain");
        var currenpage = pageIndex || 1;
        $.ajax({
            type: "GET",
            url: config.GET_MYECOMAIN_LIST,
            data: {
                keyword: $('#search').val(),
                pageIndex: pageIndex ?? 1,
                pageSize: config.PAGE_SIZE,
                msnx: $('#cboDiaDiem').val(),
                mslmay: $('#cboLMay').val(),
                denngay: $('#toDate').val(),
                xuly: $('#chkxuly').is(":checked"),
                locNV: $('#chkNV').is(":checked"),
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

    function showthongbao() {
        ShowThongBao('Máy này chưa có thông số giám sát!', 'warning', '');
    }
    function LoadMay() {
        $('#cboMay option').remove();
        $.ajax({
            type: "POST",
            url: config.GET_MAY,
            data: { WorkSiteID: $('#cboDiaDiem').val(), coall : 1 },
            success: function (data) {
                $('#cboMay').html('');
                var s = '';
                for (var i = 0; i < data.length; i++) {
                    s += '<option value="' + data[i].value + '">' + data[i].text + '</option>';
                }
                $("#cboMay").html(s);
                GetMyEcomaint(1);
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
                GetMyEcomaint(page)
            });
        }
    }

    return {
        init: init,
        showthongbao: showthongbao
    };

})(window, jQuery, config);

