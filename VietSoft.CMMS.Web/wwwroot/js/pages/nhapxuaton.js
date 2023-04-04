var NhapXuatTonModule = NhapXuatTonModule || (function (window, $, config) {
    var contentDataList = "#GetNhapXuatTon";
    var delayTimer;
    var bquyen = false;

    function init() {
        bload = false;
        setDatePicker("#toDate", null, null, null);
        const TNgay = new Date();
        TNgay.setMonth(TNgay.getMonth() - 1);
        setDatePicker("#fromDate", TNgay, null, null);

        $(document).on("dp.change", '#toDate', function () {
            GetBaoCaoNhapXuatTon(1);
        })
        $(document).on("dp.change", '#fromDate', function () {
            GetBaoCaoNhapXuatTon(1);
        })

        $(document).on("change", '#cboPhuTung', function () {
            GetBaoCaoNhapXuatTon(1);
        })

        GetBaoCaoNhapXuatTon();
    }
    function GetBaoCaoNhapXuatTon() {
        showLoadingOverlay(contentDataList);
        $.ajax({
            type: "GET",
            url: config.GET_NHAPXUATTON,
            data: {
                tungay: $('#fromDate').val(),
                denngay: $('#toDate').val(),
                mspt: $('#cboPhuTung').val(),
                mskho: $('#cbokho').val(),
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

