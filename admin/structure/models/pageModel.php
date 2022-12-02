<?php
class PageModel
{

    private $databaze;

    public function __construct($databaze)
    {
        $this->databaze = $databaze;
    }

    public function getPages()
    {
        return $this->databaze->getData();
    }
}
