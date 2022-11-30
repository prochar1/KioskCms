<?php
include "classes/page.class.php";

$page = new Page(isset($_GET['id']) ? $_GET['id'] : null);

if (is_array($_POST) and count($_POST)) {

    $page->upload();

    if (isset($_POST['submit'])) {

        $page->insert();
        $page->update();
    }

    if (isset($_POST['delete'])) {
        $page->delete();
    }
}
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>KioskCMS</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="vendor\twbs\bootstrap\dist\css\bootstrap.min.css">
    <style>
        .ck-editor__editable[role="textbox"] {
            min-height: 15em;
        }
    </style>
</head>

<body>
    <div class="container-fluid">

        <br />

        <h1><a class="btn btn-success active" href="<?= parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH); ?>">KioskCMS</a></h1>

        <div class="row">

            <div class="col-4">
                <br />
                <h2>Pages</h2>
                <br />
                <?= $page->renderList(); ?>

            </div>

            <div class="col-8">

                <br />

                <h2>
                    <?php if (isset($_GET['id'])) { ?>
                        Edit page <a href="/" class="btn btn-outline-secondary btn-sm">Create new</a>
                    <?php } else { ?>
                        Create page
                    <?php } ?>
                </h2>



                <form method="post" enctype="multipart/form-data">
                    <p>
                        <label for="title" class="form-label">Title</label>
                        <input class="form-control" type="text" name="title" id="title" value="<?= $page->title ?>" required>
                        <input type="hidden" name="id" value="<?= (isset($_GET['id']) ? $_GET['id'] : ''); ?>">
                    </p>

                    <p>
                        <label for="parent" class="form-label">Parent</label>
                        <?= $page->renderSelectBox($page->parent); ?>
                    </p>

                    <div class="row">
                        <div class="col-2">

                            <p>
                                <label for="title" class="form-label">Order</label>
                                <input class="form-control" type="number" name="order" id="order" step="0.1" value="<?= $page->order ?>">
                            </p>

                        </div>
                    </div>

                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="list" id="list" <?php echo $page->list == 'true' ? 'checked="checked"' : ''; ?> value="true" id="flexCheckDefault">
                        <label class="form-check-label" for="flexCheckDefault">
                            List (Displays only the listing of direct subordinate pages)
                        </label>
                    </div>

                    <br />

                    <p>
                        <label class="form-label">Images</label><br />
                        <input type="hidden" name="uploadFolder" id="uploadFolder" value="<?= $page->uploadFolder ?>">
                        <span id="upload">
                            <a id="pickfiles" class="btn btn-outline-secondary" href="javascript:;">Select files</a>
                            <a id="uploadfiles" class="btn btn-primary" style="display: none;" href="javascript:;" data-allow-extensions="images">Upload files</a>
                            <span id="filelist"></span>
                            <span id="console"></span>
                            <div id="uploadedlist" class="row row-cols-1 row-cols-md-3 g-4">
                                <?php if (is_array($page->images) and count($page->images)) {
                                    foreach ($page->images as $key => $file) {
                                        $file_description = '';
                                        if (isset($page->images_descriptions[$key])) $file_description = $page->images_descriptions[$key]; ?>
                                        <div class="col">
                                            <div class="card h-100">
                                                <img class="card-img-top" src="<?= $file; ?>" alt="">
                                                <div class="card-body">
                                                    <p class="card-text">
                                                        <label class="form-label">Description</label>
                                                        <textarea class="form-control" name="images_descriptions[]"><?= $file_description; ?></textarea>
                                                    </p>
                                                    <input type="hidden" name="images[]" value="<?= $file; ?>">
                                                </div>
                                                <div class="card-footer text-end">
                                                    <button type="button" class="btn-sm btn-close" onclick="removeFile(event)" aria-label="Close"></button>
                                                </div>
                                            </div>
                                        </div>
                                <?php }
                                }

                                ?>
                            </div>
                        </span>
                    </p>
                    <?= $page->images ?>

                    <p>
                        <label class="form-label">Video</label><br />
                        <input type="hidden" name="uploadFolder" id="uploadFolder" value="<?= $page->uploadFolder ?>">
                        <span id="upload">
                            <a id="pickfiles" class="btn btn-outline-secondary" href="javascript:;">Select file</a>
                            <a id="uploadfiles" class="btn btn-primary" style="display: none;" href="javascript:;" data-allow-extensions="video">Upload file</a>
                            <span id="filelist"></span>
                            <span id="console"></span>
                            <div id="uploadedlist" class="row row-cols-1 row-cols-md-3 g-4">
                                <?php if (is_array($page->video) and count($page->video)) {
                                    foreach ($page->video as $key => $file) { ?>
                                        <div class="col">
                                            <div class="card h-100">
                                                <video class="card-img-top" src="<?= $file; ?>" controls></video>
                                                <input type="hidden" name="video[]" value="<?= $file; ?>">
                                                <div class="card-footer d-flex justify-content-between align-items-center">
                                                    <a target="_blank" class="text-decoration-none" href="<?= $file; ?>"><?= basename($file); ?></a>
                                                    <button type="button" class="btn-sm btn-close" onclick="removeFile(event)" aria-label="Close"></button>
                                                </div>
                                            </div>
                                        </div>
                                <?php }
                                } ?>
                            </div>
                        </span>
                    </p>
                    <?= $page->video ?>

                    <p>
                        <label class="form-label">PDF</label><br />
                        <input type="hidden" name="uploadFolder" id="uploadFolder" value="<?= $page->uploadFolder ?>">
                        <span id="upload">
                            <a id="pickfiles" class="btn btn-outline-secondary" href="javascript:;">Select file</a>
                            <a id="uploadfiles" class="btn btn-primary" style="display: none;" href="javascript:;" data-allow-extensions="document">Upload file</a>
                            <span id="filelist"></span>
                            <span id="console"></span>
                            <div id="uploadedlist" class="row row-cols-1 row-cols-md-3 g-4">
                                <?php if (is_array($page->pdf) and count($page->pdf)) {
                                    foreach ($page->pdf as $key => $file) { ?>
                                        <div class="col">
                                            <div class="card h-100">
                                                <input type="hidden" name="pdf[]" value="<?= $file; ?>">
                                                <div class="card-footer d-flex justify-content-between align-items-center">
                                                    <a target="_blank" class="text-decoration-none" href="<?= $file; ?>"><?= basename($file); ?></a>
                                                    <button type="button" class="btn-sm btn-close" onclick="removeFile(event)" aria-label="Close"></button>
                                                </div>
                                            </div>
                                        </div>
                                <?php }
                                } ?>
                            </div>
                        </span>
                    </p>

                    <div>
                        <label class="form-label">Text</label><br />
                        <textarea id="description" name="description" class="form-control" style="height: 15em;"><?= $page->description; ?></textarea>
                    </div>

                    <br />

                    <div class="row">
                        <div class="col">
                            <input class="btn btn-success" type="submit" name="submit" value="Save">
                        </div>
                        <?php if (isset($_GET['id'])) { ?>
                            <div class="col text-end">
                                <?php if (!$page->hasChildren($_GET['id'])) { ?>
                                    <input class="btn btn-danger" onclick="return confirm('Really?');" type="submit" name="delete" value="Delete">
                                <?php } else { ?>
                                    <p>has children, cannot be deleted</p>
                                <?php } ?>
                            </div>
                        <?php } ?>
                    </div>

                </form>

            </div>
        </div>
    </div>

    <br />
    <br />

    <script src="node_modules/@ckeditor/ckeditor5-build-classic/build/ckeditor.js"></script>
    <script src="libs/plupload/plupload.full.min.js"></script>
    <script src="node_modules/jquery/dist/jquery.min.js"></script>
    <script src="node_modules/jquery-ui/dist/jquery-ui.min.js"></script>
    <script src="js/index.js"></script>



</body>

</html>