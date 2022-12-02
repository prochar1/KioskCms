if (document.querySelector('#description')) {
    ClassicEditor
        .create(document.querySelector('#description'), {
            toolbar: {
                items: [
                    'heading', '|',
                    'bold', 'italic', '|',
                    'bulletedList', 'numberedList', '|',
                    'undo', 'redo', '|'
                ],
            },
            heading: {
                options: [
                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                    { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                    { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                    { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                    { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                    { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                    { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                ]
            },
        })
        .catch(error => {
            console.error(error);
        });

}

if (document.querySelector('#upload')) {

    let extensions_type = document.getElementById('uploadfiles').getAttribute('data-allow-extensions');

    let multi_selection = true;
    if (extensions_type == 'images') {
        extensions = 'jpg,jpeg,png';
    }
    if (extensions_type == 'document') {
        multi_selection = false;
        extensions = 'pdf';
    }
    if (extensions_type == 'video') {
        multi_selection = false;
        extensions = 'mp4';
    }

    var uploader = new plupload.Uploader({
        runtimes: 'html5',
        browse_button: 'pickfiles', // you can pass an id...
        container: document.getElementById('upload'), // ... or DOM Element itself
        url: 'index.php',
        multi_selection: multi_selection,
        // flash_swf_url: 'js/Moxie.swf',
        // silverlight_xap_url: 'js/Moxie.xap',
        chunk_size: '100mb',
        drop_element: document.getElementById('pickfiles'),
        filters: {
            max_file_size: '2000mb',
            mime_types: [{
                title: "Files",
                extensions: extensions
            }]
        },
        multipart_params: {
            "upload": "1",
            "extensions_type": extensions_type,
            "upload_folder": document.getElementById('uploadFolder').value
        },
        init: {
            PostInit: function () {
                document.getElementById('filelist').innerHTML = '';

                document.getElementById('uploadfiles').onclick = function () {
                    uploader.start();
                    return false;
                };
            },

            FilesAdded: function (up, files) {
                document.getElementById('uploadfiles').style.display = 'inline-block';
                plupload.each(files, function (file) {
                    document.getElementById('filelist').innerHTML += '<div id="' + file.id + '">' +
                        file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
                });
            },

            UploadProgress: function (up, file) {
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file
                    .percent + "%</span>";
            },

            Error: function (up, err) {
                document.getElementById('console').appendChild(document.createTextNode("\nError #" + err
                    .code + ": " + err.message));
            },

            FileUploaded: function (up, file, result) {
                console.log(result.response);
                let el = document.createElement('div');
                el.classList.add('col');
                let output = '';
                if (extensions_type == 'images') {
                    output = `
                        <div class="card h-100">
                            <img class="card-img-top" src="${result.response}" alt="">
                            <div class="card-body">
                            <p class="card-text">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" name="images_descriptions[]"></textarea>
                            </p>
                            <input type="hidden" name="images[]" value="${result.response}">
                            </div>
                            <div class="card-footer text-end">
                                <button type="button" class="btn-sm btn-close" onclick="removeFile(event)" aria-label="Close"></button>
                            </div>
                        </div>
                    `;
                    el.innerHTML = output;
                    document.getElementById('uploadedlist').appendChild(el);
                }
                if (extensions_type == 'video') {
                    output = `
                        <div class="col">
                            <div class="card h-100">
                                <video class="card-img-top" src="${result.response}" controls></video>
                                <input type="hidden" name="video[]" value="${result.response}">
                                <div class="card-footer d-flex justify-content-between align-items-center">
                                    <a target="_blank" class="text-decoration-none" href="${result.response}">${basename(result.response)}</a>
                                    <button type="button" class="btn-sm btn-close" onclick="removeFile(event)" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                    `;
                    document.getElementById('uploadedlist').innerHTML = output;
                }
                if (extensions_type == 'document') {
                    output = `
                        <div class="col">
                            <div class="card h-100">
                                <input type="hidden" name="pdf[]" value="${result.response}">
                                <div class="card-footer d-flex justify-content-between align-items-center">
                                    <a target="_blank" class="text-decoration-none" href="${result.response}">${basename(result.response)}</a>
                                    <button type="button" class="btn-sm btn-close" onclick="removeFile(event)" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                    `;
                    document.getElementById('uploadedlist').innerHTML = output;
                }

            },

            UploadComplete: function (up, files) {
                document.getElementById('uploadfiles').style.display = 'none';
                document.getElementById('filelist').innerHTML = '';
                $('#uploadedlist').sortable();
                // console.log(files);
                // filesAjaxContent();
                // setTimeout(function() {
                //     filesAjaxContent();
                // }, 5000);
            }

        }
    });

    uploader.init();
}

function basename(path) {
    return path.split('/').reverse()[0];
}

function removeFile(event) {
    event.target.parentElement.parentElement.parentElement.remove();
}

$(document).ready(function () {
    $('#uploadedlist').sortable();
});