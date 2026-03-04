# PowerShell script to convert TypeScript project to JavaScript
# This script:
# 1. Converts all .tsx/.ts files to .jsx/.js (removing TS-specific syntax)
# 2. Updates config files
# 3. Cleans up TS-related files

$projectRoot = "c:\Users\sazid\OneDrive\Documents\GitHub\Next_js\realsteat_next"

# Get all .tsx and .ts files (excluding node_modules, .next, and .d.ts files)
$tsFiles = Get-ChildItem -Path $projectRoot -Recurse -Include "*.tsx","*.ts" |
    Where-Object {
        $_.FullName -notmatch "node_modules" -and
        $_.FullName -notmatch "\.next" -and
        $_.Name -ne "next-env.d.ts" -and
        $_.Name -ne "next.config.ts"
    }

foreach ($file in $tsFiles) {
    $content = Get-Content -Path $file.FullName -Raw

    # Remove "import type { ... } from '...';" lines (entire line)
    $content = $content -replace "import type \{[^}]+\} from [^;]+;\r?\n?", ""

    # Remove "import { type ThemeProviderProps } from 'next-themes';" style (type-only imports with named import)
    # e.g., import { type ThemeProviderProps } from "next-themes";
    $content = $content -replace "import \{ type [^}]+ \} from [^;]+;\r?\n?", ""

    # For mixed imports like: import { clsx, type ClassValue } from "clsx"
    # Remove the ", type ClassValue" part
    $content = $content -replace ",\s*type\s+\w+", ""

    # Remove interface blocks: interface Name { ... }
    $content = $content -replace "(?ms)^interface \w+Props \{[^}]+\}\r?\n\r?\n?", ""
    $content = $content -replace "(?ms)^interface \w+ \{[^}]+\}\r?\n\r?\n?", ""
    # Handle interface blocks that extend other types
    $content = $content -replace "(?ms)^export interface \w+\r?\n\s+extends [^{]+\{[^}]+\}\r?\n\r?\n?", ""

    # Remove generic type parameters from useState: useState<Type>( -> useState(
    $content = $content -replace "useState<[^>]+>\(", "useState("

    # Remove generic type parameters from useRef: useRef<Type>( -> useRef(
    $content = $content -replace "useRef<[^>]+>\(", "useRef("

    # Remove generic type parameters from React.forwardRef<...>( -> React.forwardRef(
    $content = $content -replace "React\.forwardRef<[^>]+>\(", "React.forwardRef("

    # Remove type annotations from function parameters
    # e.g., (request: NextRequest) -> (request)
    $content = $content -replace "\(request: NextRequest\)", "(request)"

    # e.g., (...inputs: ClassValue[]) -> (...inputs)
    $content = $content -replace "\(\.\.\.\w+: \w+\[\]\)", "(...inputs)"

    # Remove ": Metadata" type annotations on exports
    $content = $content -replace ": Metadata ", " "

    # Remove Readonly<{ children: React.ReactNode }> type for layout props
    # }: Readonly<{\n  children: React.ReactNode;\n}>) -> }) 
    $content = $content -replace "}: Readonly<\{\r?\n\s+children: React\.ReactNode;\r?\n\}>", "}"

    # Remove simple children type annotation: }: { children: React.ReactNode; }
    $content = $content -replace "\}: \{\r?\n\s+children: React\.ReactNode;\r?\n\}", "}"

    # Remove }: PropertyCardProps) or similar typed destructuring: }: TypeName)
    $content = $content -replace "\}: \w+Props\)", "}"

    # Remove }: HeroSliderProps) 
    $content = $content -replace "\}: \w+Props\) \{", "}) {"

    # Remove }: ThemeProviderProps)
    $content = $content -replace "\}: ThemeProviderProps\)", "}"

    # Remove function parameter types like (e: React.FormEvent) -> (e)
    $content = $content -replace "\(e: React\.FormEvent\)", "(e)"
    $content = $content -replace "\(e: React\.ChangeEvent<\w+>\)", "(e)"
    $content = $content -replace "\(e: React\.DragEvent\)", "(e)"
    
    # Remove parameter type annotations: (indexToRemove: number) -> (indexToRemove)
    $content = $content -replace "\((\w+): number\)", '($1)'

    # Remove parameter type annotations: (status: string) -> (status)
    $content = $content -replace "\((\w+): string\)", '($1)'

    # Remove parameter type annotations in arrow functions: (id: number) -> (id)
    # Already covered above

    # Remove "as const" assertions
    $content = $content -replace " as const", ""

    # Remove Record<string, any> = -> =
    $content = $content -replace ": Record<string, any>", ""

    # Remove catch type annotations: catch (err: any) -> catch (err)
    $content = $content -replace "catch \((\w+): any\)", 'catch ($1)'

    # Remove inline parameter type annotations: { params }: { params: Promise<{ id: string }> }
    $content = $content -replace "\{ params \}: \{ params: Promise<\{ id: string \}> \}", "{ params }"

    # Remove ": SiteSettings" and similar type annotations after const/variable assignments
    $content = $content -replace "const data: \w+ =", "const data ="

    # Remove "(amenity: string, idx: number)" -> "(amenity, idx)"
    $content = $content -replace "\((\w+): string, (\w+): number\)", '($1, $2)'

    # Remove "<Partial<Category>>" from useState
    # Already handled by the generic useState removal

    # Remove "mode: "add" | "edit"" parameter type
    $content = $content -replace '\(mode: "add" \| "edit", category\?: Category\)', "(mode, category)"
    $content = $content -replace '\(mode: "add" \| "edit"\)', "(mode)"

    # Import { ReactNode } from "react" -> remove if only type import
    $content = $content -replace "import \{ ReactNode \} from ""react"";\r?\n", ""

    # Remove "{ children, delay = 0, direction = ""up"", className = """" }: FadeInProps" destructuring type
    # This was already handled by the generic Props removal

    # Determine new extension
    if ($file.Extension -eq ".tsx") {
        $newName = $file.FullName -replace "\.tsx$", ".jsx"
    } else {
        $newName = $file.FullName -replace "\.ts$", ".js"
    }

    # Write the converted content to the new file
    Set-Content -Path $newName -Value $content -NoNewline

    # Delete the old file
    Remove-Item -Path $file.FullName

    Write-Host "Converted: $($file.Name) -> $([System.IO.Path]::GetFileName($newName))"
}

# --- Handle next.config.ts separately ---
$nextConfigPath = Join-Path $projectRoot "next.config.ts"
if (Test-Path $nextConfigPath) {
    $content = Get-Content -Path $nextConfigPath -Raw
    # Remove: import type { NextConfig } from "next";
    $content = $content -replace "import type \{ NextConfig \} from ""next"";\r?\n\r?\n?", ""
    # Remove: const nextConfig: NextConfig = 
    $content = $content -replace "const nextConfig: NextConfig =", "const nextConfig ="
    
    $newPath = Join-Path $projectRoot "next.config.mjs"
    Set-Content -Path $newPath -Value $content -NoNewline
    Remove-Item -Path $nextConfigPath
    Write-Host "Converted: next.config.ts -> next.config.mjs"
}

# --- Delete TS config files ---
$filesToDelete = @(
    "tsconfig.json",
    "tsconfig.tsbuildinfo",
    "next-env.d.ts"
)

foreach ($f in $filesToDelete) {
    $path = Join-Path $projectRoot $f
    if (Test-Path $path) {
        Remove-Item -Path $path
        Write-Host "Deleted: $f"
    }
}

# --- Update eslint.config.mjs ---
$eslintPath = Join-Path $projectRoot "eslint.config.mjs"
if (Test-Path $eslintPath) {
    $content = Get-Content -Path $eslintPath -Raw
    # Remove the typescript import
    $content = $content -replace 'import nextTs from "eslint-config-next/typescript";\r?\n', ""
    # Remove the ...nextTs spread
    $content = $content -replace "\s+\.\.\.nextTs,\r?\n", "`n"
    Set-Content -Path $eslintPath -Value $content -NoNewline
    Write-Host "Updated: eslint.config.mjs"
}

# --- Update package.json ---
$packagePath = Join-Path $projectRoot "package.json"
if (Test-Path $packagePath) {
    $json = Get-Content -Path $packagePath -Raw | ConvertFrom-Json
    
    # Remove TS-related devDependencies
    $toRemove = @("typescript", "@types/node", "@types/react", "@types/react-dom")
    foreach ($dep in $toRemove) {
        if ($json.devDependencies.PSObject.Properties[$dep]) {
            $json.devDependencies.PSObject.Properties.Remove($dep)
            Write-Host "Removed devDependency: $dep"
        }
    }
    
    $json | ConvertTo-Json -Depth 10 | Set-Content -Path $packagePath
    Write-Host "Updated: package.json"
}

# --- Delete .next build cache ---
$nextDir = Join-Path $projectRoot ".next"
if (Test-Path $nextDir) {
    Remove-Item -Path $nextDir -Recurse -Force
    Write-Host "Deleted: .next/ build cache"
}

Write-Host ""
Write-Host "=== Conversion complete! ==="
Write-Host "Next steps:"
Write-Host "  1. Run 'npm install' to clean up dependencies"
Write-Host "  2. Run 'npm run dev' to test the dev server"
