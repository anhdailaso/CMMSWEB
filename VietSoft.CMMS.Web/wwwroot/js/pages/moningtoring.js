var MoningToringModule = MoningToringModule || (function (window, $, config) {
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

        $('#chkanct').on('change', function () {
            if ($(this).is(":checked")) {
                $('.accordion-collapse.collapse').removeClass('show');
            }
            else {
                $('.accordion-collapse.collapse').addClass('show');
            }
        })
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
                    cur_length = cur_length + 1;
                })

                $(this).find('tr input[type=text]:not([value=""])').each(function (i, obj) {
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
                        cur_length = cur_length + 1;
                    }
                })

            }
            )
            console.log(lstParameter);
            if (cur_length === 0) {
                showWarning("Vui lòng chọn dữ liệu");
                return;
            }
            $.ajax({
                type: "POST",
                url: config.SAVE_MONITORING,
                data: { jsonData: JSON.stringify(lstParameter) },
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
                isDue: $('input[name = "flexRadioDefault"]:checked').val()
            },
            success: function (response) {
                $(contentDataList).html(response);
            },
            complete: function () {
                hideLoadingOverlay(contentDataList);
            }
        });
    }




    return {
        init: init
    };

})(window, jQuery, config);

