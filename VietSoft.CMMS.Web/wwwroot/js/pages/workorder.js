var WorkOrderModule = WorkOrderModule || (function (window, $, config) {
    var contentDataList = "#GetWorkOrder";
    var delayTimer;
    var bload = true;
    function init() {
        //$(document).ready(function () {
        //    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="collapse"]'))
        //    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        //        return new bootstrap.Tooltip(tooltipTriggerEl)
        //    })
        //});

        //$("button").hover(function () {
        //    $('[role ="tooltip"]').css({ "background-color": "#ffff" });
        //});

        setDatePicker("#NGAY_BD_KH", null, null, null);
        setDatePicker("#NGAY_KT_KH", null, null, null);

        $('#btnhuyBT').on('click', function () {
            WorkList();
        });
        $('#cboLoaiBaoTri').val($('#MS_LOAI_BT').val()).change();
        //$('#cboUuTien').val($('#MS_UU_TIEN').val()).change();
        if ($('#flag').val() != 0) {
            $("#cboLoaiBaoTri").prop("disabled", true);
            $("#cboUuTien").prop("disabled", true);
            $('span [role=combobox]').css('background-color', '#FFFFFF');
        }

        bload = true;

        initEvent();
    }
    function AddCVinit() {
        $('input[type=radio][name=inlineRadioOptions]').change(function () {
            if ($(this).val() == 'true') {
                //đến
                $('#cboCV').parent('.form-floating').addClass('d-none');
                $('#CONGVIEC').parent('.form-floating').removeClass('d-none');
                $('#THOIGIAN').parent('.form-floating').removeClass('d-none');

            }
            else {
                $('#cboCV').parent('.form-floating').removeClass('d-none');
                $('#CONGVIEC').parent('.form-floating').addClass('d-none');
                $('#THOIGIAN').parent('.form-floating').addClass('d-none');
            }
        });

        $('#cboBP').on('change', function () {
            console.log($('input[type=radio][name=inlineRadioOptions]:checked').val());
            if ($('input[type=radio][name=inlineRadioOptions]:checked').val() == 'false') {
                LoadCongViec();
            }
        });

        $('#btnAddCVPT').on('click', function () {
            ThemCongViecChoBoPhan();
        });

        $('#cboBP').select2({
            theme: "bootstrap-5",
            dropdownParent: $('#modalResultContent'),
            width: "100%",
            height: "200px",

        });

        $('#cboCV').select2({
            theme: "bootstrap-5",
            dropdownParent: $('#modalResultContent'),
            width: "100%",
            height: "200px",
        });

        LoadCongViec();

    }


    function initEvent() {
        CalculatePlanDate()

        $(document).on("change", '#cboUuTien', function () {
            CalculatePlanDate();
        })

        $(document).on("change", '#cbokho', function () {
            Inventory();

        })

        WorkList();
        if ($("#cboLoaiBaoTri :selected").data('huhong') == 1) {
            $('#btnViewCauseOfDamage').show();
        }
        else {
            $('#btnViewCauseOfDamage').hide();
        }
        $(document).on("change", '#cboLoaiBaoTri', function () {
            let IsDamaged = $(this).find(":selected").data('huhong')
            console.log(IsDamaged)
            if (IsDamaged == 1) {
                $('#btnViewCauseOfDamage').show();
            }
            else {
                $('#btnViewCauseOfDamage').hide();
            }
        })

        $(document).on("keyup", '#search', function () {
            showLoadingOverlay("#modalResultContent");
            clearTimeout(delayTimer)
            delayTimer = setTimeout(function () {
                GetCauseOfDamageList()
            }, 1000)
            hideLoadingOverlay("#modalResultContent");
        })

        //$(document).on("change", '#inputCauseOfDamageContent input:checkbox', function () {
        //    if ($("#inputCauseOfDamageContent input:checkbox:checked").length > 0) {
        //        $("#btnSaveInputCauseOfDamageList").removeClass("disabled");
        //    }
        //    else {
        //        $("#btnSaveInputCauseOfDamageList").addClass("disabled");
        //    }
        //})

        $('#btnViewCauseOfDamage').on('click', function () {
            GetViewCauseOfDamage();
        });

        // confirm save workorder
        //$(document).on('click', '#btnYes', function () {
        //    saveCompleteWorkOrder();
        //    $('#modal').modal('hide');
        //})
        //$(document).on('click', '#btnNo', function () {
        //    $('#modal').modal('hide');
        //})

        $(document).on("click", '#btnCompletePBT', function () {
            //ShowConfirmModal(config.MESS_XACNHAN_HOANTHANH_PHIEUBAOTRI);
            ShowConfirm(config.MESS_XACNHAN_HOANTHANH_PHIEUBAOTRI, 'warning', '', function (result) {
                if (result == true) {
                    saveCompleteWorkOrder();
                }
            });
        });


        $(document).on("click", '.expand', function () {
            $('ul', $(this).parent()).eq(0).toggle();
        })
        $(document).on("click", '.expand', function () {
            $('ul', $(this).closest('.parent').parent()).eq(0).toggle();
        })

        $(document).on("click", '.form-check-input', function () {
            var isChecked = false
            if ($(this).is(":checked")) {
                isChecked = true
            }
            $(this).closest('li').find('ul input:checkbox').prop('checked', isChecked)
        })

        $(document).on("blur", '.SoLuongTT', function () {
            var maxvalue = parseFloat($(this).attr("max"));
            if (maxvalue > 0) {
                if (parseFloat($(this).val()) > maxvalue) {
                    $(this).val(maxvalue);
                    $(this).focus();
                    return false;
                }
            }

        })
        $(document).on("blur", '.SoLuongKH', function () {
            var maxvalue = parseFloat($(this).attr("max"));
            if (maxvalue > 0) {
                if (parseFloat($(this).val()) > maxvalue) {
                    $(this).val(maxvalue);
                    $(this).focus();
                    return false;
                }
            }

        })
        //let dept = $(this).data('dept')
        //let mscv = $(this).data('mscv');
        //kiểm tra không lớn hơn số lượng trong cấu trúc
        //    else {

        //        $.ajax({
        //            type: "POST",
        //            url: config.SAVE_WORK_ORDER,
        //            data: {
        //                model: model,
        //                deviceId: $('#MS_MAY').val(),
        //            },
        //            success: function (response) {
        //                if (response.responseCode == 1) {
        //                    showSuccess(response.responseMessage)
        //                    setTimeout(function () {
        //                        //window.history.back(1)
        //                        window.location.href = config.MyEcomaint;
        //                    }, 600)

        //                }
        //                else {
        //                    showWarning(response.responseMessage)
        //                }
        //            },
        //            complete: function () {
        //            }
        //        });


        //    }
        //})

        $(document).on("click", '.btnAddSupplies', function () {
            let suppliesSelected = [];
            $(this).closest('.table-responsive').find('table.tbl-supplies tbody tr').each(function () {
                let mspt = $(this).find('td').eq(0).text();
                suppliesSelected.push(mspt)
            })
            let dept = $(this).data('dept')
            let mscv = $(this).data('mscv')
            AddSupplies(dept, suppliesSelected, mscv);
        });

        $(document).on("click", '#btnAddSupplies', function () {
            let rowdata = $(this).closest('.modal-content').find('.modal-body table.tblAddSuppliesSeleced tbody tr.tr-supplies')

            $(rowdata).find('input:checkbox:checked').each(function () {
                let mspt = $(this).closest('tr').find("td").eq(0).text();
                let msvt = $(this).closest('tr').find("td").eq(1).text()
                let sl = $(this).closest('tr').find("td").eq(2).text()
                let rowId = `#flush-collapse-` + $('#MS_BO_PHAN').val().replace('.', '_') + $('#MS_CV').val()

                let html = ` <tr>
                                <td width="30%" style="line-height:2.3rem">`+ mspt + `</td>
                                <td width="30%" style="line-height:2.3rem">`+ msvt + `</td>
 <td width="15%"> <input class="form-control SoLuongKH" style="font-size:0.8rem;color:#198754 !important;border-color:#198754 !important;" type="number" min="1" max="`+ (msvt == '' ? 9999 : sl) + `" value="` + sl + `"  /></td>
<td width="15%"> <input class="form-control SoLuongTT" style="font-size:0.8rem;" type="number" min="1" max="`+ (msvt == '' ? 9999 : sl) + `" value="` + sl + `" /></td>
                                <td width="10%">
                                    <p style="margin-top: 10px;"><a class="remove-row"><i class="fa fa-trash-o fa-lg text-danger"></i></a></p>
                                </td>
                            </tr>`
                $(rowId).find('table tbody').append(html)
            });
            $('#modalLarge').modal('hide');
        })

        $(document).on("click", '#btnSaveWorkOrder', function () {
            let model = {
                MS_PHIEU_BAO_TRI: $('#MS_PHIEU_BAO_TRI').val(),
                S_NGAY_LAP: $('#NGAY_LAP').text(),
                S_NGAY_BD_KH: $('#NGAY_BD_KH').val(),
                S_NGAY_KT_KH: $('#NGAY_KT_KH').val(),
                MS_UU_TIEN: $('#cboUuTien').val(),
                TINH_TRANG_MAY: $('#TINH_TRANG_MAY').text(),
                MS_LOAI_BT: $('#cboLoaiBaoTri').val(),
                GHI_CHU: $('#GHI_CHU').val(),
                THEM: $('#THEM').val(),
            };
            $.ajax({
                type: "POST",
                url: config.SAVE_WORK_ORDER,
                data: {
                    model: model,
                    deviceId: $('#MS_MAY').val(),
                },
                success: function (response) {
                    if (response.responseCode == 1) {
                        showSuccess(response.responseMessage)
                        setTimeout(function () {
                            //window.history.back(1)
                            //window.location.href = config.MyEcomaint;
                            window.location.href = "/Home/WorkOrder?mspbt=" + $('#MS_PHIEU_BAO_TRI').val() + "&msmay=" + $('#MS_MAY').val() + "&tenmay=" + $('#emp-code').text() + "&flag=1";

                        }, 600)

                    }
                    else {
                        showWarning(response.responseMessage)
                    }
                },
                complete: function () {
                }
            });

        })

        $(document).on("click", '#btnAddWorkList', function () {
            let workList = [];
            $('input:checkbox.input-add-work:checked').each(function () {
                let mscv = $(this).data('ms-cviec')
                let msbophan = $(this).data('ms-bophan')
                let motacv = $(this).closest('tr').find("td").eq(1).text()
                let tenbophan = $(this).closest('tr').find("td").eq(3).text()

                //TODO SAVE WORK LIST
                //let html = `<div class="accordion border-0 break-line" id="accordionFlushExample-`+ mscv +`">
                //<div class="accordion-item border-0 break-line">
                //    <h2 class="accordion-header" id="flush-heading-`+ mscv +`">
                //        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse-`+ mscv + `" aria-expanded="false" aria-controls="flush-collapse-` + mscv +`" title="Bạc đạn">
                //            + `+ msbophan + `&nbsp`+ motacv + `
                //        </button>
                //    </h2>
                //    <div id="flush-collapse-`+ mscv +`" class="accordion-collapse collapse" aria-labelledby="flush-heading-`+ mscv +`" data-bs-parent="#accordionFlushExample-`+ mscv +`">
                //        <div class="table-responsive">
                //            <table class="table table-responsive table-borderless">
                //                <tbody>

                //                </tbody>
                //            </table>

                //            <div class="d-flex flex-row-reverse">
                //                <div>
                //                    <a class="btn btn-outline-warning m-1 btnSaveSupplies" style="width:auto" href="#!" role="button">
                //                        <i class="fa fa-floppy-o fs-7"></i>
                //                    </a>
                //                </div>
                //                <div>
                //                    <a class="btn btn-outline-primary m-1  btnAddSupplies" data-dept=`+ msbophan + ` data-mscv=` + mscv +` style="width:auto" href="#!" role="button">
                //                        <i class="fa fa-plus fs-7"></i>
                //                    </a>
                //                </div>
                //            </div>


                //        </div>


                //    </div>
                //</div>
                //</div>`
                //$('#workListContent').append(html);

                let object = {
                    MS_BO_PHAN: msbophan,
                    TEN_BO_PHAN: tenbophan,
                    MS_CV: mscv,
                    MO_TA_CV: motacv
                }
                workList.push(object)

            });

            SaveMaintenanceWork(workList)
        });


        $(document).on("click", '#btnChonNguoiThucHien', function () {
            SaveNguoiThucHien();
        });
        $(document).on("click", '#btnAddMess', function () {
            $.ajax({
                type: "POST",
                url: config.ADD_MESSAGE,
                data: {
                    ticketId: $('#MS_PHIEU_BAO_TRI').val(),
                    noidung: $('#NOI_DUNG').val(),
                    guithem: $('#cboCongNhan').val(),
                },
                success: function (response) {
                    if (response.responseCode == 1) {
                        GetListMessage();
                        $('#NOI_DUNG').val('');
                        $('#cboCongNhan').val('').change();
                    }
                    else {
                        showWarning(response.responseMessage)
                    }
                },
            });
        });

        $(document).on("click", '#btnMessage', function () {
            ShowMessage();
        });

        $(document).on("click", '#btnRefresh', function () {
            GetListMessage();
        });

        $(document).on('click', '#btnCancelHT', function () {
            ShowConfirm(config.MESS_XACNHAN_HOANTHANH_PHIEUBAOTRI, 'warning', '', function (result) {
                if (result == true) {
                    //saveCompleteWorkOrder();
                    window.location.href = "/Home/Index";
                }
                else {
                    //cập nhật lại tình trạng của phiếu bảo trì
                    $.ajax({
                        type: "POST",
                        url: config.UPDATE_TT_HT,
                        data: { ticketId: $('#MS_PHIEU_BAO_TRI').val(), },
                        success: function (response) {
                            if (response.responseCode == 1) {
                            }
                            else {
                                showWarning(response.responseMessage)
                            }
                        },
                    });
                    $('#modalLarge').modal('hide');
                }
            });

        });

        $(document).on('click', '#btnSaveInputCauseOfDamageList', function () {
            let causeOfDamageModels = []
            $(this).closest('.modal').find('.modal-body #inputCauseOfDamageContent input:checkbox:checked').each(function () {
                let key = $(this).data('key')
                if (key !== null && key !== '' && key !== 'undefined') {
                    causeOfDamageModels.push(key)
                }
            })

            let model = {
                MS_PHIEU_BAO_TRI: $('#MS_PHIEU_BAO_TRI').val(),
                Keys: causeOfDamageModels
            }
            $.ajax({
                type: "POST",
                url: config.SAVE_INPUT_CAUSE_OF_DAMAGE,
                data: {
                    model: model,
                    msnn: $('#cboNguyennhan').val(),
                    tungay: $('#fromDate').val(),
                    denngay: $('#toDate').val(),
                },
                success: function (response) {
                    if (response.responseCode == 1) {
                        $('#modalLarge').modal('hide')
                        showSuccess(response.responseMessage)
                        setTimeout(function () {
                            window.location.href = "/Home/Index";
                        }, _notifyTimeout)
                    }
                    else {
                        showWarning(response.responseMessage)
                    }
                },
                complete: function () {
                }
            });
        });

        $(document).on('click', '.btnSaveSupplies', function () {
            $('[data-toggle="tooltip"]').tooltip('hide');
            bload = true;
            let suppliesList = [];
            let msbp = $(this).closest('div').find('input.MS_BO_PHAN').val();
            let mscv = $(this).closest('div').find('input.MS_CV').val();
            $(this).parents('.table-responsive').find('table.tbl-supplies tr').each(function () {
                let mspt = $(this).find('td').eq(0).text()
                let msvt = $(this).find('td').eq(1).text()
                let sl = $(this).find('td').eq(2).find('input').val()
                //kiểm tra số lượng kh

                if (!$.isNumeric(sl) || sl === '' || sl === '0') {
                    bload = false;
                }

                let sltt = $(this).find('td').eq(3).find('input').val()
                if (!$.isNumeric(sltt) || sltt === '' || sltt === '0') {
                    bload = false;
                }
                //kiểm tra số lượng thực tế
                let obj = {
                    MS_PT: mspt,
                    MS_VI_TRI_PT: msvt,
                    SL_KH: sl,
                    SL_TT: sltt,
                    MS_BO_PHAN: msbp,
                    MS_CV: mscv
                }
                suppliesList.push(obj);
            })
            let model = {
                MS_PHIEU_BAO_TRI: $('#MS_PHIEU_BAO_TRI').val(),
                DEVICE_ID: $('#MS_MAY').val(),
                MS_CV: mscv,
                MS_BO_PHAN: msbp,
                SuppliesList: suppliesList
            }

            if (bload == true) {
                $.ajax({
                    type: "POST",
                    url: config.SAVE_SUPPLIES,
                    data: {
                        model: model
                    },
                    success: function (response) {
                        if (response.responseCode == 1) {
                            showSuccess(response.responseMessage)
                            $('#modalLarge').modal('hide');
                            WorkList();
                        }
                        else {
                            showWarning(response.responseMessage)
                        }
                    },
                    complete: function () {
                    }
                });
            }
            else {
                showWarning(config.MESS_GIA_TRI_KHONG_HOP_LE);
            }
        });

        $(document).on('click', '.btnBackLog', function () {
            let msbp = $(this).closest('div').find('input.MS_BO_PHAN').val();
            let mscv = $(this).closest('div').find('input.MS_CV').val();
            let model = {
                MS_PHIEU_BAO_TRI: $('#MS_PHIEU_BAO_TRI').val(),
                MS_CV: mscv,
                MS_BO_PHAN: msbp
            }
            ShowConfirm(config.MESS_CHUYEN_CONGVIEC_QUA_KEHOACH, 'warning', '', function (result) {
                if (result == true) {
                    $.ajax({
                        type: "POST",
                        url: config.BACK_LOG,
                        data: {
                            model: model
                        },
                        success: function (response) {
                            if (response.responseCode == 1) {
                                showSuccess(response.responseMessage)
                                WorkList();
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

        var clickCount = 0;
        var clickTimeout;
        $(document).on('click', '.btnTaiLieu', function (event, element) {
            var form = $(this);
            event.preventDefault(); // Loại bỏ sự kiện click mặc định của thẻ
            clickCount++;
            if (clickCount === 1) {
                clickTimeout = setTimeout(function () {
                    //alert("Click");
                    $.ajax({
                        type: "GET",
                        url: config.XEM_HUONG_DAN,
                        data: {
                            thaotac: form.data('thaotac'),
                            tieuchuanKT: form.data('tieuchuankt'),
                            yeucauNS: form.data('yeucauns'),
                            yeucauDC: form.data('yeucaudc'),
                            MotaCV: form.data('motacv'),
                        },
                        success: function (response) {
                            $('#modalLarge .modal-content').html(response);
                            $('#modalLarge').modal('show');
                        }
                    });

                    clickCount = 0;
                }, 300);
            } else if (clickCount === 2) {
                var filePath = $(this).data('file');
                if (filePath !== '') {
                    var url = "/WorkOrder/DownloadFile?filepath=" + filePath;
                    window.open(url, "_blank");
                }
                clearTimeout(clickTimeout);
                clickCount = 0;
            }
        }),


            $(document).on('click', '.btnDeleteWork', function () {
                let msbp = $(this).closest('div').find('input.MS_BO_PHAN').val();
                let mscv = $(this).closest('div').find('input.MS_CV').val();
                let model = {
                    MS_PHIEU_BAO_TRI: $('#MS_PHIEU_BAO_TRI').val(),
                    MS_CV: mscv,
                    MS_BO_PHAN: msbp
                }
                ShowConfirm(config.MESS_XOA_CONG_VIEC, 'warning', '', function (result) {
                    if (result == true) {
                        $.ajax({
                            type: "POST",
                            url: config.DELETE_WORK,
                            data: {
                                model: model
                            },
                            success: function (response) {
                                if (response.responseCode == 1) {
                                    showSuccess(response.responseMessage)
                                    WorkList();
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

        $(document).on('click', '#btnhuyBT', function () {
            let model = {
                MS_PHIEU_BAO_TRI: $('#MS_PHIEU_BAO_TRI').val(),
            }
            ShowConfirm(config.MESS_XOA_PHIEU_BAO_TRI, 'warning', '', function (result) {
                if (result == true) {
                    $.ajax({
                        type: "POST",
                        url: config.DELETE_WORKORDER,
                        data: {
                            model: model
                        },
                        success: function (response) {
                            if (response.responseCode == 1) {
                                showSuccess(response.responseMessage)
                                window.location.href = config.MyEcomaint;
                            }
                            else {
                                showWarning(response.responseMessage);
                            }
                        },
                        complete: function () {
                        }
                    });

                }
            });

        });

        $(document).on('click', '#btnSaveLogWork', function () {
            let logworkList = []
            $(this).closest('.modal').find('.modal-body table#tblLogWork tr').each(function () {
                let valFromDate = $(this).find('input.fromDate').val();
                let valToDate = $(this).find('input.toDate').val();

                let fromDate = moment(valFromDate, _formatDateTime).toDate();
                let toDate = moment(valToDate, _formatDateTime).toDate();
                if (fromDate >= toDate) {
                    showWarning(config.MESS_TU_GIO_KHONG_LON_HON_DEN_GIO);
                    return;
                }
                let times = $(this).find('td').eq(3).find('p').text()
                let mscn = $(this).find('td').eq(2).find(".cboCongNhan").val();
                let obj = {
                    MS_CONG_NHAN: mscn,
                    S_NGAY: valFromDate,
                    S_DEN_NGAY: valToDate,
                    SO_GIO: times
                }
                logworkList.push(obj);
            })
            let model = {
                MS_PHIEU_BAO_TRI: $('#MS_PHIEU_BAO_TRI').val(),
                LogWorkList: logworkList
            }
            $.ajax({
                type: "POST",
                url: config.SAVE_LOG_WORK,
                data: {
                    model: model
                },
                success: function (response) {
                    if (response.responseCode == 1) {
                        showSuccess(response.responseMessage)
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

        $('#logWork').on('click', function () {
            LogWork();
        });

        $('#btnXemtonkho').on('click', function () {
            $.ajax({
                type: "POST",
                url: config.CHECK_TON_KHO,
                data: { ticketId: $('#MS_PHIEU_BAO_TRI').val(), },
                success: function (response) {
                    if (response.responseCode == 1) {
                        XemTonKho();
                    }
                    else {
                        showWarning(response.responseMessage)
                    }
                },
                complete: function () {
                }
            });
        });

        $(document).on("click", '#btnAddMaintenanceWork', function () {
            AddMaintenanceWork()
        });

        $(document).on("click", '#btnAddNguoiThucHien', function () {
            ChonNguoiThucHien()
        });

        $(document).on("click", '#btnAddWork', function () {
            $.ajax({
                type: "GET",
                url: config.THEM_CONG_VIEC,
                data: {
                    deviceId: $('#MS_MAY').val(),
                    ticketId: $('#MS_PHIEU_BAO_TRI').val(),
                },
                success: function (response) {
                    $('#modalLarge .modal-content').html(response);
                    $('#modalLarge').modal('show');
                }
            });
        });




        $(document).on("click", '.remove-row', function () {
            $(this).closest("tr").remove();
        });

        $(document).on("click", '#btnAddRowLogWork', function () {
            let logworkList = []
            $(this).closest('.modal').find('.modal-body table#tblLogWork tr').each(function () {
                let valFromDate = $(this).find('input.fromDate').val();
                let valToDate = $(this).find('input.toDate').val();

                let fromDate = moment(valFromDate, _formatDateTime).toDate();
                let toDate = moment(valToDate, _formatDateTime).toDate();
                if (fromDate >= toDate) {
                    showWarning(config.MESS_TU_GIO_KHONG_LON_HON_DEN_GIO);
                    return;
                }
                let times = $(this).find('td').eq(3).find('p').text();
                let mscn = $(this).find('td').eq(2).find(".cboCongNhan").val();
                let obj = {
                    MS_CONG_NHAN: mscn,
                    S_NGAY: valFromDate,
                    S_DEN_NGAY: valToDate,
                    SO_GIO: times
                }
                logworkList.push(obj);
            })
            let model = {
                MS_PHIEU_BAO_TRI: $('#MS_PHIEU_BAO_TRI').val(),
                LogWorkList: logworkList
            }
            $.ajax({
                type: "POST",
                url: config.ADD_ROW_LOG_WORK,
                data: {
                    model: model,
                    deviceId: $('#MS_MAY').val()
                },
                success: function (response) {
                    $('#modalLarge .modal-content').html(response);
                    $('#modalLarge').modal('show');
                }
            });
        });

        //    let html = `<tr >
        //                    <td style="width:30%">
        //                        <div class="form-floating input-group date">
        //                            <input style="border-radius: 0 !important;width:140px!important" type="text" class="form-control-bottom form-control fromDate" autocomplete="off"/>
        //                        </div>
        //                    </td>
        //                    <td style="width:30%">
        //                         <div class="form-floating input-group date" >
        //                            <input type="text" style="border-radius: 0 !important;width:140px!important" class="form-control form-control-bottom toDate" autocomplete="off"/>
        //                        </div>
        //                    </td>
        //                      <td style="width:30%">
        //                     <select class="form-control form-control-bottom cboCongNhan"></select>
        //                       </td>
        //                    <td style="width:10%">
        //                      <p class="text-orange mt-3 hours"> 0</p>
        //                    </td>
        //                     <td width="10%">
        //                            <p style="margin-top: 0.95rem;"><a class="remove-row"><i class="fa fa-trash-o fa-lg text-danger"></i></a></p>
        //                        </td>
        //                </tr>`
        //    $('#tblLogWork tbody').prepend(html)
        //    setDateTimePicker('.fromDate', moment(new Date(), _formatDateTime).subtract(1, 'hour').toDate())
        //    setDateTimePicker('.toDate', moment(new Date(), _formatDateTime).toDate())
        //});



        $(document).on("dp.change", '.fromDate, .toDate', function () {
            let valFromDate = $(this).closest('tr').find('input.fromDate').val();
            let valToDate = $(this).closest('tr').find('input.toDate').val();

            let fromDate = moment(valFromDate, _formatDateTime).toDate();
            let toDate = moment(valToDate, _formatDateTime).toDate();

            let hoursDiff = Math.floor((toDate - fromDate) / 60000);
            if (hoursDiff <= 0) {
                showWarning(config.MESS_TU_GIO_KHONG_LON_HON_DEN_GIO);
                //$(this).closest('tr').find('input.fromDate').focus();
            }
            //let diffTime = getDiffTimes(fromDate, toDate)
            //let hours = diffTime > 0 ? diffTime : 0
            //$(this).closest('tr').find("p.hours").text(Math.round(hours * 100) / 100)
            $(this).closest('tr').find("p.hours").text(getHoursAndMinusText(hoursDiff / 60))
        });
    }

    function LoadCongViec() {
        $('#cboCV option').remove();
        console.log($('#cboBP').val());
        $.ajax({
            type: "POST",
            url: config.LOAD_COMBO_CONG_VIEC,
            data: { deviceId: $('#MS_MAY').val(), msbp: $('#cboBP').val() },
            success: function (data) {
                $('#cboCV').html('');
                var s = '';
                for (var i = 0; i < data.length; i++) {
                    s += '<option value="' + data[i].value + '">' + data[i].text + '</option>';
                }
                $("#cboCV").html(s);
            }
        });
    }

    function saveCompleteWorkOrder() {
        showLoadingOverlay("#inputCauseOfDamageContent");
        $.ajax({
            type: "POST",
            url: config.COMPLETED_WORK_ORDER,
            data: {
                ticketId: $('#MS_PHIEU_BAO_TRI').val(),
                deviceId: $('#MS_MAY').val()
            },
            success: function (response) {
                if (response.responseCode == 1) {
                    showSuccess(response.responseMessage);
                    window.location.href = config.MyEcomaint;
                }
                else if (response.responseCode == 2) {
                    GetInputCauseOfDamage();
                }
                else {
                    showWarning(response.responseMessage)
                }
            },
            complete: function () {
                hideLoadingOverlay("#inputCauseOfDamageContent");
            }
        });
    }

    function SaveNguoiThucHien() {
        let CNList = [];
        $('input:checkbox.input-add-nth:checked').each(function () {
            let mscn = $(this).data('ms-cn');
            let object = {
                MS_CONG_NHAN: mscn,
            }
            CNList.push(object)

        });
        $.ajax({
            type: "POST",
            url: config.SAVE_NGUOI_THUC_HIEN,
            data: {
                ticketId: $('#MS_PHIEU_BAO_TRI').val(),
                json: JSON.stringify(CNList)
            },
            success: function (response) {
                if (response.responseCode == 1) {
                    showSuccess(response.responseMessage)
                    $('#modalLarge').modal('hide');
                    WorkList();
                }
                else {
                    showWarning(response.responseMessage)
                }
            },
            complete: function () {
            }
        });
    }


    function SaveMaintenanceWork(workList) {
        let model = {
            MS_PHIEU_BAO_TRI: $('#MS_PHIEU_BAO_TRI').val(),
            DEVICE_ID: $('#MS_MAY').val(),
            WorkList: workList
        }

        $.ajax({
            type: "POST",
            url: config.SAVE_MAINTENANCE_WORK,
            data: {
                model: model
            },
            success: function (response) {
                if (response.responseCode == 1) {
                    showSuccess(response.responseMessage)
                    $('#modal').modal('hide');
                    WorkList();
                }
                else {
                    showWarning(response.responseMessage)
                }
            },
            complete: function () {
            }
        });
    }

    //thêm công việc cho bộ phận
    function ThemCongViecChoBoPhan() {
        $.ajax({
            type: "POST",
            url: config.THEM_CONG_VIEC_PHU_TUNG,
            data: {
                deviceId: $('#MS_MAY').val(),
                msbp: $('#cboBP').val(),
                mscv: $('#cboCV').val(),
                tenCV: $('#CONGVIEC').val(),
                thoigian: $('#THOIGIAN').val(),
                them: $('input[type=radio][name=inlineRadioOptions]:checked').val()
            },
            success: function (response) {
                if (response.responseCode == 1) {
                    showSuccess(response.responseMessage)
                    $('#modalLarge').modal('hide');
                    AddMaintenanceWork();
                }
                else {
                    showWarning(response.responseMessage)
                }
            },
            complete: function () {
            }
        });
    }

  


    function GetInputCauseOfDamage() {
        showLoadingOverlay("#inputCauseOfDamageContent");
        $.ajax({
            type: "GET",
            url: config.GET_INPUT_CAUSE_OF_DAMAGE,
            data: {
                ticketId: $('#MS_PHIEU_BAO_TRI').val(),
                deviceId: $('#MS_MAY').val(),
            },
            success: function (response) {
                $('#modalLarge .modal-content').html(response);
                $('#modalLarge').modal('show');
                GetInputCauseOfDamageList()
            },
            complete: function () {
                hideLoadingOverlay("#inputCauseOfDamageContent");
            }
        });
    }

    function GetInputCauseOfDamageList() {
        $.ajax({
            type: "GET",
            url: config.GET_INPUT_CAUSE_OF_DAMAGE_LIST,
            data: {
                deviceId: $('#MS_MAY').val(),
                ticketId: $('#MS_PHIEU_BAO_TRI').val()
            },
            success: function (response) {
                if (response.responseCode == 1) {
                    $("#inputCauseOfDamageContent").html("");
                    if (response.data) {
                        $(response.data).each(function (index, value) {
                            var troot = document.createElement("ul");
                            troot.className = "rootNode";
                            treeMenuForInput(value, troot, 0);
                            $('#inputCauseOfDamageContent').append(troot)
                        });
                        $('.expand').each(function () {
                            $('ul', $(this).closest('.parent').parent()).eq(0).toggle();
                        })
                    }
                    else {
                        let html = `<span>` + config.KHONGCO_DULIEU + `</span>`
                        $('#inputCauseOfDamageContent').append(html)
                    }
                }
            }
        });
    }

    function GetCauseOfDamageList() {
        $.ajax({
            type: "GET",
            url: config.GET_CAUSE_OF_DAMAGE_LIST,
            data: {
                keyword: $('#search').val(),
                deviceId: $('#MS_MAY').val()
            },
            success: function (response) {
                if (response.responseCode == 1) {
                    $("#resultContent").html("");
                    if (response.data) {
                        $(response.data).each(function (index, value) {
                            var troot = document.createElement("ul");
                            troot.className = "rootNode"
                            treeMenu(value, troot, 0);
                            $('#resultContent').append(troot)
                        });

                        $('.expand').each(function () {
                            $('ul', $(this).parent()).eq(0).toggle();
                        })
                    }
                    else {
                        let html = `<span>` + config.KHONGCO_DULIEU + `</span>`
                        $('#resultContent').append(html)
                    }
                }
            }
        });
    }

    function insertAfter(newNode, referenceNode) {
        referenceNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function treeMenu(parent, tparent, level) {
        var childs = parent.childs;
        var icon = childs ? "bi bi-plus-lg" : ""
        var sib = document.createElement("li");
        var color = level == 0 ? "root" : ((childs && level != 0) ? "sub-item" : "")
        sib.innerHTML = `<div class="expand pt-2 flex-fill" ` + (childs ? 'style="cursor: pointer"' : '') + `>
            <i class="` + icon + `"></i>
            <span>`+ (parent.itemCode ? parent.itemCode : '') + `</span>
            <span class=`+ color + `>` + parent.itemName + `</span>
            <span> &emsp;`+ parent.amount + `</span>
            </div>`;
        tparent.appendChild(sib);
        if (!childs) return;

        var nextRoot = document.createElement("ul");

        insertAfter(nextRoot, sib);

        for (var i = 0; i < childs.length; i++) {
            treeMenu(childs[i], nextRoot, level + 1);
        }
    }

    function treeMenuForInput(parent, tparent, level) {
        var childs = parent.childs;
        var icon = childs ? "bi bi-plus-lg" : ""
        var sib = document.createElement("li");
        var color = level == 0 ? "root" : ((childs && level != 0) ? "sub-item" : "")
        sib.innerHTML = `
               <div class="d-flex parent">
            <div class="expand pt-2 flex-fill" ` + (childs ? 'style="cursor: pointer"' : '') + `>
            <i class="` + icon + `"></i>
            <span>`+ (parent.itemCode ? parent.itemCode : '') + `</span>
            <span class=`+ color + `>` + parent.itemName + `</span>
            </div>
                <div class="mx-3 my-1"><input class="form-check-input" type="checkbox" data-key=`+ parent.key + `></div>
            </div>`;
        tparent.appendChild(sib);
        if (!childs) return;

        var nextRoot = document.createElement("ul");
        insertAfter(nextRoot, sib);

        for (var i = 0; i < childs.length; i++) {
            treeMenuForInput(childs[i], nextRoot, level + 1);
        }
    }

    function GetViewCauseOfDamage() {
        $.ajax({
            type: "GET",
            url: config.GET_VIEW_CAUSE_OF_DAMAGE,
            success: function (response) {
                $('#modalLarge .modal-content').html(response);
                $('#modalLarge').modal('show');
                GetCauseOfDamageList()
            }
        });
    }

    function LogWork() {
        $.ajax({
            type: "GET",
            url: config.LOG_WORK,
            data: {
                ticketId: $('#MS_PHIEU_BAO_TRI').val(),
                deviceId: $('#MS_MAY').val(),
            },
            success: function (response) {
                $('#modalLarge .modal-content').html(response);
                $('#modalLarge').modal('show');
            }
        });
    }

    function XemTonKho() {
        $.ajax({
            type: "GET",
            url: config.VIEW_INVENTORY,
            data: {
                ticketId: $('#MS_PHIEU_BAO_TRI').val(),
                deviceId: $('#MS_MAY').val(),
            },
            success: function (response) {
                $('#modalLarge .modal-content').html(response);
                $('#modalLarge').modal('show');

                $("#cbokho").select2({
                    theme: "bootstrap-5",
                    width: "100%",
                    selectionCssClass: "select2--small",
                    dropdownCssClass: "select2--small",
                    minimumResultsForSearch: -1
                });


                Inventory();
            }
        });
    }


    function WorkList() {
        showLoadingOverlay("#workListContent");
        $.ajax({
            type: "GET",
            url: config.GET_WORK_LIST,
            data: {
                deviceId: $('#MS_MAY').val(),
                ticketId: $('#MS_PHIEU_BAO_TRI').val(),
                huhong: $('#HU_HONG').val(),
            },
            success: function (response) {
                $('#workListContent').html(response);
            },
            complete: function () {
                hideLoadingOverlay("#workListContent");
            }
        });
    }

    function Inventory() {
        showLoadingOverlay("#GetListInventory");
        $.ajax({
            type: "GET",
            url: config.GET_INVENTORY,
            data: {
                mskho: $('#cbokho').val(),
                ticketId: $('#MS_PHIEU_BAO_TRI').val()
            },
            success: function (response) {
                $('#GetListInventory').html(response);
            },
            complete: function () {
                hideLoadingOverlay("#GetListInventory");
            }
        });
    }

    function AddSupplies(dept, suppliesSelected, mscv) {
        var json = JSON.stringify(suppliesSelected)
        $.ajax({
            type: "POST",
            url: config.ADD_SUPPLIES,
            data: {
                suppliesSelectedJson: json,
                deviceId: $('#MS_MAY').val(),
                dept: dept,
                workId: mscv,
                ticketId: $('#MS_PHIEU_BAO_TRI').val()
            },
            success: function (response) {
                $('#modalLarge .modal-content').html(response);
                $('#modalLarge').modal('show')
            }
        });
    }

    function AddMaintenanceWork() {
        $.ajax({
            type: "GET",
            url: config.ADD_MAINTENANCE_WORK,
            data: {
                deviceId: $('#MS_MAY').val(),
                ticketId: $('#MS_PHIEU_BAO_TRI').val()
            },
            success: function (response) {
                //$('#modalLarge .modal-content').html(response);
                //$('#modalLarge').modal('show');
                $('#modal .modal-content').html(response);
                $('#modal').modal('show');
            }
        });
    }

    function ChonNguoiThucHien() {
        $.ajax({
            type: "GET",
            url: config.ADD_NGUOI_THUC_HIEN,
            data: {
                deviceId: $('#MS_MAY').val(),
                ticketId: $('#MS_PHIEU_BAO_TRI').val()
            },
            success: function (response) {
                $('#modalLarge .modal-content').html(response);
                $('#modalLarge').modal('show');
            }
        });
    }


    function ShowMessage() {
        $.ajax({
            type: "GET",
            url: config.SHOW_MESSAGE,
            data: {
                deviceId: $('#MS_MAY').val(),
                ticketId: $('#MS_PHIEU_BAO_TRI').val()
            },
            success: function (response) {
                $('#modalLarge .modal-content').html(response);
                $('#modalLarge').modal('show');
                GetListMessage();
            }
        });
    }
    //gét list message
    function GetListMessage() {
        showLoadingOverlay("#GetThongTin");
        $.ajax({
            type: "GET",
            url: config.GET_MESSAGE,
            data: {
                ticketId: $('#MS_PHIEU_BAO_TRI').val()
            },
            success: function (response) {
                $("#GetThongTin").html(response);
            },
            complete: function () {
                hideLoadingOverlay("#GetThongTin");
            }
        });
    }

    function CalculatePlanDate() {
        if ($('#flag').val() == 0) {
            let songay = $('#cboUuTien').find(":selected").data('songay')
            if (songay != undefined) {
                let date = moment($('#currentDate').val(), _formatDate).toDate();
                let a = date.setDate(date.getDate() + songay)
                $('#NGAY_KT_KH').val(moment(a).format(_formatDate))
            }
        }
    }

    var modalImg = document.getElementById("img01");
    var file;
    var com;
    var work;
    function loadhinh(e) {
        file = null;
        obj = e;
        work = $(e).attr('data-work');
        com = $(e).attr('data-com');
        modalImg.src = '';
        $('#exampleModal').modal('show');
        modalImg.src = $(e).attr('data-src');
    };

    var importfile = $('#fileToUpload');
    $('#btnXoaHinh').click(function () {
        file = null;
        $('#img01').attr('src', '');
        $('#img01').attr('pat', '');
    });
    $('#btnLuuHinh').click(function () {

        if (file == null) {
            showWarning('Bạn chưa chọn file cần lưu!');
            return;
        }

        $('#exampleModal').modal('hide');
        var fd = new FormData();
        fd.append('image', file);
        fd.append('ticketId', $('#MS_PHIEU_BAO_TRI').val());
        fd.append('com', com);
        fd.append('work', work);
        $.ajax({
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,
            url: config.SAVE_IMAGE,
            success: function (response) {
                if (response.responseCode == 1) {
                    showSuccess(response.responseMessage);
                    $(obj).attr('data-src', response.data.path64);
                    $(obj).attr('data-pat', response.data.path);
                }
                else {
                    showWarning(response.responseMessage)
                }
            },
            error: function (response) {
            }
        });
        //$(obj).attr('data-src', $('#img01').attr('src'));
    });
    $('#btnChonHinh').click(function () {
        importfile.click();
    });
    function uploadImgDisplay(curFile) {
        var fileURL = window.URL.createObjectURL(curFile);
        $('#img01').attr('src', fileURL);
    }

    importfile.change(function () {
        if (!this.files.length) {
            return;
        }
        // is image
        file = this.files[0];
        this.value = '';
        switch (file.type) {
            case 'image/bmp':
            case 'image/jpeg':
            case 'image/jpg':
            case 'image/png':
            case 'image/gif':
                break;
            default:
                {
                    alert('The uploaded file is not supported.');
                    return;
                }
        }
        uploadImgDisplay(file);
    });

    return {
        init: init,
        AddCVinit: AddCVinit,
        loadhinh: loadhinh,
    };

})(window, jQuery, config);

