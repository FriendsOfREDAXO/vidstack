<?php
// Test specific aspect ratio functionality without full REDAXO dependencies

// Test that setAspectRatio method exists and works
require_once 'lib/video.php';

use FriendsOfRedaxo\VidStack\Video;

echo "Testing Aspect Ratio Functionality\n";
echo "==================================\n\n";

// Mock required functions
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

if (!class_exists('rex_media')) {
    class rex_media {
        public static function get($filename) {
            return true; // Mock that media exists
        }
    }
}

// Test the aspect ratio functionality
try {
    // Test 1: Check if method exists
    echo "Test 1: Check if setAspectRatio method exists\n";
    $video = new Video('test.mp4', 'Test Video');
    if (method_exists($video, 'setAspectRatio')) {
        echo "✅ setAspectRatio method exists\n";
    } else {
        echo "❌ setAspectRatio method not found\n";
    }
    
    // Test 2: Check if aspect ratio property is set correctly
    echo "\nTest 2: Check aspect ratio property\n";
    $reflection = new ReflectionClass($video);
    $property = $reflection->getProperty('aspectRatio');
    $property->setAccessible(true);
    
    $defaultValue = $property->getValue($video);
    echo "Default aspect ratio: " . $defaultValue . "\n";
    
    // Test setting custom aspect ratio
    $video->setAspectRatio('9 / 16');
    $newValue = $property->getValue($video);
    echo "After setting to 9/16: " . $newValue . "\n";
    
    if ($newValue === '9 / 16') {
        echo "✅ Aspect ratio property set correctly\n";
    } else {
        echo "❌ Aspect ratio property not set correctly\n";
    }
    
    // Test 3: Check consent placeholder functionality
    echo "\nTest 3: Check consent placeholder aspect ratio\n";
    $video->setAspectRatio('1 / 1');
    $placeholder = $video->generateConsentPlaceholder('Test consent text', 'youtube', 'dQw4w9WgXcQ');
    
    if (strpos($placeholder, 'aspect-ratio: 1 / 1') !== false) {
        echo "✅ Consent placeholder uses correct aspect ratio\n";
    } else {
        echo "❌ Consent placeholder doesn't use correct aspect ratio\n";
    }
    
    echo "\nGenerated consent placeholder:\n";
    echo $placeholder . "\n";
    
} catch (Exception $e) {
    echo "❌ Error during testing: " . $e->getMessage() . "\n";
}

echo "\n==================================\n";
echo "Testing completed!\n";
?>