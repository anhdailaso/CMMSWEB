$(function () {
    // Toast
    $('.toast').toast({ delay: 4000 });
});


function showRelevantPopUp(popup) {
    if (popup && popup.status && popup.message) {
        switch (popup.status) {
            case "success":
                return showSuccess(popup.message);
            case "error":
                return showWarning(popup.message, popup.isPlaySound);
            case "warning":
                return showWarning(popup.message, popup.isPlaySound);
        }
    }

    //// clear all message in session
    //$.post("/Base/ClearMessage", function (data) {
    //    console.log('clear success');
    //});

    return null;
}

function showSuccess(message) {
    $('#toastSuccess .toast-body').text(message);
    $('#toastSuccess').toast('show');
}

function showWarning(message, isPlaySound = true) {
    $('#toastWarning .toast-body').text(message);
    $('#toastWarning').toast('show');
}