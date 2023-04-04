var GoodReceiptModule = GoodReceiptModule || (function (window, $, config) {
    var contentDataList = "#GetGoodReceipt";
    var delayTimer;
    var bquyen = false;

    function init() {
        bload = false;
        setDatePicker("#toDate", null, null, null);
        const TNgay = new Date();
        TNgay.setFullYear(TNgay.getFullYear() - 1);
        setDatePicker("#fromDate", TNgay, null, null);

        $(document).on("dp.change", '#toDate', function () {
            GetGoodReceipt(1);
        })
        $(document).on("dp.change", '#fromDate', function () {
            GetGoodReceipt(1);
        })
        $('#search').on('keyup', function () {
            clearTimeout(delayTimer)
            delayTimer = setTimeout(function () {
                GetGoodReceipt(1)
            }, 1000)
        })

        $('#search').on('change', function () {
            clearTimeout(delayTimer)
            delayTimer = setTimeout(function () {
                GetGoodReceipt(1)
            }, 1000)
        })


        $(document).on("click", '#btnAddGoodReceipt', function () {
            window.location.href = "/GoodReceipt/AddGoodReceipt?mspn=-1&mskho=" + $('#cbokho').val() + "";
        });

        $(document).on('mouseover', '#tbGoodReceipt tbody tr', function () {
            let tr = $(this);
            $('#tbGoodReceipt tbody').find('tr.row-selected').each(function () {
                //if (!$(this).is(tr)) {
                $(this).removeClass("row-selected")
                //}
            })

            tr.addClass("row-selected")
        })
        $(document).on('mouseout', '#tbGoodReceipt tbody tr', function () {
            $(this).removeClass("row-selected")
        })
        $(document).on('touchstart', '#tbGoodReceipt tbody tr', function () {
            let tr = $(this);
            $('#tbGoodReceipt tbody').find('tr.row-selected').each(function () {
                //if (!$(this).is(tr)) {
                $(this).removeClass("row-selected")
                //}
            })

            tr.addClass("row-selected")
        })
        $(document).on('touchend', '#tbGoodReceipt tbody tr', function () {
            $(this).removeClass("row-selected")
        })

        $('#cbokho').on('change', function () {
            GetGoodReceipt(1);
        });
        GetGoodReceipt(1);
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
            $("#CboDangNhap").prop("disabled", true);
            $('span [role=combobox]').css('background-color', '#FFFFFF');
        }

        switch (parseInt($('#CboDangNhap').val())) {
            case 2: {
                //nhập khác
                $('#CboDDH').parent('.form-floating').addClass('d-none');
                break;
            }
            case 3: {
                //nhập đề xuất
                $('#CboDDH').parent('.form-floating').removeClass('d-none');
                break;
            }
            case 6: {
                //nhập trả
                $('#CboDDH').parent('.form-floating').removeClass('d-none');
                break;
            }
        }


        $('#CboDangNhap').on('change', function () {
            console.log($('#CboDangNhap').val());
            switch (parseInt($('#CboDangNhap').val())) {
                case 2: {
                    //nhập khác
                    LoadNguoiNhap(-1, 4);
                    $('#CboDDH').parent('.form-floating').addClass('d-none');
                    break;
                }
                case 3: {
                    //nhập đề xuất
                    LoadDonHang(0, 1);
                    LoadNguoiNhap(-1, 4);
                    $('#CboDDH').parent('.form-floating').removeClass('d-none');
                    break;
                }
                case 6: {
                    //nhập trả
                    LoadDonHang(0, 0);
                    LoadNguoiNhap(0, 4);
                    $('#CboDDH').parent('.form-floating').removeClass('d-none');
                    break;
                }
            }
        })
        LoadDanhSachPhuTung();


        //chọn phụ tùng
        $(document).on("click", '#btnAddPhuTung', function () {
            $.ajax({
                type: "GET",
                url: config.CHON_DS_PHUTUNG,
                success: function (response) {
                    $('#modalLarge .modal-content').html(response);
                    $('#modalLarge').modal('show');
                    PoupLoadDanhSachPhuTung()
                }
            });
        });

        $(document).on("keyup", '#search', function () {
            showLoadingOverlay('#resultContent');
            var keyword = $(this).val().toLowerCase();
            $('.tblAddSuppliesSeleced tbody tr').filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(keyword) > -1);
            });
            hideLoadingOverlay('#resultContent');
        })

        //chọn chi phí
        $(document).on("click", '#btnAddChiPhi', function () {
            $.ajax({
                type: "GET",
                url: config.LOAD_CHI_PHI,
                data: {
                    mspn: $('#MS_DH_NHAP_PT').val(),
                },
                success: function (response) {
                    $('#modalLarge .modal-content').html(response);
                    $('#modalLarge').modal('show');
                }
            });
        });

        $(document).on("click", '.PhuTungDetail', function () {
            let mspt = $(this).data('mspt');
            $.ajax({
                type: "POST",
                url: config.LOAD_PHU_TUNG_DETAIL,
                data: {
                    mspn: $('#MS_DH_NHAP_PT').val(),
                    mspt: mspt
                },
                success: function (response) {
                    $('#modalLarge .modal-content').html(response);
                    $('#modalLarge').modal('show');
                    addclassdisabled();
                }
            });

        });

        $(document).on("click", '.vitri', function () {
            let mspt = $(this).data('mspt');
            $.ajax({
                type: "POST",
                url: config.LOAD_VI_TRI,
                data: {
                    mspn: $('#MS_DH_NHAP_PT').val(),
                    mspt: mspt
                },
                success: function (response) {
                    $('#modalLarge .modal-content').html(response);
                    $('#modalLarge').modal('show');
                    addclassdisabled();
                }
            });

        });


    }


    function addclassdisabled() {
        if (bquyen === false) {
            $('.btn.btn-primary.w-50').addClass('disabled');
        }
    }

    function GetGoodReceipt(pageIndex) {
        var currenpage = pageIndex || 1;
        showLoadingOverlay(contentDataList);
        $.ajax({
            type: "GET",
            url: config.GET_GOODRECEIPT,
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
        showLoadingOverlay('#GetDSPhuTungNhap');
        $.ajax({
            type: "GET",
            url: config.GET_DS_PHUTUNG,
            data: {
                mspn: $('#MS_DH_NHAP_PT').val(),
                khoa: $('#LOCK').val(),
            },
            success: function (response) {
                $('#GetDSPhuTungNhap').html(response);
            },
            complete: function () {
                hideLoadingOverlay('#GetDSPhuTungNhap');
            }
        });
    }

    function PoupLoadDanhSachPhuTung() {
        showLoadingOverlay("#resultContent");
        $.ajax({
            type: "GET",
            url: config.LOAD_DS_PHUTUNG,
            data: {
                keyword: $('#search').val(),
                mspn: $('#MS_DH_NHAP_PT').val(),
            },
            success: function (response) {
                $("#resultContent").html(response);
            },
            complete: function () {
                hideLoadingOverlay("#resultContent");
            }
        });
    }


    function LoadDonHang(all, dx) {
        $('#CboDDH option').remove();
        $.ajax({
            type: "POST",
            url: config.GET_DONHANG,
            data: { coall: all, dexuat: dx },
            success: function (data) {
                $('#CboDDH').html('');
                var s = '';
                for (var i = 0; i < data.length; i++) {
                    s += '<option value="' + data[i].value + '">' + data[i].text + '</option>';
                }
                $("#CboDDH").html(s);
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
                GetGoodReceipt(page)
            });
        }
    }


    return {
        init: init,
        Addinit: Addinit
    };

})(window, jQuery, config);

