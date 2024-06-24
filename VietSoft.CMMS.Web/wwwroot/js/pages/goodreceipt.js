var GoodReceiptModule = GoodReceiptModule || (function (window, $, config) {
    var contentDataList = "#GetGoodReceipt";
    var delayTimer;
    var bquyen = false;
    var tableCHonPT;


    function init() {
        bload = false;
        setDatePicker("#toDate", null, null, null);
        const TNgay = new Date();
        TNgay.setMonth(TNgay.getMonth() - 2);
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

        $(document).on('click', '.btnDeletePhieuNhapKho', function () {
            let msbn = $(this).data('mspn');
            ShowConfirm(config.MESS_XOA_NHAP_KHO, 'warning', '', function (result) {
                if (result == true) {
                    $.ajax({
                        type: "POST",
                        url: config.DELETE_PHIEUNHAPKHO,
                        data: { mspn: msbn },
                        success: function (response) {
                            if (response.responseCode == 1) {
                                showSuccess(response.responseMessage)
                                GetGoodReceipt(1);
                            }
                            else {
                                showWarning(response.responseMessage)
                            }
                        },
                        complete: function () {
                        }
                    });

                }
            });
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

        setDatePicker("#NGAY_CHUNG_TU", new Date(), null, null);
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
            case 1:
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




        $(document).on("click", '#btnSavePhieuNhapKho', function () {

            switch (parseInt($('#CboDangNhap').val())) {
                case 1:
                case 2: {
                    //nhap khac
                    $("#CboDDH").rules("remove");
                    break;
                }
                case 3: {
                    //nhap de xuat
                    $("#CboDDH").rules("add", {
                        notEqualTo: '-1'
                    });
                    break;
                }
                case 6: {
                    //nhap tra phieu bao tri
                    $("#CboDDH").rules("add", {
                        notEqualTo: '-1'
                    });
                    break;
                }
            }
            if ($('#myFormNhap').valid()) {
                $.ajax({
                    type: "POST",
                    url: config.SAVE_PHIEU_NHAP_KHO,
                    data: $('#myFormNhap').serialize(),
                    success: function (response) {
                        if (response.responseCode == 1) {
                            showSuccess(response.responseMessage)
                            setTimeout(function () {
                                window.location.href = "/GoodReceipt/EditGoodReceipt?mspn=" + $('#MS_DH_NHAP_PT').val() + "";
                            }, 600)
                        }
                        else {
                            showWarning(response.responseMessage)
                        }
                    },
                    complete: function () {
                    }
                });
            }
        });


        $(document).on("click", '#btnLock', function () {
            ShowConfirm(config.MESS_KHOA_PHIEU_NHAP, 'warning', '', function (result) {
                if (result == true) {
                    $.ajax({
                        type: "POST",
                        url: config.LOCK_PHIEUNHAP,
                        data: { mspn: $('#MS_DH_NHAP_PT').val() },
                        success: function (response) {
                            if (response.responseCode == 1) {
                                window.location.href = "/GoodReceipt/EditGoodReceipt?mspn=" + $('#MS_DH_NHAP_PT').val() + "";
                                showSuccess(response.responseMessage);
                            }
                            else {
                                showWarning(response.responseMessage)
                            }
                        }
                    });

                }
            });
        })


        $(document).on("click", '#btnSuaThongTinPhuTung', function () {
            $.ajax({
                type: "POST",
                url: config.SAVE_THONG_TIN_PHUTUNG,
                data: $('#myFormNhapMore').serialize(),
                success: function (response) {
                    if (response.responseCode == 1) {
                        showSuccess(response.responseMessage);
                        $('#modalLarge').modal('hide');
                    }
                    else {
                        showWarning(response.responseMessage)
                    }
                },
                complete: function () {
                }
            });
        });


        $(document).on("click", '#btnSavePhuTung', function () {
            var lstParameter = new Array();
            var cur_length = 0;
            let rowdata = $('#GetDSPhuTungNhap').find('table.tbPhuTungNhap tbody tr')
            console.log(rowdata);
            $(rowdata).each(function (i, obj) {
                lstParameter[cur_length] = new Object();
                lstParameter[cur_length].MS_PT = $(this).find("td").eq(0).find('a').data('mspt');
                lstParameter[cur_length].SO_LUONG = $(this).find("td").eq(1).find('input').val();
                lstParameter[cur_length].DON_GIA = $(this).find("td").eq(2).find('input').val().replace(/,/g, "");
                lstParameter[cur_length].VAT = $(this).find("td").eq(3).find('input').val();
                lstParameter[cur_length].NGOAI_TE = $(this).find("td").eq(4).find('select').val();
                cur_length = cur_length + 1;
            });
            $.ajax({
                type: "POST",
                url: config.SAVE_PHUTUNG_NHAP_KHO,
                data: { jsonData: JSON.stringify(lstParameter), mspn: $('#MS_DH_NHAP_PT').val() },
                success: function (response) {
                    if (response.responseCode == 1) {
                        LoadDanhSachPhuTung();
                        showSuccess(response.responseMessage)
                    }
                    else {
                        showWarning(response.responseMessage)
                    }
                }
            });
        })


        $(document).on("click", '#btnAddPhuTungNhap', function () {
            var lstParameter = new Array();
            var cur_length = 0;
            let rowdata = $(this).closest('.modal-content').find('.modal-body table tbody tr.tr-supplies')

            $(rowdata).find('input:checkbox:checked').each(function (i, obj) {
                lstParameter[cur_length] = new Object();
                lstParameter[cur_length].MS_PT = $(this).closest('tr').find("td").eq(0).text();
                cur_length = cur_length + 1;
            });
            $.ajax({
                type: "POST",
                url: config.ADD_PHUTUNGNHAPKHO,
                data: { jsonData: JSON.stringify(lstParameter), mspn: $('#MS_DH_NHAP_PT').val() },
                success: function (response) {
                    if (response.responseCode == 1) {
                        LoadDanhSachPhuTung();
                        $('#modalLarge').modal('hide');
                    }
                    else {
                        showWarning(response.responseMessage)
                    }
                }
            });


            $('#modalLarge').modal('hide');
        })



        $(document).on("click", '#btnInBarcode', function () {
            var lstParameter = new Array();
            var cur_length = 0;
            let rowdata = $('#GetDSPhuTungNhap').find('table.tbPhuTungNhap tbody tr')
            console.log(rowdata);
            $(rowdata).each(function (i, obj) {
                lstParameter[cur_length] = new Object();
                lstParameter[cur_length].MS_PT = $(this).find("td").eq(0).find('a').data('mspt');
                cur_length = cur_length + 1;
            });
            $.ajax({
                type: "GET",
                url: config.IN_BARCODE,
                data: { jsonData: JSON.stringify(lstParameter), mspn: $('#MS_DH_NHAP_PT').val() },
            }).done(function (response) {
                $('#barcodenone').removeClass('d-none');
                  
                $('#table-to-print').html(response);
            }).then(function () {
                let focuser = setInterval(() => window.dispatchEvent(new Event('focus')), 500);
                printJS({
                    printable:'table-to-print',
                    type: 'html',
                    ignoreElements: ['.d-none', '#barcodenone'],
                        // do your thing..
                    onPrintDialogClose: () => {
                        clearInterval(focuser);
                        $('#barcodenone').addClass('d-none');
                    },

                    onError: () => {
                        clearInterval(focuser);
                    }
                });
            });


        })



        $(document).on("click", '#btnSaveViTri', function () {
            var lstParameter = new Array();
            var cur_length = 0;
            let rowdata = $(this).closest('.modal-content').find('.modal-body table tbody tr')
            $(rowdata).find('input').each(function (i, obj) {
                lstParameter[cur_length] = new Object();
                lstParameter[cur_length].MS_VI_TRI = $(this).closest('tr').find("td").eq(0).data('id');
                lstParameter[cur_length].SO_LUONG = $(this).val();
                cur_length = cur_length + 1;
            });
            $.ajax({
                type: "POST",
                url: config.SAVE_VI_TRI,
                data: { jsonData: JSON.stringify(lstParameter), mspn: $('#MS_DH_NHAP_PT').val(), mspt: $('#MS_PTVT').val() },
                success: function (response) {
                    if (response.responseCode == 1) {
                        showSuccess(response.responseMessage);
                        LoadDanhSachPhuTung();
                        $('#modalLarge').modal('hide');
                    }
                    else {
                        showWarning(response.responseMessage)
                    }
                }
            });


            $('#modalLarge').modal('hide');
        })


        $(document).on("click", '#btnSaveChiPhi', function () {
            var lstParameter = new Array();
            var cur_length = 0;
            let rowdata = $(this).closest('.modal-content').find('.modal-body table tbody tr')
            $(rowdata).each(function (i, obj) {
                lstParameter[cur_length] = new Object();
                lstParameter[cur_length].MS_CHI_PHI  = $(this).find("td").eq(0).data('id');
                lstParameter[cur_length].DANG_PB = $(this).find("td").eq(1).find('select').val();
                lstParameter[cur_length].CHI_PHI = $(this).find("td").eq(2).find('input').val().replace(/,/g, "");
                lstParameter[cur_length].GHI_CHU = $(this).find("td").eq(3).find('input').val();
                cur_length = cur_length + 1;
            });
            $.ajax({
                type: "POST",
                url: config.SAVE_CHI_PHI,
                data: { jsonData: JSON.stringify(lstParameter), mspn: $('#MS_DH_NHAP_PT').val() },
                success: function (response) {
                    if (response.responseCode == 1) {
                        showSuccess(response.responseMessage);
                        LoadDanhSachPhuTung();
                        $('#modalLarge').modal('hide');
                    }
                    else {
                        showWarning(response.responseMessage)
                    }
                }
            });


            $('#modalLarge').modal('hide');
        })



        $(document).on('click', '.btnDeleteVatTuNhapKho', function () {
            let mspt = $(this).data('mspt');
            let mspn = $(this).data('mspn');

            ShowConfirm(config.MESS_XOA_PHU_TUNG_NHAP, 'warning', '', function (result) {
                if (result == true) {
                    $.ajax({
                        type: "POST",
                        url: config.DELETE_PHUTUNGNHAPKHO,
                        data: {
                            mspt: mspt,
                            mspn: $('#MS_DH_NHAP_PT').val()
                        },
                        success: function (response) {
                            if (response.responseCode == 1) {
                                showSuccess(response.responseMessage)
                                LoadDanhSachPhuTung();
                            }
                            else {
                                showWarning(response.responseMessage)
                            }
                        },
                        complete: function () {
                        }
                    });

                }
            });
        });


        $('#CboDangNhap').on('change', function () {
            showLoadingOverlay('#GetDSPhuTungNhap');
            switch (parseInt($('#CboDangNhap').val())) {
                case 1:
                case 2:
                    {
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
            hideLoadingOverlay('#GetDSPhuTungNhap');
        })
        LoadDanhSachPhuTung();


        //chọn phụ tùng
        $(document).on("click", '#btnAddPhuTung', function () {
            $.ajax({
                type: "GET",
                url: config.CHON_DS_PHUTUNG,
                data: {
                    mspn: $('#MS_DH_NHAP_PT').val(),
                },
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
            $('.tblchonphutung tbody tr').filter(function () {
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
                    quyen: $('#QUYEN').val(),
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
            let xoa = $(this).data('xoa');
            $.ajax({
                type: "POST",
                url: config.LOAD_VI_TRI,
                data: {
                    mspn: $('#MS_DH_NHAP_PT').val(),
                    mspt: mspt,
                    xoa: xoa,
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
                mspn: $('#MS_DH_NHAP_PT').val(),
            },
            success: function (response) {
                $("#resultContent").html(response);
            },
            complete: function () {
                hideLoadingOverlay("#resultContent");
                //tableCHonPT = $('.tblchonphutung').DataTable({
                //    "ordering": false,
                //    "bFilter": false,
                //    "bInfo": false,
                //    "lengthChange": false, // ẩn lựa chọn số dòng trên trang
                //    "columns": [
                //        { "title": "" },
                //        { "title": "" },
                //        { "title": "" }
                //    ]
                //});
                //$(document).on("keyup", '#search', function () {
                //    showLoadingOverlay('#resultContent');
                //    /*var keyword = $(this).val().toLowerCase();*/
                //    console.log($(this).val());
                //    tableCHonPT.search($(this).val()).draw();
                //    hideLoadingOverlay('#resultContent');
                //})

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
        },1000);
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
        },1000);
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

