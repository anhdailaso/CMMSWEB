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

        WorkList();
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

        $(document).on("click", '.btnAddSupplies', function () {
            let dept = $(this).data('dept')
            let suppliesSelected = $(this).data('supplies')
            let mscv = $(this).data('mscv')
            AddSupplies(dept, suppliesSelected, mscv);
        });

        
        $(document).on("click", '#btnAddSupplies', function () {
            let rowdata = $(this).closest('.modal-content').find('.modal-body table tbody tr.tr-supplies.tr-supplies-active')
            let mspt = rowdata.find("td").eq(0).text();
            let msvt = rowdata.find("td").eq(1).text()
            let sl = rowdata.find("td").eq(2).text()
            let rowId = `#flush-collapse-` + $('#MS_CV').val()
            $('#modalLarge').modal('hide');
            let html = ` <tr>
                                <td class="w-40" style="line-height:2.3rem">`+ mspt + `</td>
                                <td class="w-25" style="line-height:2.3rem">`+ msvt +`</td>
                                <td class="w-25"> <input class="form-control" style="font-size:0.8rem;" type="text" value="`+ sl +`" placeholder="số lượng" /></td>
                                <td class="w-10"> 
                                    <p class="mt-3"><a class="remove-row" ><i class="bi bi-trash icon-danger"></i></a></p>
                                </td>
                        </tr>`
            $(rowId).find('table tbody').append(html)
        })

        $(document).on("click", '#btnAddWorkList', function () {
            $('input:checkbox.input-add-work:checked').each(function () {
                let mscv = $(this).data('ms-cviec')
                let msbophan = $(this).data('ms-bophan')
                let motacv = $(this).closest('tr').find("td").eq(1).text()
                let html = `<div class="accordion border-0 break-line" id="accordionFlushExample-`+ mscv +`">
                <div class="accordion-item border-0 break-line">
                    <h2 class="accordion-header" id="flush-heading-`+ mscv +`">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse-`+ mscv + `" aria-expanded="false" aria-controls="flush-collapse-` + mscv +`" title="Bạc đạn">
                            + `+ msbophan + `&nbsp`+ motacv + `
                        </button>
                    </h2>
                    <div id="flush-collapse-`+ mscv +`" class="accordion-collapse collapse" aria-labelledby="flush-heading-`+ mscv +`" data-bs-parent="#accordionFlushExample-`+ mscv +`">
                        <div class="table-responsive">
                            <table class="table table-responsive table-borderless">
                                <tbody>
                           
                                </tbody>
                            </table>

                            <div class="d-flex flex-row-reverse">
                                <div>
                                    <a class="btn btn-outline-warning m-1 btnSaveSupplies" style="width:auto" href="#!" role="button">
                                        <i class="fa fa-floppy-o fs-7"></i>
                                    </a>
                                </div>
                                <div>
                                    <a class="btn btn-outline-primary m-1  btnAddSupplies" data-dept=`+ msbophan + ` data-mscv=` + mscv +` style="width:auto" href="#!" role="button">
                                        <i class="fa fa-plus fs-7"></i>
                                    </a>
                                </div>
                            </div>


                        </div>


                    </div>
                </div>
                </div>`
                $('#workListContent').append(html);
                $('#modalLarge').modal('hide');
            });
        });

        $(document).on("click", '.tr-supplies', function () {
            $(this).closest('table').find('tr.tr-supplies.tr-supplies-active').removeClass('tr-supplies-active')
            $(this).addClass('tr-supplies-active')
        });
        
        $('#logWork').on('click', function () {
            LogWork();
        });

        $(document).on("click", '#btnAddMaintenanceWork', function () {
            AddMaintenanceWork()
        });
        $(document).on("click", '.remove-row', function () {
            $(this).closest("tr").remove();
        });
        
        $(document).on("click", '#btnAddRowLogWork', function () {
            let html = `<tr >
                            <td style="width:45%">
                                <div class="form-floating input-group date">
                                    <input style="border-radius: 0 !important" type="text" class="form-control-bottom form-control fromDate" data-date-format="HH:mm DD/MM/YYYY" autocomplete="off"/>
                                </div>
                            </td>
                            <td style="width:45%">
                                 <div class="form-floating input-group date" >
                                    <input type="text" style="border-radius: 0 !important" class="form-control form-control-bottom toDate" data-date-format="HH:mm DD/MM/YYYY" autocomplete="off"/>
                                </div>
                            </td>
                            <td style="width:5%">
                              <p class="text-orange mt-3"> 0</p>
                            </td>
                             <td style="width:5%"> 
                               <p class="mt-3"><a class="remove-row" ><i class="bi bi-trash icon-danger"></i></a></p>
                            </td>
                        </tr>`
           
            $('#tblLogWork tbody').prepend(html)
            setDateTimePicker('.fromDate', new Date())
            setDateTimePicker('.toDate', new Date())
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
            data: {
                deviceId: $('#MS_MAY').val(),
                ticketId: $('#MS_PHIEU_BAO_TRI').val()
            },
            success: function (response) {
                if (response.responseCode == 1) {
                    $("#inputCauseOfDamageContent").html("");
                    if (response.data[0]) {
                        var troot = document.createElement("ul");
                        treeMenuForInput(response.data[0], troot, 0);
                        $('#inputCauseOfDamageContent').append(troot)
                    }
                    else {
                        let html = `<span>` + config.KHONGCO_DULIEU + `</span>`
                        $('#inputCauseOfDamageContent').append(html)
                    }
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
                keyword: $('#search').val(),
                deviceId: $('#MS_MAY').val()
            },
            success: function (response) {
                if (response.responseCode == 1) {
                    $("#resultContent").html("");
                    if (response.data[0]) {
                        var troot = document.createElement("ul");
                        treeMenu(response.data[0], troot, 0);
                        $('#resultContent').append(troot)
                    }
                    else {
                        let html = `<span>` + config.KHONGCO_DULIEU +`</span>`
                        $('#resultContent').append(html)
                    }
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
        sib.innerHTML = `<div class="expand pt-2" ` + (childs ? 'style="cursor: pointer"' : '') + `>
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
            <div class="expand pt-2" ` + (childs ? 'style="cursor: pointer"' : '') + `>
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

    function WorkList() {
        showLoadingOverlay("#workListContent");
        $.ajax({
            type: "GET",
            url: config.GET_WORK_LIST,
            data: {
                deviceId: $('#MS_MAY').val(),
                ticketId: $('#MS_PHIEU_BAO_TRI').val()
            },
            success: function (response) {
                $('#workListContent').html(response);
            },
            complete: function () {
                hideLoadingOverlay("#workListContent");
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
                workId: mscv
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
                deviceId: $('#MS_MAY').val()
            },
            success: function (response) {
                $('#modalLarge .modal-content').html(response);
                $('#modalLarge').modal('show');
            }
        });
    }

    //---------------------Nhan end-----------------------

    return {
        init: init
    };

})(window, jQuery, config);

