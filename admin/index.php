<?php
mb_internal_encoding("UTF-8");
function autoloader(string $trida): void
{
    if (preg_match('/Controller$/', $trida))
        require("structure/controllers/" . $trida . ".php");
    else
        require("structure/modely/" . $trida . ".php");
}

spl_autoload_register("autoloader");

// include "structure/models/dataModel.php";
// include "structure/models/pageModel.php";
// include "structure/controllers/pageController.php";

$page = new PageController(isset($_GET['id']) ? $_GET['id'] : null);

//$page->execute();

//include "structure/views/layout.phtml";
