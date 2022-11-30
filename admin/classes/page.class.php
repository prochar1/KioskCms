<?php class Page
{

    public $data = [];
    public $title = '';
    public $description = '';
    public $video = '';
    public $pdf = '';
    public $list = '';
    public $images = '';
    public $images_descriptions = '';
    public $type = 'description';
    public $parent = '0';
    public $order = '0';
    private $dataFile = '../data/data.json';
    public $uploadFolder = '';

    function __construct($id = null)
    {
        $data = json_decode(file_get_contents($this->dataFile), true);
        $this->data = $data;

        $this->uploadFolder = date('YmdHis') . '_' . mt_rand(10000, 99999);

        if (!empty($id)) {
            $item = $this->item();
            if (isset($item['title'])) $this->title = $item['title'];
            if (isset($item['description'])) $this->description = $item['description'];
            if (isset($item['video'])) $this->video = $item['video'];
            if (isset($item['pdf'])) $this->pdf = $item['pdf'];
            if (isset($item['list'])) $this->list = $item['list'];
            if (isset($item['images'])) $this->images = $item['images'];
            if (isset($item['images_descriptions'])) $this->images_descriptions = $item['images_descriptions'];
            if (isset($item['parent'])) $this->parent = $item['parent'];
            if (isset($item['order'])) $this->order = $item['order'];
            if (isset($item['uploadFolder'])) $this->uploadFolder = $item['uploadFolder'];
        }
    }

    function getMaxId()
    {
        if (!is_array($this->data)) return 0;
        if (empty(array_keys($this->data))) return 0;
        return max(array_keys($this->data));
    }

    function item()
    {
        if (is_array($this->data) and isset($this->data[$_GET['id']])) {
            return $this->data[$_GET['id']];
        }
        return null;
    }

    function insert()
    {
        if (!empty($_POST['id'])) return;
        $id = $this->getMaxId() + 1;
        $this->data[$id] = $_POST;
        $this->data[$id]['id'] = strval($id);
        $this->type = $_POST['type'];
        $this->save();
        $this->redirect();
    }

    function update()
    {
        if (empty($_POST['id'])) return;
        $this->data[$_POST['id']] = $_POST;
        $this->type = $_POST['type'];
        $this->save();
        $this->redirect();
    }

    function delete()
    {
        if (empty($_POST['id'])) return;
        $row['id'] = $_POST['id'];
        if (is_array($this->data)) {
            foreach ($this->data as $key => $row) {
                if ($row['id'] == $_POST['id']) {
                    unset($this->data[$row['id']]);
                }
            }
        }
        $this->save();
        $this->redirect(true);
    }

    function sorting($parent = 0)
    {
        $a = [];
        foreach ($this->data as $key => $row) {
            if ($row['parent'] == $parent) {
                $a[] = $row;
            }
        }
        usort($a, function ($x, $y) {
            return $x['order'] <=> $y['order'];
        });
        foreach ($a as $row) {
            $a = array_merge($a, $this->sorting($row['id']));
        }
        $data = [];
        foreach ($a as $row) {
            $data[$row['id']] = $row;
        }
        return $data;
    }

    function save()
    {
        $data = $this->data;
        $data = $this->sorting(0);
        file_put_contents($this->dataFile, json_encode($data));
    }

    function redirect($toHome = false)
    {
        if ($toHome) {
            header('Location:' . parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH));
        }
        header('Location:' . $_SERVER["REQUEST_URI"]);
    }

    private function list($parent = "0", $isSublist = false)
    {
        if (!is_array($this->data)) return;
        $data = $this->sorting($parent);
        $output = '';
        if (!$isSublist) $output .= '<ul class="list-group" id="list">' . "\r\n";
        foreach ($data as $key => $row) {
            if ($row['parent'] == $parent) {
                $active = '';
                $class = '';
                if (isset($_GET['id']) and $row['id'] == $_GET['id']) {
                    $active = ' active';
                    $class = ' text-white';
                }
                $output .= '<li class="list-group-item' . $active . ' d-flex justify-content-between align-items-center">';
                $output .= '<a class="' . $class . ' text-truncate text-decoration-none mr-auto" href="?id=' . $row['id'] . '">';
                $output .= ' <span class="text-secondary">&#45;</span> ' . $row['title'];
                $output .= '</a>';
                $output .= '<span>';
                $output .= '<small class="text-secondary"><small>' . $row['order'] . '</small></small>';
                if (isset($row['list']) and $row['list'] == true) $output .= '<small class="text-info">&nbsp;List&nbsp;</small>';
                $output .= '</span>';
                $output .= '</li>' . "\r\n";
                $sublist = $this->list($row['id'], true);
                if (!empty(strip_tags($sublist))) {
                    $output .= str_replace('&#45;', '&#45;&#45;', $sublist);
                }
            }
        }
        if (!$isSublist) $output .= '</ul>' . "\r\n";
        return $output;
    }

    function renderList()
    {
        return str_replace(' <span class="text-secondary">&#45;</span> ', '', $this->list());
    }

    function selectBox($value, $parent = "0", $isSublist = false)
    {
        $output = '';
        if (!$isSublist) {
            $output .= '<select name="parent" id="parent" class="form-select">';
            $output .= '<option value="0">';
            $output .= 'none';
            $output .= '</option>';
        }
        if (is_array($this->data)) foreach ($this->data as $key => $row) {
            if ($row['parent'] == $parent) {
                $visibility = '';
                if (isset($_GET['id']) and $row['id'] == $_GET['id']) {
                    $visibility = ' style="display: none;"';
                }
                $selected = ' ';
                if (isset($value) and $row['id'] == $value) {
                    $selected = ' selected="selected"';
                }
                $output .= '<option' . $selected . $visibility . ' value="' . $row['id'] . '">';
                $output .= ' &#45; ' . $row['title'] . ' (' . $row['order'] . ')';
                $output .= '</option>';
                $sublist = $this->selectBox($value, $row['id'], true);
                if (!empty(trim(strip_tags($sublist)))) {
                    $output .= str_replace('&#45;', '&#45;&#45;', $sublist);
                }
            }
        }
        if (!$isSublist) $output .= '</select>';
        return $output;
    }

    function renderSelectBox($value)
    {
        return str_replace(' &#45; ', '', $this->selectBox($value));
    }

    function hasChildren($id)
    {
        return trim(strip_tags($this->list($id)));
    }

    private function cleanFileName($file_name)
    {
        $file_ext = pathinfo($file_name, PATHINFO_EXTENSION);
        $dir_name_str = pathinfo($file_name, PATHINFO_DIRNAME);
        $file_name_str = pathinfo($file_name, PATHINFO_FILENAME);
        $file_name_str = str_replace(' ', '-', $file_name_str);
        $file_name_str = preg_replace('/[^A-Za-z0-9\-\_]/', '', $file_name_str);
        $file_name_str = preg_replace('/-+/', '-', $file_name_str);
        $clean_file_name = $dir_name_str . '/' . $file_name_str . '.' . $file_ext;

        return $clean_file_name;
    }

    function upload()
    {

        if (!isset($_POST['upload'])) return;

        require_once __DIR__ . '/../libs/plupload/PluploadHandler.php';

        $extensions_type = $_POST['extensions_type'];
        if (!in_array($extensions_type, array('images', 'document', 'video'))) return;

        $upload_folder = $_POST['upload_folder'];

        $dir = __DIR__ . '/../../media/' . $upload_folder . '/';

        if (!file_exists($dir)) mkdir($dir, 0755);

        $extensions = '';
        if ($extensions_type == 'images') $extensions = 'jpg,jpeg,png';
        if ($extensions_type == 'document') $extensions = 'pdf';
        if ($extensions_type == 'video') $extensions = 'mp4';

        $ph = new PluploadHandler(array(
            'target_dir' => $dir,
            'allow_extensions' => $extensions
        ));

        $ph->sendNoCacheHeaders();
        $ph->sendCORSHeaders();
        $file = $ph->handleUpload();

        $new_path = $this->cleanFileName($file['path']);

        rename($file['path'], $new_path);

        if ($extensions_type == 'images') {

            $this->resizeImage($new_path, 2000, 2000);
            $dst = $this->cropImage($new_path, 500, 500);
        } else {
            $dst = $new_path;
        }

        echo '../../media/' . $upload_folder . '/' . basename($dst);

        exit;
    }

    private function cropAlign($image, $cropWidth, $cropHeight, $horizontalAlign = 'center', $verticalAlign = 'middle')
    {
        $width = imagesx($image);
        $height = imagesy($image);
        $horizontalAlignPixels = $this->calculatePixelsForAlign($width, $cropWidth, $horizontalAlign);
        $verticalAlignPixels = $this->calculatePixelsForAlign($height, $cropHeight, $verticalAlign);
        return imageCrop($image, [
            'x' => $horizontalAlignPixels[0],
            'y' => $verticalAlignPixels[0],
            'width' => $horizontalAlignPixels[1],
            'height' => $verticalAlignPixels[1]
        ]);
    }

    private function calculatePixelsForAlign($imageSize, $cropSize, $align)
    {
        switch ($align) {
            case 'left':
            case 'top':
                return [0, min($cropSize, $imageSize)];
            case 'right':
            case 'bottom':
                return [max(0, $imageSize - $cropSize), min($cropSize, $imageSize)];
            case 'center':
            case 'middle':
                return [
                    max(0, floor(($imageSize / 2) - ($cropSize / 2))),
                    min($cropSize, $imageSize),
                ];
            default:
                return [0, $imageSize];
        }
    }

    private function resizeImage($file, $w, $h)
    {
        $extension = pathinfo($file, PATHINFO_EXTENSION);
        $f = substr($file, 0, -1 * (mb_strlen($extension) + 1));
        $subname = "_re";
        $newfile = $f . $subname . "." . $extension;
        list($width, $height) = getimagesize($file);
        if ($w > $width && $h > $height) {
            copy($file, $newfile);
            return;
        }
        $r = $width / $height;
        if ($w / $h > $r) {
            $newwidth = $h * $r;
            $newheight = $h;
        } else {
            $newheight = $w / $r;
            $newwidth = $w;
        }
        if ($extension == "jpg") $src = imagecreatefromjpeg($file);
        if ($extension == "png") $src = imagecreatefrompng($file);
        $dst = imagecreatetruecolor($newwidth, $newheight);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
        if ($extension == "jpg") imagejpeg($dst, $newfile, 90);
        if ($extension == "png") imagepng($dst, $newfile, 9);
        imagedestroy($dst);
        imagedestroy($src);
        return $newfile;
    }

    private function cropImage($file, $w, $h, $horizontalAlign = 'center', $verticalAlign = 'middle')
    {
        $extension = pathinfo($file, PATHINFO_EXTENSION);
        $f = substr($file, 0, -1 * (mb_strlen($extension) + 1));
        $newfile = $f . "_sq." . $extension;
        $size = getimagesize($file);
        $cropWidth = $size[0];
        $cropHeight = $size[0];
        if ($size[0] > $size[1]) {
            $cropWidth = $size[1];
            $cropHeight = $size[1];
        }
        if ($extension == "jpg") $im = imagecreatefromjpeg($file);
        if ($extension == "png") $im = imagecreatefrompng($file);
        $img = $this->cropAlign($im, $cropWidth, $cropHeight, $horizontalAlign, $verticalAlign);
        if ($img) {
            $imgSmall = imagecreatetruecolor($w, $h);
            imagecopyresampled($imgSmall, $img, 0, 0, 0, 0, $w, $h, $cropWidth, $cropHeight);
            if ($extension == "jpg") imagejpeg($imgSmall, $newfile, 90);
            if ($extension == "png") imagepng($imgSmall, $newfile, 9);
            imagedestroy($img);
            imagedestroy($imgSmall);
        }
        imagedestroy($im);
        return $newfile;
    }
}
