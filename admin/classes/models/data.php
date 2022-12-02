<?php class Data
{

    protected $id = 0;
    private $data = [];
    private $dataFile = '../data/data.json';

    public function __construct($id = null)
    {
        if (!file_exists($this->dataFile)) return;

        if (!empty($id)) $this->id = $id;

        $this->data = $this->getData();
    }

    private function getData()
    {
        $data = json_decode(file_get_contents($this->dataFile), true);
        if ($this->id) return $data[$this->id];
        return $data;
    }

    public function setData($data)
    {
        $this->data = $data;
        if ($data['id']) $this->id = $data['id'];
    }

    private function getLastId()
    {
        if (!is_array($this->data)) return 0;
        if (empty(array_keys($this->data))) return 0;
        return max(array_keys($this->data));
    }



    private function insert()
    {
        $this->id = $this->getLastId() + 1;
        $this->data[$this->id] = $this->data;
        return $this->data;
    }

    private function update()
    {
        $this->data[$this->id] = $this->data;
        return $this->data;
    }

    private function delete()
    {
        if (is_array($this->data)) {
            foreach ($this->data as $row) {
                if ($row['id'] == $this->id) {
                    unset($this->data[$this->id]);
                }
            }
        }
    }

    private function sorting($parent = 0)
    {
        $a = [];
        foreach ($this->data as $row) {
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

    public function execute()
    {
        if (!$this->data['submit']) return;
        if (!$this->id) {
            return $this->insert();
        } else {
            if ($this->data['submit'] == 'delete') return $this->delete();
            return $this->update();
        }
        $this->save();
    }

    private function save()
    {
        $this->data = $this->sorting(0);
        file_put_contents($this->dataFile, json_encode($this->data));
        return true;
    }
}
