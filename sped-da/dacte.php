<?php

    error_reporting(E_ALL);
    ini_set('display_errors', 'On');

    require_once 'bootstrap.php';

    use NFePHP\DA\CTe\Dacte;

    try {
        
        $body = json_decode(file_get_contents('php://input'), true);
        $logo = 'data://text/plain;base64,'. base64_encode(file_get_contents(realpath(__DIR__ . '/logo/' . $body['logo'])));

        $dacte = new Dacte(base64_decode($body['xml']));
        $dacte->creditsIntegratorFooter('Global Sistemas - http://www.tcltransporte.com.br', false);
        $pdf = $dacte->render($logo);

        header('Content-Type: application/pdf');
        echo $pdf;

        //header('Content-Type: application/json');
        //echo json_encode(array('pdf' => base64_encode($pdf)));

    } catch (Exception $e) {
        echo "Ocorreu um erro durante o processamento :" . $e->getMessage();
    }
?>