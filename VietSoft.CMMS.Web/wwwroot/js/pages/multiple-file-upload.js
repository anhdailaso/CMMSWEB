var MultipleFileUploadModule = MultipleFileUploadModule || (function () {
    function init() {
        $('#files').change(function (e) {
            $(e.target.files).each(function () {
                var file = this
                var fileReader = new FileReader();

                fileReader.readAsDataURL(file);

                fileReader.onload = function (e) {
                    let src = e.target.result

                    let html = ` 
                          <div data-type="image-model" class="col-4 pl-2 pr-2 pt-2" style="max-width:200px;">
                           <div class="ratio-box text-center" data-type="image-ratio-box">
                                    <div data-type="loading" class="img-loading" style="color:#218838; display:none;">
                                      <span class="fa fa-2x fa-spin fa-spinner"></span>
                                    </div>
                                    <img data-type="preview" class="btn btn-light ratio-img img-fluid p-2 image border dashed rounded" src="`+ src + `" style="cursor: default;">
                                    <span class="badge badge-pill badge-success p-2 w-50 main-tag" style="display:none;">Main</span>
                                  </div>
                        </div>
                        `
                    $('#filesContent').find('.row').append(html)
                }
            })


        });
    }

    return {
        init: init
    };

})(window, jQuery);