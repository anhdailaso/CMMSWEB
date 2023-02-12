var ScannerModule = ScannerModule || (function () {
    const html5QrCode = new Html5Qrcode(/* element id */ "reader");
    async function GetCamera() {
        var cameraId
        // This method will trigger user permissions
        cameraId = await Html5Qrcode.getCameras().then(devices => {
            /**
             * devices would be an array of objects of type:
             * { id: "id", label: "label" }
             */
            if (devices && devices.length) {
                return devices[0].id;
                // .. use this to start scanning.

            }
        }).catch(err => {
            // handle err
        });
        return cameraId;
    }

    function StartCamera(cameraId) {
        html5QrCode.start(
            /*   cameraId,*/
            { facingMode: { exact: "environment" } }, //back camera: facingMode: { exact: "environment" } } //front camera: { facingMode: "user" }
            {
                fps: 20,    // Optional, frame per seconds for qr code scanning
                /*qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI*/
                aspectRatio: 1.777778,
                focusMode: "continuous"
            },
            (decodedText, decodedResult) => {
                // do something when code is read
                console.log('decodedText ', decodedText)
                console.log('decodedResult ', decodedResult)
                //$('#cboMaBoPhan').val(decodedText).change();
                $('.scanner-input-active').val(decodedText).change();
                $('#modalCameraScanner').modal('hide');
                $('.form-control').removeClass('scanner-input-active');
                StopCamera();
            },
            (errorMessage) => {
                console.log(errorMessage)
                if ($('#modalCameraScanner').is(":hidden")) {
                    StopCamera();
                }
            }
        )
            .catch((err) => {
                // Start failed, handle it.
                StopCamera()
            });
    }

    function StopCamera() {
        if (html5QrCode.localMediaStream) {
            html5QrCode.stop().then((ignore) => {
                html5QrCode.clear();
                // QR Code scanning is stopped.
            }).catch((err) => {
                // Stop failed, handle it.
            });
        }
    }

    function init() {
        const fileScaner = document.getElementById('qr-input-file');
        fileScaner.addEventListener('change', e => {
            console.log(e.target.files.length);
            if (e.target.files.length == 0) {
                // No file selected, ignore
                return;
            }

            const imageFile = e.target.files[0];
            console.log(imageFile);
            //Scan QR Code
            html5QrCode.scanFile(imageFile, true)
                .then((decodedText, decodedResult) => {
                    // success, use decodedText
                    console.log(decodedText);
                    console.log(decodedResult);
                    $('.scanner-input-active').val(decodedText).change();
                    $('#modalCameraScanner').modal('hide');
                    $('.form-control').removeClass('scanner-input-active');
                    StopCamera();
                })
                .catch(err => {
                    // failure, handle it.
                    console.log(`Error scanning file. Reason: ${err}`)
                    if ($('#modalCameraScanner').is(":hidden")) {
                        StopCamera();
                    };
                });
        })
    }


    return {
        GetCamera: GetCamera,
        StartCamera: StartCamera,
        StopCamera: StopCamera,
        init: init
    };

})(window, jQuery);






