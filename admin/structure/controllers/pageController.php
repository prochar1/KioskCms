<?php class PageController
{

    private $pageModel;
    private $databaze;

    public function __construct($databaze)
    {
        $this->databaze = $databaze;
        $this->pageModel = new PageModel($this->databaze);
    }

    public function vsechna()
    {
        $pages = $this->pageModel->getPages(); // Proměnná pro šablonu
        require('structure/views/pageList.phtml'); // Načtení šablony
    }

    // Případné další akce jako jedno($id), odstran($id), ...

}
