# Tests (Coming Soon)

This directory will contain PHPUnit tests for the Vidstack Player addon.

## Planned Test Structure

```
tests/
├── Unit/
│   ├── VidstackPlayerTest.php
│   ├── PlatformDetectorTest.php
│   ├── UtilitiesTest.php
│   └── AssetHelperTest.php
├── Integration/
│   ├── BackendIntegrationTest.php
│   └── OembedParserTest.php
└── bootstrap.php
```

## Test Coverage Goals

- **VidstackPlayer**: All fluent methods, rendering logic
- **PlatformDetector**: YouTube/Vimeo/Local detection, media type detection
- **Utilities**: HTML attribute building, MIME type detection
- **AssetHelper**: CSS/JS generation, cache-busting
- **BackendIntegration**: Mediapool sidebar rendering (with mocked FFmpeg)
- **OembedParser**: oEmbed tag parsing and conversion

## Running Tests

```bash
# Install PHPUnit (when implemented)
composer require --dev phpunit/phpunit

# Run tests
vendor/bin/phpunit tests/

# With coverage
vendor/bin/phpunit --coverage-html coverage/ tests/
```

## Test Requirements

- PHP 8.2+
- REDAXO 5.17+
- PHPUnit 10+
