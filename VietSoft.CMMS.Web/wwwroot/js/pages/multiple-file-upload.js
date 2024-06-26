﻿var MultipleFileUploadModule = MultipleFileUploadModule || (function () {
    function init() {
        var dtFiles = new DataTransfer()

        $('#files').change(function (e) {           
            $(e.target.files).each(function () {
                var file = this
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                if (file.type.split('/')[0] === 'image') {
                    $('.error').remove();
                    fileReader.onload = function (e) {
                        let src = e.target.result

                        let html = ` 
                          <div class="col-4 pl-2 pr-2 pt-2 image-model" style="max-width:200px;">
                                <div class="remove-image" data-image-name="`+ file.name + `"><i class="fa fa-times" aria-hidden="true"></i></div>
                                
                                <div class="ratio-box text-center image-ratio-box" data-type="image-ratio-box">
                                    <div data-type="loading" class="img-loading" style="color:#218838; display:none;">
                                      <span class="fa fa-2x fa-spin fa-spinner"></span>
                                    </div>
                                    <img data-type="preview" class="btn btn-light ratio-img img-fluid p-2 image border dashed rounded" src="`+ src + `" style="cursor: default;">
                                  </div>
                        </div>
                        `
                        $('#filesContent').find('.row').append(html)
                    }

                    dtFiles.items.add(file)
                }
                else {

                    let html = `<span class="error">Không đúng định dạng.</span>`
                    $('.add-image').closest('.row').append(html)
                    return false;
                }
            })
            this.files = dtFiles.files
        });
        $(document).on('click', '.add-image', function () {
            $('#files').click();
        })
        $(document).on('click', '.remove-image', function () {
           
            let fileName = $(this).data('image-name')
            const input = document.getElementById('files')
            const { files } = input

            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                if (file.name == fileName) {
                    dtFiles.items.remove(file)
                }
            }
            input.files = dtFiles.files // Assign the updates list
            $(this).closest('.image-model').remove();
        })

        $(document).on("click", '.image-ratio-box', function () {
            let img = $(this).find('img').prop('src')
            var formdata = new FormData();
            formdata.append("image", img);

            $.ajax({
                type: "POST",
                data: formdata,
                processData: false,
                url: "/Home/ViewImageModal",
                contentType: false,
                success: function (response) {
                    $('#modal .modal-content').html(response);
                    $('#modal').modal('show');                
                }
            });
        });

    }

    return {
        init: init
    };

})(window, jQuery);