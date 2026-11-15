<?php
/**
 * Production Admin API Handler for cPanel / Apache / LiteSpeed
 * Enables live portfolio administration, content updates, and media uploads natively on cPanel.
 */

// Enable error logging, disable HTML error output
error_reporting(E_ALL);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

// Determine base paths
$baseDir = dirname(__DIR__); // public_html or dist root
$dataDir = $baseDir . '/data';
$contentFile = $dataDir . '/portfolio-content.json';
$uploadsDir = $baseDir . '/uploads';
$indexFile = $baseDir . '/index.html';

// Ensure directories exist with 0755 permissions
if (!is_dir($uploadsDir)) {
    @mkdir($uploadsDir, 0755, true);
}
@chmod($uploadsDir, 0755);
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}
@chmod($dataDir, 0755);

// Admin Password lookup (.env.local or fallback)
function getAdminPassword($baseDir) {
    $envPath = $baseDir . '/.env.local';
    if (file_exists($envPath)) {
        $content = file_get_contents($envPath);
        if (preg_match('/ADMIN_PASSWORD=["\']?([^"\'\r\n]+)/', $content, $m)) {
            return trim($m[1]);
        }
    }
    // Also check parent dir (if uploaded outside public_html)
    $parentEnv = dirname($baseDir) . '/.env.local';
    if (file_exists($parentEnv)) {
        $content = file_get_contents($parentEnv);
        if (preg_match('/ADMIN_PASSWORD=["\']?([^"\'\r\n]+)/', $content, $m)) {
            return trim($m[1]);
        }
    }
    return getenv('ADMIN_PASSWORD') ?: 'sazidadmin123';
}

// Request helpers
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Helper: parse JSON body
function getJsonBody() {
    $raw = file_get_contents('php://input');
    if (empty($raw)) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

// Normalize endpoint from URI
// E.g. /api/admin/login or /portfolio/api/admin/login -> login
$endpoint = '';
if (preg_match('#/api/admin/([a-zA-Z0-9_\-]+)#', $uri, $matches)) {
    $endpoint = $matches[1];
}

// 1. POST /api/admin/login
if ($method === 'POST' && $endpoint === 'login') {
    $body = getJsonBody();
    $password = isset($body['password']) ? $body['password'] : '';
    $expected = getAdminPassword($baseDir);

    if ($password === $expected) {
        echo json_encode([
            'ok' => true,
            'token' => 'sazid-admin-session-token'
        ]);
        exit;
    } else {
        http_response_code(401);
        echo json_encode([
            'ok' => false,
            'error' => 'Incorrect admin password'
        ]);
        exit;
    }
}

// 2. GET /api/admin/content (Read portfolio content)
if ($method === 'GET' && $endpoint === 'content') {
    if (file_exists($contentFile)) {
        echo file_get_contents($contentFile);
        exit;
    }
    http_response_code(404);
    echo json_encode(['error' => 'portfolio-content.json not found']);
    exit;
}

// --- AUTH CHECK FOR WRITE / MEDIA ENDPOINTS ---
// Multi-layer inspection: handles Apache FastCGI, LiteSpeed, Nginx, PHP-FPM and proxy setups
$authHeader = '';
if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
} elseif (!empty($_SERVER['REDIRECT_REDIRECT_HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['REDIRECT_REDIRECT_HTTP_AUTHORIZATION'];
} elseif (!empty($_SERVER['HTTP_X_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_X_AUTHORIZATION'];
} elseif (function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
    if (!empty($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    } elseif (!empty($headers['authorization'])) {
        $authHeader = $headers['authorization'];
    }
} elseif (function_exists('getallheaders')) {
    $headers = getallheaders();
    if (!empty($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    } elseif (!empty($headers['authorization'])) {
        $authHeader = $headers['authorization'];
    }
}

// Fallback: also accept token in query string if web server strips Authorization headers
if (empty($authHeader)) {
    if (!empty($_GET['token'])) {
        $authHeader = $_GET['token'];
    } elseif (!empty($_GET['auth'])) {
        $authHeader = $_GET['auth'];
    }
}

$isAuth = strpos($authHeader, 'sazid-admin-session-token') !== false;
if (!$isAuth) {
    http_response_code(401);
    echo json_encode([
        'ok' => false,
        'error' => 'Unauthorized. Please sign in.'
    ]);
    exit;
}

// 3. GET /api/admin/media (List media library)
if ($method === 'GET' && $endpoint === 'media') {
    $allFiles = [];
    $seen = [];
    $allowedExts = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'mp4', 'webm', 'pdf'];
    $cleanBaseDir = rtrim(str_replace('\\', '/', $baseDir), '/');

    // Helper: recursively scan a directory
    $scanDir = function($dir, $defaultType = 'general', $isSrcAssets = false) use (&$scanDir, &$allFiles, &$seen, $cleanBaseDir, $allowedExts) {
        if (!is_dir($dir)) return;
        $items = @scandir($dir);
        if (!$items) return;

        foreach ($items as $item) {
            if ($item === '.' || $item === '..' || $item === 'node_modules' || $item === '.git') continue;
            $fullPath = str_replace('\\', '/', $dir . '/' . $item);
            if (is_dir($fullPath)) {
                @chmod($fullPath, 0755);
                $subType = $defaultType;
                if ($isSrcAssets) {
                    if ($item === 'tech' || $item === 'company') $subType = 'icons';
                } else {
                    $subType = $item; // e.g. uploads/projects -> 'projects'
                }
                $scanDir($fullPath, $subType, $isSrcAssets);
            } elseif (is_file($fullPath)) {
                @chmod($fullPath, 0644);
                $ext = strtolower(pathinfo($item, PATHINFO_EXTENSION));
                if (in_array($ext, $allowedExts)) {
                    $relUrl = '/' . ltrim(str_replace($cleanBaseDir, '', $fullPath), '/');
                    if (!isset($seen[$relUrl])) {
                        $seen[$relUrl] = true;

                        // Smart type classification
                        $type = $defaultType;
                        $lower = strtolower($item);
                        if (strpos($lower, 'resume') !== false || $ext === 'pdf') {
                            $type = 'resumes';
                        } elseif (strpos($lower, 'logo') !== false || strpos($lower, 'icon') !== false || $ext === 'svg' || $ext === 'ico') {
                            $type = 'icons';
                        }

                        $allFiles[] = [
                            'name' => $item,
                            'type' => $type,
                            'url' => $relUrl,
                            'size' => @filesize($fullPath) ?: 0,
                            'mtime' => date('c', @filemtime($fullPath) ?: time())
                        ];
                    }
                }
            }
        }
    };

    // 1. Scan uploads directory (all subdirectories: projects, resumes, testimonials, icons, experience, general)
    if (is_dir($uploadsDir)) {
        $scanDir($uploadsDir, 'general', false);
    }

    // 2. Scan src/assets directory (existing portfolio assets, screenshots, icons, and videos)
    $srcAssetsDir = $baseDir . '/src/assets';
    if (is_dir($srcAssetsDir)) {
        $scanDir($srcAssetsDir, 'projects', true);
    }

    // 3. Scan assets directory (icons, favicons, og-image)
    $assetsDir = $baseDir . '/assets';
    if (is_dir($assetsDir)) {
        $scanDir($assetsDir, 'icons', false);
    }

    // 4. Scan root directory (resumes, key logos, PDFs)
    $rootItems = @scandir($baseDir);
    if ($rootItems) {
        foreach ($rootItems as $item) {
            if ($item === '.' || $item === '..') continue;
            $fullPath = str_replace('\\', '/', $baseDir . '/' . $item);
            if (is_file($fullPath)) {
                $ext = strtolower(pathinfo($item, PATHINFO_EXTENSION));
                if (in_array($ext, $allowedExts)) {
                    $relUrl = '/' . $item;
                    if (!isset($seen[$relUrl])) {
                        $seen[$relUrl] = true;
                        $type = 'general';
                        $lower = strtolower($item);
                        if (strpos($lower, 'resume') !== false || $ext === 'pdf') $type = 'resumes';
                        elseif (strpos($lower, 'logo') !== false || $ext === 'svg' || $ext === 'ico') $type = 'icons';
                        $allFiles[] = [
                            'name' => $item,
                            'type' => $type,
                            'url' => $relUrl,
                            'size' => @filesize($fullPath) ?: 0,
                            'mtime' => date('c', @filemtime($fullPath) ?: time())
                        ];
                    }
                }
            }
        }
    }

    // Sort newest first
    usort($allFiles, function($a, $b) {
        return strcmp($b['mtime'], $a['mtime']);
    });

    echo json_encode([
        'ok' => true,
        'files' => $allFiles
    ]);
    exit;
}

// 4. DELETE /api/admin/media (Delete a media file)
if ($method === 'DELETE' && $endpoint === 'media') {
    $body = getJsonBody();
    $fileUrl = isset($body['url']) ? $body['url'] : '';

    if (empty($fileUrl)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid file URL']);
        exit;
    }

    $cleanRel = ltrim(str_replace(['../', '..\\'], '', $fileUrl), '/');
    $targetPath = $baseDir . '/' . $cleanRel;

    // Security guard: must reside inside uploadsDir
    if (strpos(realpath(dirname($targetPath)), realpath($uploadsDir)) === 0 && file_exists($targetPath)) {
        @unlink($targetPath);
        echo json_encode(['ok' => true, 'message' => 'File deleted']);
        exit;
    }

    http_response_code(404);
    echo json_encode(['ok' => false, 'error' => 'File not found or access denied']);
    exit;
}

// 5. POST /api/admin/content (Save Content & Sync index.html)
if ($method === 'POST' && $endpoint === 'content') {
    $body = getJsonBody();
    if (empty($body)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Empty content payload']);
        exit;
    }

    $jsonString = json_encode($body, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    @file_put_contents($contentFile, $jsonString);

    // Sync pre-hydration in index.html
    if (file_exists($indexFile)) {
        $html = file_get_contents($indexFile);
        $compactJson = json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $updatedHtml = preg_replace('/window\.__C\s*=\s*\{[\s\S]*?\};/', 'window.__C=' . $compactJson . ';', $html);
        if ($updatedHtml) {
            @file_put_contents($indexFile, $updatedHtml);
        }
    }

    echo json_encode([
        'ok' => true,
        'message' => 'Content saved & published successfully!'
    ]);
    exit;
}

// 6. POST /api/admin/upload (Base64 file receiver)
if ($method === 'POST' && $endpoint === 'upload') {
    $body = getJsonBody();
    $name = isset($body['name']) ? $body['name'] : '';
    $type = isset($body['type']) ? $body['type'] : 'projects';
    $base64 = isset($body['base64']) ? $body['base64'] : '';

    if (empty($name) || empty($base64)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Missing filename or base64 data']);
        exit;
    }

    // Sanitize type
    $type = preg_replace('/[^a-zA-Z0-9_\-]/', '', $type);
    if (empty($type)) $type = 'general';
    $targetDir = $uploadsDir . '/' . $type;
    if (!is_dir($targetDir)) {
        @mkdir($targetDir, 0755, true);
    }
    @chmod($targetDir, 0755);

    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    $rawBase = pathinfo($name, PATHINFO_FILENAME);
    $cleanBase = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $rawBase);
    $cleanName = $cleanBase . '-' . substr(time(), -6) . ($ext ? '.' . $ext : '');
    $targetPath = $targetDir . '/' . $cleanName;

    // Strip Data URL prefix if present
    $dataPart = preg_replace('#^data:[^;]+;base64,#', '', $base64);
    $decoded = base64_decode($dataPart);

    if ($decoded === false) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid base64 encoding']);
        exit;
    }

    $written = @file_put_contents($targetPath, $decoded);
    if ($written === false) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Failed to write file to disk. Please verify uploads directory permissions.']);
        exit;
    }

    // Set world-readable permissions so Apache / LiteSpeed web server can serve the file directly
    @chmod($targetPath, 0644);

    $publicUrl = '/uploads/' . $type . '/' . $cleanName;
    echo json_encode([
        'ok' => true,
        'url' => $publicUrl,
        'name' => $cleanName,
        'type' => $type
    ]);
    exit;
}

// Fallback 404
http_response_code(404);
echo json_encode(['error' => 'Admin API endpoint not found']);

