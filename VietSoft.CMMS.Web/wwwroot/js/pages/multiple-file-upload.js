var MultipleFileUploadModule = MultipleFileUploadModule || (function () {
    function init() {
        $('#files').change(function (e) {
           console.log( e.target.files)
            $(e.target.files).each(function () {
                var file = this
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                if (file.type === "image/png" || file.type === "image/jpeg") {
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
                }
                else {

                    let html = `<span class="error">Không đúng định dạng.</span>`
                    $('.add-image').closest('.row').append(html)
                    return false;
                }
            })

        });
        $(document).on('click', '.add-image', function () {
            $('#files').click();
        })
        $(document).on('click', '.remove-image', function () {
           
            let fileName = $(this).data('image-name')
            const dt = new DataTransfer()
            const input = document.getElementById('files')
            const { files } = input

            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                if (file.name != fileName) {
                    console.log('a')
                    dt.items.add(file)
                }
                    
            }
            input.files = dt.files // Assign the updates list
            console.log(input.files)
            $(this).closest('.image-model').remove();
        })

        $(document).on("click", '.image-ratio-box', function () {
            let img = $(this).find('img').prop('src')

            $.ajax({
                type: "POST",
                data: {
                    image: img
                },
                url: "/Home/ViewImageModal",
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