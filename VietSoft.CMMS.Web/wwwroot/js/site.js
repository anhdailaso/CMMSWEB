var _formatDateTime = 'DD/MM/YYYY HH:mm';
var _formatDate = 'DD/MM/YYYY';
var _formatDate = 'DD/MM/YYYY';
var _notifyTimeout = 3000;

$(function () {
    var file;
    var importfile = $('#fileToUploadavt');
    $('#btnXoaHinhavt').click(function () {
        file = null;
        $('#imgavt').attr('src', '');
    });
    $('#btnLuuHinhavt').click(function () {
        $('.avatar').attr('src', $('#imgavt').attr('src'));
        console.log($('#imgavt').attr('src'));
        var fdata = new FormData();
        console.log(file);
        fdata.append('image', file);
        $.ajax({
            type: "POST",
            data: fdata,
            processData: false,
            contentType: false,
            url: '/Home/SaveImageAvatar',
            success: function (response) {
                if (response.responseCode == 1) {
                    showSuccess(response.responseMessage);
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
    $('#btnChonHinhavt').click(function () {
        importfile.click();

    });

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

    function uploadImgDisplay(curFile) {
        var fileURL = window.URL.createObjectURL(curFile);
        $('#imgavt').attr('src', fileURL);
    }


    $.ajaxSetup({
        cache: false
    });

    $(document).on("ajaxStart", function () {

    }).on("ajaxStop", function () {

    }).on("ajaxComplete", (event, jqxhr, options) => {
        let jsonHeader = jqxhr.getResponseHeader("X-Responded-JSON");
        if (jsonHeader) {
            swal({
                title: "Session expiried",
                message: "Your session has been expired, The page will auto redirect to login page"
            }, () => {
                window.location.reload();
            });
        }
    }).on("ajaxError", function (event, jqxhr, settings, thrownError) {
        if (jqxhr.status === 0) return;

        if (jqxhr.status === "401") {
            window.location.reload();
        }
        else if (jqxhr.status === "403") {
            //window.location.href = "/Common/AccessDenied";
        } else {
            // showAlert("error", "Error when retrive data from server (" + thrownError + ")")
        }

    }).on("ajaxSuccess", function () {

    });

    $("a.toggle-status").on("click",
        function () {
            $(this).toggleClass("toggled");
            if ($(this).hasClass("toggled")) {
                $(this).find("i.material-icons").text("keyboard_arrow_up");
                $(".vertical-nav").slideUp("fast");
            } else {
                $(this).find("i.material-icons").text("keyboard_arrow_down");
                $(".vertical-nav").slideDown("fast");
            }
        });

    $('[data-toggle="tooltip"]').on("touchstart", function () {
        $(this).tooltip('show');
    });
    $('[data-toggle="tooltip"]').on("touchmove", function () {
        $('[data-toggle="tooltip"]').tooltip('hide');
    });
    $('[data-toggle="tooltip"]').tooltip();


    $.LoadingOverlaySetup({
        maxSize: "25px",
        minSize: "25px"
    });


    initBootstrapDialog();
    InitSelect2();
});

function InitSelect2() {
    // For Select2 4.1
    $(".form-select-sm").select2({
        theme: "bootstrap-5",
        width: "100%",
        selectionCssClass: "select2--small",
        dropdownCssClass: "select2--small",
    });
}

function showLoadingOverlay(selector) {
    if (selector) {
        $(selector).LoadingOverlay("show");
    } else {
        $.LoadingOverlay("show");
    }
}

function hideLoadingOverlay(selector) {
    if (selector) {
        $(selector).LoadingOverlay("hide");
    } else {
        $.LoadingOverlay("hide");
    }
}

function initBootstrapDialog() {
    $("body").on("click", '[data-bs-toggle="modal"][data-url]', function () {
        let self = $(this);
        let modalUrl = self.data("url");
        let modalTarget = $(self.data("bs-target"));

        showLoadingOverlay();
        modalTarget.find(".modal-content").load(modalUrl, "", function (response, status) {
            if (status === "success") {
                hideLoadingOverlay();
                modalTarget.modal();
                modalTarget.show();
            }
        });
        modalTarget.on("hidden", function () {
            modalTarget.html("");
        });
    });

    $(".modal").on("shown.bs.modal", function () {
    });
    $(".modal").on("hide.bs.modal", function () {
    });
}


function SetActive(e) {
    $(e).closest('.form-floating').find('select').addClass('scanner-input-active');
    $(e).closest('.form-floating').find('input').addClass('scanner-input-active');
/*    console.log($(e).closest('.form-floating').find('select').val());*/
}

$('.disabled').click(function (e) {
    e.preventDefault();
});

function removeSpaceSpecialChar(str) {
    let temp = str.toLowerCase().replace(/\W+/gm, '');
    return temp;
}

function showControlByClass(selector) {
    $(selector).each(function () {
        $(this).show();
        $(this).find("*").prop('disabled', false);
    });
}

function hideControlByClass(selector) {
    $(selector).each(function () {
        $(this).hide();
        $(this).find("*").prop('disabled', true);
    });
}

var UserInfoModule = (function () {

    let userInfo = {
        options: [],
        header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
        dataos: [
            { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
            { name: 'Windows', value: 'Win', version: 'NT' },
            { name: 'iPhone', value: 'iPhone', version: 'OS' },
            { name: 'iPad', value: 'iPad', version: 'OS' },
            { name: 'Kindle', value: 'Silk', version: 'Silk' },
            { name: 'Android', value: 'Android', version: 'Android' },
            { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
            { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
            { name: 'Macintosh', value: 'Mac', version: 'OS X' },
            { name: 'Linux', value: 'Linux', version: 'rv' },
            { name: 'Palm', value: 'Palm', version: 'PalmOS' }
        ],
        databrowser: [
            { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
            { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
            { name: 'Safari', value: 'Safari', version: 'Version' },
            { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
            { name: 'Opera', value: 'Opera', version: 'Opera' },
            { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
            { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
        ],
        init: function () {
            let agent = this.header.join(' '),
                os = this.matchItem(agent, this.dataos),
                browser = this.matchItem(agent, this.databrowser);

            return { os: os, browser: browser };
        },
        matchItem: function (string, data) {
            let i = 0,
                j = 0,
                html = '',
                regex,
                regexv,
                match,
                matches,
                version;

            for (i = 0; i < data.length; i += 1) {
                regex = new RegExp(data[i].value, 'i');
                match = regex.test(string);
                if (match) {
                    regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
                    matches = string.match(regexv);
                    version = '';
                    if (matches) { if (matches[1]) { matches = matches[1]; } }
                    if (matches) {
                        matches = matches.split(/[._]+/);
                        for (j = 0; j < matches.length; j += 1) {
                            if (j === 0) {
                                version += matches[j] + '.';
                            } else {
                                version += matches[j];
                            }
                        }
                    } else {
                        version = '0';
                    }
                    return {
                        name: data[i].name,
                        version: parseFloat(version)
                    };
                }
            }
            return { name: 'unknown', version: 0 };
        }
    };

    function init() {
        return userInfo.init();
    }
    return {
        init: init
    };
})();

function scrollToElement(sender) {
    setTimeout(function () {
        $(sender)[0].scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, 100);
}

function showHideGridScroll(scrollContent, rowCount) {
    if (rowCount > 5) {
        $(scrollContent).addClass('grid-scroll');
    }
    else {
        $(scrollContent).removeClass('grid-scroll');
    }
}

function initTwbsPagination(element, currentPage, totalPages, callback) {
    $(element).twbsPagination({
        startPage: currentPage,
        totalPages: totalPages,
        first: "<i class='bi bi-chevron-double-left'></i>",
        prev: "<i class='bi bi-chevron-left'></i>",
        next: "<i class='bi bi-chevron-right'></i>",
        last: "<i class='bi bi-chevron-double-right'></i>",
        initiateStartPageClick: false,
        onPageClick: function (event, page) {
            callback(page);
        }
    });
}

function getDateFromDateTimepicker(idInput, format = 'DD/MM/YYYY') {
    let datetimepicker = moment(idInput, format);

    return {
        getDate: datetimepicker.utc()
    };
}

function getDiffDays(fromDate, toDate) {
    let date1 = getDateFromDateTimepicker(fromDate).getDate
    let date2 = getDateFromDateTimepicker(toDate).getDate
    let diffTime = Math.abs(date2 - date1)
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
}

function getDiffTimes(fromTime, toTime) {
    let date1 = moment(fromTime, 'LT')
    let date2 = moment(toTime, 'LT')
    return (date2 - date1) / (1000 * 60 * 60)
}

function getHoursAndMinusText(hours) {
    let result = ''
    if (!hours || hours <= 0) {
        return result
    }
    let hoursInt = Math.floor(hours);
    let minus = Math.ceil((hours - hoursInt) * 60)
    result = hoursInt + ':' + minus;
    return result
}

function setMonthYearPicker(idInput, options) {

    options = options || {};
    options.locale = 'vi';
    options.useCurrent = false;
    options.defaultDate = moment(new Date(), 'MM/yyyy');
    options.format = 'MM/yyyy';
    options.viewMode = 'months';
    options.maxDate = 'now';
    $(idInput).datetimepicker(options);
}

//ĐẠT SỬA
function setDatePicker(idInput, options, minDate, maxDate) {
    options = options || {};
    options.locale = 'vi';
    options.useCurrent = false;
    options.defaultDate = moment(options);
    options.format = 'DD/MM/YYYY';
    if (minDate !== null) {
        options.minDate = minDate;
    }
    if (maxDate !== null) {
        options.maxDate = maxDate;
    }
    $(idInput).datetimepicker(options);
    $(idInput).parents(".input-group.date").find(".date-icon").on('click', function () {
        $(idInput).datetimepicker('show');
    })
}

function setDateTimePicker(idInput, options, minDate, maxDate) {
    options = options || {};
    options.locale = 'vi';
    options.useCurrent = false;
    options.defaultDate = options === null ? moment(new Date(), _formatDateTime) : moment(options);
    //options.minDate = moment(new Date(), 'DD/MM/YYYY HH:mm');
    format = _formatDateTime;
    $(idInput).datetimepicker(options);
    $(idInput).parents(".input-group.date").find(".date-icon").on('click', function () {
        $(idInput).datetimepicker('show');
    })
}

function setTimePicker(idInput, options) {

    options = options || {};
    options.useCurrent = false;
    //options.format = 'LT';
    options.format = 'HH:mm';
    //options.enabledHours = [6, 7, 8, 9, 10];
    //options.stepping = 30;
    $(idInput).datetimepicker(options);
};

function checkIsWeekend(date1, date2) {
    let d1 = new Date(date1),
        d2 = new Date(date2),
        isWeekend = false;
    if (d1.getDate() == d2.getDate()) {
        let day = d1.getDay();
        isWeekend = (day === 6) || (day === 0);
        if (isWeekend) { return true; } // return immediately if weekend found
    }
    else {
        while (d1 < d2) {
            let day = d1.getDay();
            isWeekend = (day === 6) || (day === 0);
            if (isWeekend) { return true; } // return immediately if weekend found
            d1.setDate(d1.getDate() + 1);
        }
    }
    return false;
}

function ClosePopup(element) {
    $(element).parents('.modal').modal('hide');
}


function goBack() {
    window.location.href = "/Home/Index";
}

function ShowConfirm (message, type = Type.error, title = '', callback) {
    swal({
        title: title,
        text: message,
        type: type,
        showCancelButton: true,
        confirmButtonColor: '#ea8a1f',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        reverseButtons: true
    }).then(function () {
        callback(true);
    }, function (dismiss) {
        callback(false);
    }).catch(swal.noop);
}

function ShowThongBao(message, type = 'error', title = '') {
    swal({
        title: title,
        text: message,
        type: type,
        confirmButtonColor: '#ea8a1f',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        reverseButtons: true
    });
}


function ShowConfirmModal(message) {
    $.ajax({
        type: "GET",
        data: {
            message: message
        },
        url: "/Home/ShowConfirmModal",
        success: function (response) {
            $('#modal .modal-content').html(response);
            $('#modal').modal('show');
        }
    });
}