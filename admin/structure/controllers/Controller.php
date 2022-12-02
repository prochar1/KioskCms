<?php
abstract class Controller
{
    protected $data = array();
    protected $view = "";
    protected $header = array('title' => '', 'description' => '');

    abstract function process(array $parameters): void;

    public function listViews(): void
    {
        if ($this->view) {
            extract($this->data);
            require("structure/views/" . $this->view . ".phtml");
        }
    }

    public function redirect(string $url): never
    {
        header("Location: /$url");
        header("Connection: close");
        exit;
    }
}
