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
            console.log($('#UserRequestForm').method);
            if ($('#UserRequestForm').valid()) {
                $.ajax({
                    url: config.SAVE_USERREQUEST,
                    type: "POST",
                    data: $('#UserRequestForm').serialize(),
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

    }
    return {
        init: init
    };

})(window, jQuery, config);

