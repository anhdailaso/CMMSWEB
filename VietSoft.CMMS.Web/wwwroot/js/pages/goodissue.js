var GoodIssueModule = GoodIssueModule || (function (window, $, config) {
    var contentDataList = "#GetGoodIssue";
    var delayTimer;
    var bquyen = false;

    $("#myFormXuat").validate({
        ignore: '',
        rules: {
            "MS_DANG_XUAT": {
                notEqualTo: '-1'
            },

            "MS_PHIEU_BAO_TRI": {
                notEqualTo: '-1'
            },
            "MS_BP_CHIU_PHI": {
                notEqualTo: '-1'
            },
            "NGUOI_NHAN": {
                notEqualTo: '-1'
            },
        },
        messages: {
            "MS_DANG_XUAT": {
                notEqualTo: "Không được để trống."
            },
            "MS_PHIEU_BAO_TRI": {
                notEqualTo: "Không được để trống."
            },
            "MS_BP_CHIU_PHI": {
                notEqualTo: "Không được để trống."
            },
            "NGUOI_NHAN": {
                notEqualTo: "Không được để trống."
            },
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
    $.validator.addMethod("notEqualTo", function (value, element, param) {
        return this.optional(element) || value !== param;
    }, "Please enter a different value");
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

        $(document).on('click', '.btnDeletePhieuXuatKho', function () {
            let msbx = $(this).data('mspx');
            ShowConfirm(config.MESS_XOA_PHIEU_XUAT, 'warning', '', function (result) {
                if (result == true) {
                    $.ajax({
                        type: "POST",
                        url: config.DELETE_PHIEUXUATKHO,
                        data: { mspx: msbx },
                        success: function (response) {
                            if (response.responseCode == 1) {
                                showSuccess(response.responseMessage)
                                GetGoodIssue(1);
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


        $(document).on("blur", '.SoLuong', function () {
            var maxvalue = parseFloat($(this).attr("max"));
            if (maxvalue > 0) {
                if (parseFloat($(this).val()) > maxvalue) {
                    $(this).val(maxvalue);
                    $(this).focus();
                    return false;
                }
            }

        })

     
        $('#ScanPhuTungCode').on('change', function () {
            let ma = $(this).val();
            $(this).val('');
            $.ajax({
                type: "POST",
                url: config.SCAN_PHU_TUNG_XUAT,
                data: {
                    macode: ma,
                    mspx: $('#MS_DH_XUAT_PT').val(),
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

        })


        $(document).on('click', '.btnDeleteVatTuXuatKho', function () {
            let mspt = $(this).data('mspt');
            let mspn = $(this).data('mspn');

            ShowConfirm(config.MESS_XOA_PHU_TUNG_XUAT, 'warning', '', function (result) {
                if (result == true) {
                    $.ajax({
                        type: "POST",
                        url: config.DELETE_PHUTUNGXUATKHO,
                        data: {
                            mspt: mspt,
                            mspn: mspn,
                            mspx: $('#MS_DH_XUAT_PT').val()
                        },
                        success: function (response) {
                            if (response.responseCode == 1) {
                                showSuccess(response.responseMessage)
                                LoadDanhSachPhuTung();
                            }
                            else {
                                showWarning(response.NAME)
                            }
                        },
                        complete: function () {
                        }
                    });

                }
            });
        });

        $(document).on("click", '#btnAddPhuThungXuat', function () {
            var lstParameter = new Array();
            var cur_length = 0;
            let rowdata = $(this).closest('.modal-content').find('.modal-body table tbody tr.tr-supplies')

            $(rowdata).find('input:checkbox:checked').each(function (i, obj) {
                lstParameter[cur_length] = new Object();
                lstParameter[cur_length].MS_PT = $(this).closest('tr').find("td").eq(0).text();
                lstParameter[cur_length].MS_DH_NHAP_PT = $(this).closest('tr').find("td").eq(1).text();
                lstParameter[cur_length].MS_VI_TRI = $(this).data('msvt');
                lstParameter[cur_length].SL_XUAT = $(this).closest('tr').find(".SoLuong").val();
                cur_length = cur_length + 1;
            });
            $.ajax({
                type: "POST",
                url: config.ADD_PHUTUNGXUATKHO,
                data: { jsonData: JSON.stringify(lstParameter), mspx: $('#MS_DH_XUAT_PT').val() },
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
        $(document).on("click", '#btnSavePhuTung', function () {
            var lstParameter = new Array();
            var cur_length = 0;
            let rowdata = $('#GetDSPhuTungXuat').find('table.tbPhuTungXuat tbody tr')
            console.log(rowdata);
            $(rowdata).find('input').each(function (i, obj) {
                lstParameter[cur_length] = new Object();
                lstParameter[cur_length].MS_PT = $(this).data('mspt');
                lstParameter[cur_length].MS_DH_NHAP_PT = $(this).closest('tr').find("td").eq(3).text();
                lstParameter[cur_length].MS_VI_TRI = $(this).data('msvt');
                lstParameter[cur_length].SL_XUAT = $(this).val();
                cur_length = cur_length + 1;
            });
            $.ajax({
                type: "POST",
                url: config.ADD_PHUTUNGXUATKHO,
                data: { jsonData: JSON.stringify(lstParameter), mspx: $('#MS_DH_XUAT_PT').val() },
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
            $('#modalLarge').modal('hide');
        })


        //lock phiếu xuất
        $(document).on("click", '#btnLock', function () {
            ShowConfirm(config.MESS_KHOA_PHIEU_XUAT, 'warning', '', function (result) {
                if (result == true) {
                    $.ajax({
                        type: "POST",
                        url: config.LOCK_PHIEUXUAT,
                        data: { mspx: $('#MS_DH_XUAT_PT').val() },
                        success: function (response) {
                            if (response.responseCode == 1) {
                                window.location.href = "/GoodIssue/EditGoodIssue?mspx=" + $('#MS_DH_XUAT_PT').val() + "";
                                showSuccess(response.responseMessage)
                            }
                            else {
                                showWarning(response.responseMessage)
                            }
                        }
                    });
                }
            });
        })



        $(document).on("click", '#btnSavePhieuXuatKho', function () {

            switch (parseInt($('#CboDangXuat').val())) {
                case 1: {
                    //xuất cho bảo trì
                    //MS_PHIEU_BAO_TRI
                    $("#CboBPCP").rules("remove");
                    $("#CboPBT").rules("add", {
                        notEqualTo: '-1'
                    });
                    break;
                }
                case 2: {

                    $("#CboBPCP").rules("remove");
                    $("#CboPBT").rules("remove");
                    //trả nhà cung cấp

                    break;
                }
                case 3: {
                    //khác
                    $("#CboBPCP").rules("remove");
                    $("#CboPBT").rules("remove");
                    break;
                }
                case 4: {
                    //bộ phận chiệu phí
                    $("#CboPBT").rules("remove");
                    $("#CboBPCP").rules("add", {
                        notEqualTo: '-1'
                    });
                    break;
                }
            }
            if ($('#myFormXuat').valid()) {
                $.ajax({
                    type: "POST",
                    url: config.SAVE_PHIEU_XUAT_KHO,
                    data: $('#myFormXuat').serialize(),
                    success: function (response) {
                        if (response.responseCode == 1) {
                            showSuccess(response.responseMessage)
                            setTimeout(function () {
                                window.location.href = "/GoodIssue/EditGoodIssue?mspx=" + $('#MS_DH_XUAT_PT').val() + "";
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
            $('.tblAddPhuTungXuat tbody tr').filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(keyword) > -1);
            },500);
            hideLoadingOverlay('#resultContent');
        })
        //$(document).on("keyup", '#search', debounce(function () {
        //    showLoadingOverlay('#resultContent');
        //    var keyword = $(this).val().toLowerCase();
        //    $('.tblAddPhuTungXuat tbody tr').each(function () {
        //        if ($(this).text().toLowerCase().indexOf(keyword) > -1) {
        //            $(this).addClass('visible').removeClass('hidden');
        //        } else {
        //            $(this).addClass('hidden').removeClass('visible');
        //        }
        //    });
        //    hideLoadingOverlay('#resultContent');
        //}, 500));

        if (parseInt($('#CboDangXuat').val()) == 2) {
            $('#CboDDH').parent('.form-floating').addClass('d-none');
        }

        $(document).on('change', '#chkBT', function () {
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

