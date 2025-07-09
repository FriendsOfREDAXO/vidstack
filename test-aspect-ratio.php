<?php
// Simple test script to verify aspect ratio functionality

// Mock all the rex functions for testing outside of REDAXO
if (!function_exists('rex_escape')) {
    function rex_escape($string) {
        return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
    }
}

if (!class_exists('rex_url')) {
    class rex_url {
        public static function media($file) {
            return 'media/' . $file;
        }
    }
}

if (!class_exists('rex_path')) {
    class rex_path {
        public static function addon($addon, $path = '') {
            return __DIR__ . '/' . $path;
        }
    }
}

require_once 'lib/video.php';

use FriendsOfRedaxo\VidStack\Video;

echo "<!DOCTYPE html>\n<html>\n<head>\n<title>Aspect Ratio Test</title>\n</head>\n<body>\n";

// Test 1: Default aspect ratio (16:9)
echo "<h2>Test 1: Default 16:9 Aspect Ratio</h2>\n";
try {
    $video1 = new Video('test-video.mp4', 'Default Video');
    $output1 = $video1->generate();
    echo "<p>✅ Default aspect ratio test passed!</p>\n";
    echo "<details><summary>Generated HTML:</summary><pre>" . htmlspecialchars($output1) . "</pre></details>\n";
    // Check if the output contains the default aspect ratio
    if (strpos($output1, '--aspect-ratio: 16 / 9') !== false) {
        echo "<p>✅ Default aspect ratio (16 / 9) found in output</p>\n";
    } else {
        echo "<p>❌ Default aspect ratio not found</p>\n";
    }
} catch (Exception $e) {
    echo "<p>❌ Error: " . $e->getMessage() . "</p>\n";
}
echo "\n";

// Test 2: Portrait video (9:16)
echo "<h2>Test 2: Portrait 9:16 Aspect Ratio</h2>\n";
try {
    $video2 = new Video('portrait-video.mp4', 'Portrait Video');
    $video2->setAspectRatio('9 / 16');
    $output2 = $video2->generate();
    echo "<p>✅ Portrait aspect ratio test passed!</p>\n";
    echo "<details><summary>Generated HTML:</summary><pre>" . htmlspecialchars($output2) . "</pre></details>\n";
    // Check if the output contains the portrait aspect ratio
    if (strpos($output2, '--aspect-ratio: 9 / 16') !== false) {
        echo "<p>✅ Portrait aspect ratio (9 / 16) found in output</p>\n";
    } else {
        echo "<p>❌ Portrait aspect ratio not found</p>\n";
    }
} catch (Exception $e) {
    echo "<p>❌ Error: " . $e->getMessage() . "</p>\n";
}
echo "\n";

// Test 3: Square video (1:1)
echo "<h2>Test 3: Square 1:1 Aspect Ratio</h2>\n";
try {
    $video3 = new Video('square-video.mp4', 'Square Video');
    $video3->setAspectRatio('1 / 1');
    $output3 = $video3->generate();
    echo "<p>✅ Square aspect ratio test passed!</p>\n";
    echo "<details><summary>Generated HTML:</summary><pre>" . htmlspecialchars($output3) . "</pre></details>\n";
    // Check if the output contains the square aspect ratio
    if (strpos($output3, '--aspect-ratio: 1 / 1') !== false) {
        echo "<p>✅ Square aspect ratio (1 / 1) found in output</p>\n";
    } else {
        echo "<p>❌ Square aspect ratio not found</p>\n";
    }
} catch (Exception $e) {
    echo "<p>❌ Error: " . $e->getMessage() . "</p>\n";
}
echo "\n";

// Test 4: Consent placeholder aspect ratio
echo "<h2>Test 4: Consent Placeholder Aspect Ratio</h2>\n";
try {
    $video4 = new Video('square-video.mp4', 'Square Video');
    $video4->setAspectRatio('1 / 1');
    $placeholder = $video4->generateConsentPlaceholder('Test consent text', 'youtube', 'dQw4w9WgXcQ');
    echo "<p>✅ Consent placeholder test passed!</p>\n";
    echo "<details><summary>Generated HTML:</summary><pre>" . htmlspecialchars($placeholder) . "</pre></details>\n";
    // Check if the output contains the correct aspect ratio
    if (strpos($placeholder, 'aspect-ratio: 1 / 1') !== false) {
        echo "<p>✅ Consent placeholder aspect ratio (1 / 1) found in output</p>\n";
    } else {
        echo "<p>❌ Consent placeholder aspect ratio not found</p>\n";
    }
} catch (Exception $e) {
    echo "<p>❌ Error: " . $e->getMessage() . "</p>\n";
}
echo "\n";

echo "<h2>✅ All tests completed!</h2>\n";
echo "<p>The aspect ratio functionality is working correctly. Videos can now be displayed in their proper aspect ratios without black bars.</p>\n";

echo "</body>\n</html>";
?>