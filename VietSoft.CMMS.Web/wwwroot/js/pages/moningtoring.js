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

        initEvent();
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


    //---------------------Nhan start-----------------------

    function initEvent() {

        $(document).on("keyup", '#search', function () {
            clearTimeout(delayTimer)
            delayTimer = setTimeout(function () {
                GetCauseOfDamageList()
            }, 1000)
        })

        $('#btnViewCauseOfDamage').on('click', function () {
            GetViewCauseOfDamage();
        });

        $(document).on("click", '#btnCompletePBT', function () {
            GetInputCauseOfDamage();
        });

        $(document).on("click", '.expand', function () {
            $('ul', $(this).parent()).eq(0).toggle();
        })

        $(document).on("click", '.form-check-input', function () {
            var isChecked = false
            if ($(this).is(":checked")) {
                isChecked = true
            }
            $(this).closest('li').find('ul input:checkbox').prop('checked', isChecked)
        })

        $('#logWork').on('click', function () {
            LogWork();
        });
    }

    function GetInputCauseOfDamage() {
        showLoadingOverlay("#inputCauseOfDamageContent");
        $.ajax({
            type: "GET",
            url: config.GET_INPUT_CAUSE_OF_DAMAGE,
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
            success: function (response) {
                if (response.responseCode == 1) {
                    $("#inputCauseOfDamageContent").html("");
                    var parent = {
                        itemName: 'Ket truc',
                        itemCode: '01.03.05',
                        amount: 5,
                        childs:
                            [
                                {
                                    itemName: 'Thieu boi tron',
                                    childs: [
                                        {
                                            itemName: 'Tra dau',
                                            amount: 5
                                        },
                                        {
                                            itemName: 'Boi mo',
                                            amount: 5,
                                        }
                                    ]
                                },
                                {
                                    itemName: 'Ket di vat',
                                    childs: [
                                        {
                                            itemName: 'Loai bo di vat',
                                            amount: 5,
                                        },
                                        {
                                            itemName: 'dieu chinh khe ngan',
                                            amount: 5,
                                        }
                                    ]
                                }
                            ]
                    }
                    var troot = document.createElement("ul");
                    treeMenuForInput(parent, troot, 0);
                    $('#inputCauseOfDamageContent').append(troot)
                }
            },
            complete: function () {
                hideLoadingOverlay("#inputCauseOfDamageContent");
            }
        });
    }

    function GetCauseOfDamageList() {
        showLoadingOverlay("#resultContent");
        $.ajax({
            type: "GET",
            url: config.GET_CAUSE_OF_DAMAGE_LIST,
            data: {
                keyword: $('#search').val()
            },
            success: function (response) {
                if (response.responseCode == 1) {
                    $("#resultContent").html("");
                    var parent = {
                        itemName: 'Ket truc',
                        itemCode: '01.03.05',
                        amount: 5,
                        childs:
                            [
                                {
                                    itemName: 'Thieu boi tron',
                                    childs: [
                                        {
                                            itemName: 'Tra dau',
                                            amount: 5
                                        },
                                        {
                                            itemName: 'Boi mo',
                                            amount: 5,
                                        }
                                    ]
                                },
                                {
                                    itemName: 'Ket di vat',
                                    childs: [
                                        {
                                            itemName: 'Loai bo di vat',
                                            amount: 5,
                                        },
                                        {
                                            itemName: 'dieu chinh khe ngan',
                                            amount: 5,
                                        }
                                    ]
                                }
                            ]
                    }
                    var troot = document.createElement("ul");
                    treeMenu(parent, troot, 0);
                    $('#resultContent').append(troot)
                }
            },
            complete: function () {
                hideLoadingOverlay("#resultContent");
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
        sib.innerHTML = `<div class="expand pt-1" ` + (childs ? 'style="cursor: pointer"' : '') + `>
            <i class="` + icon + `"></i>
            <span>`+ (parent.itemCode ? parent.itemCode : '') + `</span>
            <span class=`+ color +`>`+ parent.itemName + `</span>
            <span> &emsp;&emsp;`+ (parent.amount ? parent.amount : '') +`</span>
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
            <div class="expand pt-1" ` + (childs ? 'style="cursor: pointer"' : '') + `>
            <i class="` + icon + `"></i>
            <span>`+ (parent.itemCode ? parent.itemCode : '') + `</span>
            <span class=`+ color + `>` + parent.itemName + `</span>
            </div>
                <div class="mx-3 my-1"><input class="form-check-input" type="checkbox" ></div>
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
            },
            complete: function () {
                hideLoadingOverlay("#resultContent");
            }
        });
    }

    function LogWork() {
        $.ajax({
            type: "GET",
            url: config.LOG_WORK,
            success: function (response) {
                $('#modalLarge .modal-content').html(response);
                $('#modalLarge').modal('show');
            },
            complete: function () {
                hideLoadingOverlay("#resultContent");
            }
        });
    }

    //---------------------Nhan end-----------------------

    return {
        init: init
    };

})(window, jQuery, config);

