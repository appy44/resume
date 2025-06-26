<?php

// Path to Base64 file (outside web root for security)
$base64File = 'cv_base64.txt'; // Adjust this path

if (!file_exists($base64File)) {
    http_response_code(404);
    exit('File not found.');
}

// Read and decode Base64 content
$base64 = file_get_contents($base64File);
$pdfData = base64_decode($base64, true);

if ($pdfData === false) {
    http_response_code(500);
    exit('Failed to decode file.');
}

// Security: prevent caching
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Pragma: no-cache");

// Set headers for PDF download
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="Mayur_Sontale_CV.pdf"');
header('Content-Length: ' . strlen($pdfData));

echo $pdfData;
exit;
?>
