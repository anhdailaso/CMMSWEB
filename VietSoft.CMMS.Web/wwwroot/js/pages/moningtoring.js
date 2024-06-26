﻿var MoningToringModule = MoningToringModule || (function (window, $, config) {
    var contentDataList = "#GetMoningToring";
    var delayTimer;
    var bload = false;
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

        setDatePicker("#NGAY_KH", new Date(), null, null);

        $('#chkanct').on('change', function () {
            if ($(this).is(":checked")) {
                $('.accordion-collapse.collapse').removeClass('show');
            }
            else {
                $('.accordion-collapse.collapse').addClass('show');
            }
        });

        $(document).on("click", '#btnComplete', function () {
            if (SaveMor() == false) {
                return;
            }
            ShowConfirm("Bạn có muốn hoàn thành phiếu GSTT này không?", 'warning', '', function (result) {
                if (result == true) {
                    saveComplete();
                }
            });
        });

        $(document).on("click", '#btnChondat', function () {
            $("td[data-pass=1] input[type=checkbox]").prop('checked', true);  
            $(".Measurement-true").css("color", "#ff870f");
        });

        $(document).on("click", '#btnBochon', function () {
            $("td[data-pass=1] input[type=checkbox]").prop('checked', false);
            $(".Measurement-true").css("color", "#113186");
        });

        $(document).on('click', '#btnhuyGS', function () {

            ShowConfirm("Bạn có muốn xóa GSTT này không?", 'warning', '', function (result) {
                if (result == true) {
                    $.ajax({
                        type: "POST",
                        url: config.DELETE_GSTT,
                        data: {
                            STT: $('#STT').val(),
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


        $(document).on("click", '#btnAddNguoiThucHien', function () {
            ChonNguoiThucHien();
        });

        $(document).on("click", '#btnShowView', function () {
            ShowThoigianChaymay();
        });

        $(document).on("click", '#btnChonNguoiThucHien', function () {
            SaveNguoiThucHien();
        });


        $('#btnsave').on('click', function () {
            var lstParameter = new Array();
            var cur_length = 0;
            $("#accordionFlushExample table").each(function () {
                $(this).find('tr input[type=checkbox]:checked').each(function (i, obj) {
                    lstParameter[cur_length] = new Object();
                    lstParameter[cur_length].DeviceID = $('#MS_MAY').val(),
                        lstParameter[cur_length].MonitoringParamsID = $(obj).attr('data-msthongso');
                    lstParameter[cur_length].ComponentID = $(obj).attr('data-msbophan');
                    lstParameter[cur_length].TypeOfParam = 1;
                    lstParameter[cur_length].ID = 1;
                    lstParameter[cur_length].ValueParamID = $(obj).attr('data-id');
                    lstParameter[cur_length].Measurement = 1;
                    lstParameter[cur_length].Note = $(obj).closest('tr').find('#note').val();
                    lstParameter[cur_length].DUONG_DAN = $(obj).closest('.accordion-item.border-0.break-line').find('[data-com="' + $(obj).attr('data-msbophan') + '"][data-mor="' + $(obj).attr('data-msthongso') + '"]').attr('data-pat');
                    cur_length = cur_length + 1;
                })
                $(this).find('tr input[type=number]').each(function (i, obj) {
                    if ($(obj).val() !== '') {
                        lstParameter[cur_length] = new Object();
                        lstParameter[cur_length].DeviceID = $('#MS_MAY').val(),
                            lstParameter[cur_length].MonitoringParamsID = $(obj).attr('data-msthongso');
                        lstParameter[cur_length].ComponentID = $(obj).attr('data-msbophan');
                        lstParameter[cur_length].TypeOfParam = 0;
                        lstParameter[cur_length].ValueParamID = -1;
                        var data = JSON.parse($(obj).attr('data-range'));
                        var j = 0;
                        for (j = 0; j < data.length; j++) {
                            if (parseFloat(data[j].GiaTriTren) >= parseFloat($(obj).val()) && parseFloat($(obj).val()) >= parseFloat(data[j].GiaTriDuoi)) {
                                lstParameter[cur_length].ID = data[j].ID
                                break;
                            }
                        }
                        lstParameter[cur_length].Measurement = $(obj).val();
                        lstParameter[cur_length].Note = $(obj).closest('tr').find('#note').val();
                        lstParameter[cur_length].DUONG_DAN = $(obj).closest('.accordion-item.border-0.break-line').find('[data-com="' + $(obj).attr('data-msbophan') + '"][data-mor="' + $(obj).attr('data-msthongso') + '"]').attr('data-pat');
                        cur_length = cur_length + 1;
                    }
                })

            })
            //if (cur_length === 0) {
            //    showWarning(config.MESS_VUI_LONG_CHON_DL);
            //    return;
            //}

            let model = {
                STT: $('#STT').val(),
                SO_PHIEU: $('#SO_PHIEU').val(),
                NGAY_KH: $('#NGAY_KH').val(),
                MUC_UU_TIEN: $('#cboUuTien').val(),
                NHAN_XET: $('#NHAN_XET').val(),
                THEM: $('#THEM').val(),
                SO_GIO_LUY_KE: $('#SO_GIO_LUY_KE').val(),
            };
            $.ajax({
                type: "POST",
                url: config.SAVE_MONITORING,
                data: {
                    model: model,
                    msmay: $('#MS_MAY').val(),
                    jsonData: JSON.stringify(lstParameter)
                },
                success: function (response) {
                    if (response.responseCode == 1) {
                        showSuccess(response.responseMessage)
                        if (window.location.href.indexOf("flag=0") !== -1) {
                            window.location.href = window.location.href.replace("flag=0", "flag=1").replace("msgstt=-1", "msgstt=" + response.data + "");
                        }
                    }
                    else {
                        showWarning(response.responseMessage)
                    }
                }
            });

        });

        $('#btnhuy').on('click', function () {
            GetMoningToring();
        });

        $('input[type=radio][name=flexRadioDefault]').change(function () {
            GetMoningToring();
        });
        bload = true;
        GetMoningToring();

    }

    function GetMoningToring() {
        if (bload == false) return;
        showLoadingOverlay(contentDataList);
        $.ajax({
            type: "GET",
            url: config.GET_MONITORING_LIST,
            data: {
                msmay: $('#MS_MAY').val(),
                isDue: $('input[name = "flexRadioDefault"]:checked').val(),
                stt: $('#STT').val(),
            },
            success: function (response) {
                $(contentDataList).html(response);
            },
            complete: function () {
                hideLoadingOverlay(contentDataList);
            }
        });
    }

    function SaveMor() {
        var lstParameter = new Array();
        var cur_length = 0;
        $("#accordionFlushExample table").each(function () {
            $(this).find('tr input[type=checkbox]:checked').each(function (i, obj) {
                lstParameter[cur_length] = new Object();
                lstParameter[cur_length].DeviceID = $('#MS_MAY').val(),
                    lstParameter[cur_length].MonitoringParamsID = $(obj).attr('data-msthongso');
                lstParameter[cur_length].ComponentID = $(obj).attr('data-msbophan');
                lstParameter[cur_length].TypeOfParam = 1;
                lstParameter[cur_length].ID = 1;
                lstParameter[cur_length].ValueParamID = $(obj).attr('data-id');
                lstParameter[cur_length].Measurement = 1;
                lstParameter[cur_length].Note = $(obj).closest('tr').find('#note').val();
                lstParameter[cur_length].DUONG_DAN = $(obj).closest('.accordion-item.border-0.break-line').find('[data-com="' + $(obj).attr('data-msbophan') + '"][data-mor="' + $(obj).attr('data-msthongso') + '"]').attr('data-pat');
                cur_length = cur_length + 1;
            })
            $(this).find('tr input[type=number]').each(function (i, obj) {
                if ($(obj).val() !== '') {
                    lstParameter[cur_length] = new Object();
                    lstParameter[cur_length].DeviceID = $('#MS_MAY').val(),
                        lstParameter[cur_length].MonitoringParamsID = $(obj).attr('data-msthongso');
                    lstParameter[cur_length].ComponentID = $(obj).attr('data-msbophan');
                    lstParameter[cur_length].TypeOfParam = 0;
                    lstParameter[cur_length].ValueParamID = -1;
                    var data = JSON.parse($(obj).attr('data-range'));
                    var j = 0;
                    for (j = 0; j < data.length; j++) {
                        if (parseFloat(data[j].GiaTriTren) >= parseFloat($(obj).val()) && parseFloat($(obj).val()) >= parseFloat(data[j].GiaTriDuoi)) {
                            lstParameter[cur_length].ID = data[j].ID
                            break;
                        }
                    }
                    lstParameter[cur_length].Measurement = $(obj).val();
                    lstParameter[cur_length].Note = $(obj).closest('tr').find('#note').val();
                    lstParameter[cur_length].DUONG_DAN = $(obj).closest('.accordion-item.border-0.break-line').find('[data-com="' + $(obj).attr('data-msbophan') + '"][data-mor="' + $(obj).attr('data-msthongso') + '"]').attr('data-pat');
                    cur_length = cur_length + 1;
                }
            })
        })
        if (cur_length < $("#accordionFlushExample table").length) {
            ShowThongBao("Còn thông số giám sát chưa được giám sát!", 'warning');
            return false;
        }
        let model = {
            STT: $('#STT').val(),
            SO_PHIEU: $('#SO_PHIEU').val(),
            NGAY_KH: $('#NGAY_KH').val(),
            MUC_UU_TIEN: $('#cboUuTien').val(),
            NHAN_XET: $('#NHAN_XET').val(),
            THEM: $('#THEM').val(),
        };
        $.ajax({
            type: "POST",
            url: config.SAVE_MONITORING,
            data: {
                model: model,
                msmay: $('#MS_MAY').val(),
                jsonData: JSON.stringify(lstParameter)
            },
            success: function (response) {
                if (response.responseCode == 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
        });
    }

    function ChonNguoiThucHien() {
        $.ajax({
            type: "POST",
            url: config.ADD_NGUOI_THUC_HIEN,
            data: {
                stt: $('#STT').val(),
                gstt: $('#SO_PHIEU').val(),
                msmay: $('#MS_MAY').val(),
            },
            success: function (response) {
                $('#modalLarge .modal-content').html(response);
                $('#modalLarge').modal('show');
            }
        });
    }

    function ShowThoigianChaymay() {
        $.ajax({
            type: "GET",
            url: config.SHOW_TG_CHAY_MAY,
            data: {
                msmay: $('#MS_MAY').val(),
            },
            success: function (response) {
                $('#modalLarge .modal-content').html(response);
                $('#modalLarge').modal('show');
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
                stt: $('#STT').val(),
                json: JSON.stringify(CNList)
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
    }

    function saveComplete() {

        showLoadingOverlay("#inputCauseOfDamageContent");
        $.ajax({
            type: "POST",
            url: config.COMPLETED,
            data: {
                stt: $('#STT').val(),
                msmay: $('#MS_MAY').val(),
            },
            success: function (response) {
                if (response.responseCode == 1) {
                    showSuccess(response.responseMessage)
                    window.location.href = config.MyEcomaint;
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


    return {
        init: init
    };

})(window, jQuery, config);

