<?php
$directory = $_SERVER['DOCUMENT_ROOT'].'/../../EasyACert/public_html/data/reports/excel';
 $name = "";
if(isset($_GET['file']))
     $name = $_GET['file'];

// Returns array of files
$files = scandir($directory);

            $fullPath = $fullPath= $_SERVER['DOCUMENT_ROOT'].'/../../EasyACert/public_html/data/reports/excel/'.$name;
	        $fileName = $name;
	        $headers = get_headers($fullPath, 1);
	        $contentType = $headers['Content-Type'];
	        header("Content-type:".$contentType);
	        header("Content-Disposition: attachment; filename=".$fileName);
	        ob_end_clean();
	        $pdfiledata = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/../../EasyACert/public_html/data/reports/excel/'.$name);
	       
	        flush();      // flush headers (if possible)
echo $pdfiledata;