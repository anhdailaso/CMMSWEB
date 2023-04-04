var GoodIssueModule = GoodIssueModule || (function (window, $, config) {
    var contentDataList = "#GetGoodIssue";
    var delayTimer;
    var bquyen = false;

    function init() {
        bload = false;
        setDatePicker("#toDate", null, null, null);
        const TNgay = new Date();
        TNgay.setFullYear(TNgay.getFullYear() - 1);
        setDatePicker("#fromDate", TNgay, null, null);

        $(document).on("dp.change", '#toDate', function () {
            GetGoodIssue(1);
        })
        $(document).on("dp.change", '#fromDate', function () {
            GetGoodIssue(1);
        })
        $('#search').on('keyup', function () {
            clearTimeout(delayTimer)
            delayTimer = setTimeout(function () {
                GetGoodIssue(1);
            }, 1000)
        })

        $('#search').on('change', function () {
            clearTimeout(delayTimer)
            delayTimer = setTimeout(function () {
                GetGoodIssue(1);
            }, 1000)
        })


        $(document).on("click", '#btnAddGoodIssue', function () {
            window.location.href = "/GoodIssue/AddGoodIssue?mspx=-1&mskho=" + $('#cbokho').val() + "";
        });

        $(document).on('mouseover', '#tbGoodIssue tbody tr', function () {
            let tr = $(this);
            $('#tbGoodIssue tbody').find('tr.row-selected').each(function () {
                //if (!$(this).is(tr)) {
                $(this).removeClass("row-selected")
                //}
            })

            tr.addClass("row-selected")
        })
        $(document).on('mouseout', '#tbGoodIssue tbody tr', function () {
            $(this).removeClass("row-selected")
        })
        $(document).on('touchstart', '#tbGoodIssue tbody tr', function () {
            let tr = $(this);
            $('#tbGoodIssue tbody').find('tr.row-selected').each(function () {
                //if (!$(this).is(tr)) {
                $(this).removeClass("row-selected")
                //}
            })

            tr.addClass("row-selected")
        })
        $(document).on('touchend', '#tbGoodIssue tbody tr', function () {
            $(this).removeClass("row-selected")
        })

        $('#cbokho').on('change', function () {
            GetGoodIssue(1);
        });
        GetGoodIssue(1);
    }

    function Addinit() {

        setDatePicker("#NGAY_CHUNG_TU", null, null, null);

        if ($('#QUYEN').val() == 'False') {
            bquyen = false;
        }
        else {
            bquyen = true;
        }
        //nếu thêm = 0
        if ($('#THEM').val() == 'False') {
            $("#CboDangXuat").prop("disabled", true);
            $('span [role=combobox]').css('background-color', '#FFFFFF');
            switch (parseInt($('#CboDangXuat').val())) {
                case 1: {
                    //xuất cho bảo trì
                    $('#CboPBT').closest('.justify-content-between').removeClass('d-none');
                    $('#CboBPCP').parent('.form-floating').addClass('d-none');
                    $.ajax({
                        type: "POST",
                        url: config.GET_MAY_PBT,
                        data: { mspbt: $('#CboPBT').val() },
                        success: function (data) {
                            $('#txtMay').text(data);
                        }
                    });
                    break;
                }
                case 2: {
                    //trả nhà cung cấp
                    $('#CboPBT').closest('.justify-content-between').addClass('d-none');
                    $('#CboBPCP').parent('.form-floating').addClass('d-none');
                    break;
                }
                case 3: {
                    //khác
                    //LoadDonHang(0, 0);
                    $('#CboPBT').closest('.justify-content-between').addClass('d-none');
                    $('#CboBPCP').parent('.form-floating').addClass('d-none');
                    break;
                }
                case 4: {
                    //bộ phận chiệu phí
                    $('#CboPBT').closest('.justify-content-between').addClass('d-none');
                    $('#CboBPCP').parent('.form-floating').removeClass('d-none');
                    break;
                }
            }
        }

        $(document).on("keyup", '#search', function () {
            showLoadingOverlay('#resultContent');
            var keyword = $(this).val().toLowerCase();
            $('.tblAddSuppliesSeleced tbody tr').filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(keyword) > -1);
            });
            hideLoadingOverlay('#resultContent');
        })


        if (parseInt($('#CboDangXuat').val()) == 2) {
            $('#CboDDH').parent('.form-floating').addClass('d-none');
        }

        $(document).on('change', '#chkBT', function () {
                alert(1);
                if ($(this).is(":checked")) {
                    PoupLoadDanhSachPhuTung(true);
                }
                else {
                    PoupLoadDanhSachPhuTung(false);
                }
            });

        $('#CboDangXuat').on('change', function () {
            switch (parseInt($('#CboDangXuat').val())) {
                case 1: {
                    //xuất cho bảo trì
                    LoadNguoiNhap(0, 5);
                    LoadPBT();
                    $('#CboPBT').closest('.justify-content-between').removeClass('d-none');
                    $('#CboBPCP').parent('.form-floating').addClass('d-none');
                    break;
                }
                case 2: {
                    //trả nhà cung cấp
                    LoadNguoiNhap(1, 5);
                    $('#CboPBT').closest('.justify-content-between').addClass('d-none');
                    $('#CboBPCP').parent('.form-floating').addClass('d-none');
                    break;
                }
                case 3: {
                    //khác
                    //LoadDonHang(0, 0);
                    LoadNguoiNhap(-1, 5);

                    $('#CboPBT').closest('.justify-content-between').addClass('d-none');
                    $('#CboBPCP').parent('.form-floating').addClass('d-none');
                    break;
                }
                case 4: {
                    //bộ phận chiệu phí
                    LoadNguoiNhap(0, 5);
                    LoadBPCP();
                    $('#CboPBT').closest('.justify-content-between').addClass('d-none');
                    $('#CboBPCP').parent('.form-floating').removeClass('d-none');
                    break;
                }
            }
        })
        LoadDanhSachPhuTung();

        $('#CboPBT').on('change', function () {
            $.ajax({
                type: "POST",
                url: config.GET_MAY_PBT,
                data: { mspbt: $('#CboPBT').val() },
                success: function (data) {
                    $('#txtMay').text(data);

                }
            });

        })


        //chọn phụ tùng
        $(document).on("click", '#btnAddPhuTung', function () {
            $.ajax({
                type: "GET",
                url: config.CHON_DS_PHUTUNG,
                data: { dangxuat: $('#CboDangXuat').val() },
                success: function (response) {
                    $('#modalLarge .modal-content').html(response);
                    $('#modalLarge').modal('show');
                    var checkBPT = false;
                    try {
                        checkBPT = $('#chkBT').is(":checked");

                    } catch (e) {
                        checkBPT = false;

                    }
                    PoupLoadDanhSachPhuTung(checkBPT)
                }
            });
        });
    }


    function addclassdisabled() {
        if (bquyen === false) {
            $('.btn.btn-primary.w-50').addClass('disabled');
        }
    }

    function GetGoodIssue(pageIndex) {
        var currenpage = pageIndex || 1;
        showLoadingOverlay(contentDataList);
        $.ajax({
            type: "GET",
            url: config.GET_GOODISSUE,
            data: {
                keyword: $('#search').val(),
                pageIndex: pageIndex ?? 1,
                pageSize: config.PAGE_SIZE,
                mskho: $('#cbokho').val(),
                tungay: $('#fromDate').val(),
                denngay: $('#toDate').val(),
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

    function LoadDanhSachPhuTung() {
        showLoadingOverlay('#GetDSPhuTungXuat');
        $.ajax({
            type: "GET",
            url: config.GET_DS_PHUTUNG,
            data: {
                mspx: $('#MS_DH_XUAT_PT').val()
            },
            success: function (response) {
                $('#GetDSPhuTungXuat').html(response);
            },
            complete: function () {
                hideLoadingOverlay('#GetDSPhuTungXuat');
            }
        });
    }

    function PoupLoadDanhSachPhuTung(chkBT) {
        showLoadingOverlay("#resultContent");
        $.ajax({
            type: "GET",
            url: config.LOAD_DS_PHUTUNG,
            data: {
                theoBT: chkBT,
                mspx: $('#MS_DH_XUAT_PT').val(),
            },
            success: function (response) {
                $("#resultContent").html(response);
            },
            complete: function () {
                hideLoadingOverlay("#resultContent");
            }
        });
    }


    function LoadPBT() {
        $('#CboPBT option').remove();
        $.ajax({
            type: "POST",
            url: config.GET_PHIEUBAOTRI,
            success: function (data) {
                $('#CboPBT').html('');
                var s = '';
                for (var i = 0; i < data.length; i++) {
                    s += '<option value="' + data[i].value + '">' + data[i].text + '</option>';
                }
                $("#CboPBT").html(s);
            }
        });
    }

    function LoadBPCP() {
        $('#LoadBPCP option').remove();
        $.ajax({
            type: "POST",
            url: config.GET_BOPHANCHIEUPHI,
            success: function (data) {
                $('#CboBPCP').html('');
                var s = '';
                for (var i = 0; i < data.length; i++) {
                    s += '<option value="' + data[i].value + '">' + data[i].text + '</option>';
                }
                $("#CboBPCP").html(s);
            }
        });
    }


    function LoadNguoiNhap(kh, vt) {
        $('#cboNguoiNhap option').remove();
        $.ajax({
            type: "POST",
            url: config.GET_NGUOINHAP,
            data: { khachhang: kh, vaitro: vt },
            success: function (data) {
                $('#cboNguoiNhap').html('');
                var s = '';
                for (var i = 0; i < data.length; i++) {
                    s += '<option value="' + data[i].value + '">' + data[i].text + '</option>';
                }
                $("#cboNguoiNhap").html(s);
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
        init: init,
        Addinit: Addinit
    };

})(window, jQuery, config);

