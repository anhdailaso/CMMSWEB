var UserRequestModule = UserRequestModule || (function (window, $, config) {
    function init() {
        $(document).ready(function () {
            var auctionImages = null;
            var imagesloader = $('[data-type=imagesloader]').imagesloader({
                maxFiles: 4
                , minSelect: 1
                , imagesToLoad: auctionImages
            });
        });

        if ($('#flag').val() == 1) {
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
        setDatePicker("#NGAY_XAY_RA", null, null, null);

        $('#HONG').on('change', function () {
            if ($(this).is(":checked")) {
                $('#NGAY_XAY_RA').val(moment().format('DD/MM/YYYY'));
                $("#NGAY_XAY_RA").parent().prop("hidden", false);
            }
            else {
                $("#NGAY_XAY_RA").parent().prop("hidden", true);
                $('#NGAY_XAY_RA').val('');

            }
        })

        $('#btnsave').on('click', function () {
            var input = document.getElementById('files');
            var files = input.files;
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

        $('#btnLPBT').on('click', function () {
            $.ajax({
                url: config.CREAT_WORKORDER,
                type: "GET",
                data: {
                    msmay: $('.emp-name').attr('data-ms'),
                    tenmay: $('.emp-code').attr('data-ten'),
                    flag: 0,
                    ttmay: $('#MO_TA_TINH_TRANG').val()
                },
                success: function (response) {
                }
            });
            var msmay = $('.emp-name').attr('data-ms');
            var tenmay= $('.emp-code').attr('data-ten');
            var flag= 0;
            var ttmay= $('#MO_TA_TINH_TRANG').val();

            window.location.href = "WorkOrder?msmay=" + msmay + "&tenmay=" + tenmay+"&flag=0&ttmay=" + ttmay;

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

