var UserRequestModule = UserRequestModule || (function (window, $, config) {
    var loai;
    function init() {
        $(document).ready(function () {
            var auctionImages = null;
            var imagesloader = $('[data-type=imagesloader]').imagesloader({
                maxFiles: 4
                , minSelect: 1
                , imagesToLoad: auctionImages
            });
        });
        console.log($('#flag').val());
        if ($('#flag').val() == 1 && $('#EDIT').val() == 0) {
            $("#MO_TA_TINH_TRANG").prop("disabled", true);
            $("#MO_TA_TINH_TRANG").css('background-color', '#FFFFFF');
            $("#YEU_CAU").prop("disabled", true);
            $("#YEU_CAU").css('background-color', '#FFFFFF');

            $('#cboMucdo').prop("disabled", true);
            $("#cboNguyennhan").prop("disabled", true);

            $("#HONG").prop("disabled", true);

            $("#NGAY_XAY_RA").prop("disabled", true);
            $("#NGAY_XAY_RA").css('background-color', '#FFFFFF');

            $('span [role=combobox]').css('background-color', '#FFFFFF');

        }

        if ($('#flag').val() == 0) {
            $("#cboMucdo").val(2).change();
        }
        //setDatePicker("#NGAY_XAY_RA", null, null, null);
        setDateTimePicker('#NGAY_XAY_RA', moment(new Date(), _formatDateTime).toDate())

        $('#HONG').on('change', function () {
            if ($(this).is(":checked")) {
                //$('#NGAY_XAY_RA').val(moment().format('DD/MM/YYYY HH:mm'));
                $("#NGAY_XAY_RA").parent().prop("hidden", false);
                $("#cboMucdo").val(1).change();
            }
            else {
                $("#NGAY_XAY_RA").parent().prop("hidden", true);
                $('#NGAY_XAY_RA').val('');

            }
        })

        $('#btnsave').on('click', function () {
            var input = document.getElementById('files');
            var files = input.files;
            console.log(files)
            var formData = new FormData();

            for (var i = 0; i != files.length; i++) {
                formData.append("files", files[i]);
            }

            var userRequestFormData = GetUserRequestFormData();
            formData.append("data", JSON.stringify(userRequestFormData));

            if ($('#UserRequestForm').valid()) {
                $.ajax({
                    url: config.SAVE_USERREQUEST,
                    type: "POST",
                    data: formData,
                    dataType: 'json',
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response.responseCode == 1) {
                            showSuccess(response.responseMessage)
                            window.location.href = config.MyEcomaint;
                        }
                        else {
                            showWarning(response.responseMessage)
                        }
                    }

                });
            }
            
    });

        $('#btnKhongDuyet').on('click', function () {
            loai = 1;
            $.ajax({
                type: "GET",
                data: {
                    loai: loai,
                    stt: $('#STT').val(),
                    tenmay: $('.emp-code').attr('data-ten'),
                    msmay: $('.emp-name').attr('data-ms'),
                },
                url: config.KHONG_DUYET_YC,
                success: function (response) {
                    $('#modal .modal-content').html(response);
                    $('#modal').modal('show');
                }
            });

        });
        $('#btnKhongTiepNhan').on('click', function () {
            loai = 3;
            $.ajax({
                type: "GET",
                data: {
                    loai: loai,
                    stt: $('#STT').val(),
                    tenmay: $('.emp-code').attr('data-ten'),
                    msmay: $('.emp-name').attr('data-ms'),
                },
                url: config.KHONG_DUYET_YC,
                success: function (response) {
                    $('#modal .modal-content').html(response);
                    $('#modal').modal('show');
                }
            });

        });
        

        $('#btnDuyet').on('click', function () {
            loai = 2;
            $.ajax({
                type: "GET",
                data: {
                    loai: loai,
                    stt: $('#STT').val(),
                    tenmay: $('.emp-code').attr('data-ten'),
                    msmay: $('.emp-name').attr('data-ms'),
                },
                url: config.KHONG_DUYET_YC,
                success: function (response) {
                    $('#modal .modal-content').html(response);
                    $('#modal').modal('show');
                }
            });

        });

        $(document).on('click', '#btnYes', function () {
            if ($('#AcceptUserRequest').valid()) {
                $.ajax({
                    url: config.SAVE_ACCEPT_USERREQUEST,
                    type: "POST",
                    data: $('#AcceptUserRequest').serialize(),
                    success: function (response) {
                        if (response.responseCode == 1) {
                            showSuccess(response.responseMessage);
                            $('#modal').modal('hide');
                            window.location.href = config.MyEcomaint;
                        }
                        else {
                            showWarning(response.responseMessage)
                        }
                    }

                });
            }
        })
        $(document).on('click', '#btnNo', function () {
            $('#modal').modal('hide');
        })


        $('#btnLPBT').on('click', function () {
            //$.ajax({
            //    url: config.CREAT_WORKORDER,
            //    type: "GET",
            //    data: {
            //        msmay: $('.emp-name').attr('data-ms'),
            //        tenmay: $('.emp-code').attr('data-ten'),
            //        flag: 0,
            //        ttmay: $('#MO_TA_TINH_TRANG').val(),
            //        msut :
            //    },
            //    success: function (response) {
            //    }
            //});
            var msmay = $('.emp-name').attr('data-ms');
            var tenmay= $('.emp-code').attr('data-ten');
            var flag= 0;
            var ttmay = $('#MO_TA_TINH_TRANG').val();
            var msut = $('#cboMucdo').val();
            window.location.href = "WorkOrder?msmay=" + msmay + "&tenmay=" + tenmay + "&flag=0&ttmay=" + ttmay + "&flag=0&msut=" + msut;

        });

        //xóa phiếu bảo trì
        $('#btnhuy').on('click', function () {
            ShowConfirm(config.MESS_XOA_YEU_CAU, 'warning', '', function (result) {
                if (result == true) {
                    $.ajax({
                        url: config.DELETE_USER_REQUEST,
                        type: "POST",
                        data: {
                            stt: $('#STT').val()
                        },
                        success: function (response) {
                            if (response.responseCode == 1) {
                                showSuccess(response.responseMessage)
                                window.location.href = config.MyEcomaint;
                            }
                            else {
                                showWarning(response.responseMessage)
                            }
                        }
                    });

                }
            });
        });
    }

    function GetUserRequestFormData() {
        var obj = {
            MS_MAY: $('#MS_MAY').val(),
            DUYET: $('#DUYET').val(),
            MS_UU_TIEN: $('#cboMucdo').val(),
            MS_NGUYEN_NHAN: $('#cboNguyennhan').val(),
            MO_TA_TINH_TRANG: $('#MO_TA_TINH_TRANG').val(),
            YEU_CAU: $('#YEU_CAU').val(),
            STT: $('#STT').val(),
            NGAY_XAY_RA_STR: $('#NGAY_XAY_RA').val(),
            NGUOI_YEU_CAU: $('#NGUOI_YEU_CAU').val(),
            HONG: $('#HONG').is(':checked')
        };
     
        return obj;
    }
    return {
        init: init
    };

})(window, jQuery, config);

