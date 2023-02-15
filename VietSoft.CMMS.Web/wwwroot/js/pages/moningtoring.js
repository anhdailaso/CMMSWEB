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

        $('#btnhuyBT').on('click', function () {
            WorkList();
        });

        $('input[type=radio][name=flexRadioDefault]').change(function () {
            GetMoningToring();
        });

        $('#cboLoaiBaoTri').val($('#MS_LOAI_BT').val()).change();
        $('#cboUuTien').val($('#MS_UU_TIEN').val()).change();
        if ($('#flag').val() == 1) {
            $("#cboLoaiBaoTri").prop("disabled", true);
            $('span [role=combobox]').css('background-color', '#FFFFFF');
        }

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


    function initEvent() {
        CalculatePlanDate()

        $(document).on("change", '#cboUuTien', function () {
            CalculatePlanDate();
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

        $(document).on("change", '#inputCauseOfDamageContent input:checkbox', function () {
            if ($("#inputCauseOfDamageContent input:checkbox:checked").length > 0) {
                $("#btnSaveInputCauseOfDamageList").removeClass("disabled");
            }
            else {
                $("#btnSaveInputCauseOfDamageList").addClass("disabled");
            }
        })

        $('#btnViewCauseOfDamage').on('click', function () {
            GetViewCauseOfDamage();
        });

        // confirm save workorder
        $(document).on('click', '#btnYes', function () {
            saveCompleteWorkOrder();
            $('#modal').modal('hide');
        })
        $(document).on('click', '#btnNo', function () {
            $('#modal').modal('hide');
        })

        $(document).on("click", '#btnCompletePBT', function () {
            ShowConfirmModal(config.MESS_XACNHAN_HOANTHANH_PHIEUBAOTRI);           
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

        $(document).on("click", '.btnAddSupplies', function () {
            let suppliesSelected = [];
            $(this).closest('.table-responsive').find('table.tbl-supplies tbody tr').each(function () {
                let mspt = $(this).find('td').eq(0).text();
                suppliesSelected.push(mspt) 
            })
            let dept = $(this).data('dept')
            let mscv = $(this).data('mscv')
            AddSupplies(dept, suppliesSelected , mscv);
        });
        
        $(document).on("click", '#btnAddSupplies', function () {
            let rowdata = $(this).closest('.modal-content').find('.modal-body table.tblAddSuppliesSeleced tbody tr.tr-supplies')
            
            $(rowdata).find('input:checkbox:checked').each(function () {
                let mspt = $(this).closest('tr').find("td").eq(0).text();
                let msvt = $(this).closest('tr').find("td").eq(1).text()
                let sl = $(this).closest('tr').find("td").eq(2).text()
                let rowId = `#flush-collapse-` + $('#MS_CV').val()
                
                let html = ` <tr>
                                    <td class="w-40" style="line-height:2.3rem">`+ mspt + `</td>
                                    <td class="w-25" style="line-height:2.3rem">`+ msvt +`</td>
                                    <td class="w-25"> <input class="form-control" style="font-size:0.8rem;" type="text" value="`+ sl +`" placeholder="số lượng" /></td>
                                    <td class="w-10">
                                        <p class="mt-3"><a class="remove-row" ><i class="bi bi-trash icon-danger"></i></a></p>
                                    </td>
                            </tr>`
                $(rowId).find('table tbody').append(html)
            });
            $('#modalLarge').modal('hide');
        })

        $(document).on("click", '#btnSaveWorkOrder', function () {
            let model = {
                MS_PHIEU_BAO_TRI: $('#MS_PHIEU_BAO_TRI').val(),
                S_NGAY_KT_KH: $('#NGAY_KT_KH').text(),
                MS_UU_TIEN: $('#cboUuTien').val(),
                TINH_TRANG_MAY: $('#TINH_TRANG_MAY').val(),
                MS_LOAI_BT: $('#cboLoaiBaoTri').val()
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
                            window.location.href = config.MyEcomaint;
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
                    model: model
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
            let suppliesList = [];
            let msbp = $(this).closest('div').find('input.MS_BO_PHAN').val();
            let mscv = $(this).closest('div').find('input.MS_CV').val();
            $(this).parents('.table-responsive').find('table.tbl-supplies tr').each(function () {
                let mspt = $(this).find('td').eq(0).text()
                let msvt = $(this).find('td').eq(1).text()
                let sl = $(this).find('td').eq(2).find('input').val()
               
                let obj = {
                    MS_PT: mspt,
                    MS_VI_TRI_PT: msvt,
                    SL_KH: sl,
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
        });

        $(document).on('click', '#btnSaveLogWork', function () {
            let logworkList = []
            $(this).closest('.modal').find('.modal-body table#tblLogWork tr').each(function () {
                let valFromDate = $(this).find('input.fromDate').val();
                let valToDate = $(this).find('input.toDate').val();
              
                let times = $(this).find('td').eq(2).find('p').text()
                let mscn = $(this).find('td').eq(3).text()
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
                                    <input style="border-radius: 0 !important" type="text" class="form-control-bottom form-control fromDate" autocomplete="off"/>
                                </div>
                            </td>
                            <td style="width:45%">
                                 <div class="form-floating input-group date" >
                                    <input type="text" style="border-radius: 0 !important" class="form-control form-control-bottom toDate" autocomplete="off"/>
                                </div>
                            </td>
                            <td style="width:5%">
                              <p class="text-orange mt-3 hours"> 0</p>
                            </td>
                             <td style="width:5%"> 
                               <p class="mt-3"><a class="remove-row" ><i class="bi bi-trash icon-danger"></i></a></p>
                            </td>
                        </tr>`
           
            $('#tblLogWork tbody').prepend(html)
            setDateTimePicker('.fromDate', moment(new Date(), _formatDateTime).toDate())
            setDateTimePicker('.toDate', moment(new Date(), _formatDateTime).toDate())
        });

        $(document).on("dp.change", '.fromDate, .toDate', function () {
            let valFromDate = $(this).closest('tr').find('input.fromDate').val();
            let valToDate = $(this).closest('tr').find('input.toDate').val();
           
            let fromDate = moment(valFromDate, _formatDateTime).toDate();
            let toDate = moment(valToDate, _formatDateTime).toDate();

            let diffTime = getDiffTimes(fromDate, toDate)
            let hours = diffTime > 0 ? diffTime : 0
            $(this).closest('tr').find("p.hours").text(Math.round(hours * 100) / 100)
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
                    showSuccess(response.responseMessage)
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
                        let html = `<span>` + config.KHONGCO_DULIEU +`</span>`
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
            <span class=`+ color +`>`+ parent.itemName + `</span>
            <span> &emsp;`+ (parent.amount ? parent.amount : '') +`</span>
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
                <div class="mx-3 my-1"><input class="form-check-input" type="checkbox" data-key=`+ parent.key+`></div>
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
                ticketId: $('#MS_PHIEU_BAO_TRI').val()
            },
            success: function (response) {
                $('#modalLarge .modal-content').html(response);
                $('#modalLarge').modal('show');
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
                $('#modalLarge .modal-content').html(response);
                $('#modalLarge').modal('show');
            }
        });
    }

    function CalculatePlanDate() {
        let songay = $('#cboUuTien').find(":selected").data('songay')
        if (songay != undefined) {
            let date = moment($('#currentDate').val(), _formatDate).toDate();
            let a = date.setDate(date.getDate() + songay)
            $('#NGAY_KT_KH').text(moment(a).format(_formatDate))
        }
    }

    return {
        init: init
    };

})(window, jQuery, config);

