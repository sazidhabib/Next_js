# PowerShell script to convert TypeScript project to JavaScript
$projectRoot = $PSScriptRoot

# Get all .tsx and .ts files (excluding node_modules, .next, and config files)
$tsFiles = Get-ChildItem -LiteralPath $projectRoot -Recurse -Include "*.tsx","*.ts" |
    Where-Object {
        $_.FullName -notmatch [regex]::Escape("node_modules") -and
        $_.FullName -notmatch [regex]::Escape(".next") -and
        $_.Name -ne "next-env.d.ts" -and
        $_.Name -ne "next.config.ts"
    }

Write-Host "Found $($tsFiles.Count) files to convert"

foreach ($file in $tsFiles) {
    $content = Get-Content -LiteralPath $file.FullName -Raw

    # Remove import type lines
    $content = $content -replace "import type \{[^}]+\} from [^;]+;\r?\n?", ""
    # Remove { type X } imports
    $content = $content -replace "import \{ type [^}]+ \} from [^;]+;\r?\n?", ""
    # Remove , type X from mixed imports
    $content = $content -replace ",\s*type\s+\w+", ""
    # Remove type alias lines like: type Tab = ...;
    $content = $content -replace "(?m)^type \w+ = [^;]+;\r?\n", ""
    # Remove interface blocks (multiline)
    $content = $content -replace "(?ms)^export interface \w+\r?\n\s+extends [^{]+\{[^}]+\}\r?\n\r?\n?", ""
    $content = $content -replace "(?ms)^interface \w+ \{[^}]+\}\r?\n\r?\n?", ""
    # Remove generic type params from hooks
    $content = $content -replace "useState<[^>]+>\(", "useState("
    $content = $content -replace "useRef<[^>]+>\(", "useRef("
    $content = $content -replace "React\.forwardRef<[^>]+>\(", "React.forwardRef("
    # Remove parameter type annotations
    $content = $content -replace "\(request: NextRequest\)", "(request)"
    $content = $content -replace "\(\.\.\.\w+: \w+\[\]\)", "(...inputs)"
    $content = $content -replace ": Metadata ", " "
    # Remove Readonly<{children: React.ReactNode}> and similar destructured types
    $content = $content -replace "}: Readonly<\{\r?\n\s+children: React\.ReactNode;\r?\n\}>", "}"
    $content = $content -replace "\}: \{\r?\n\s+children: React\.ReactNode;\r?\n\}", "}"
    # Remove typed destructuring: }: TypeNameProps) { or }: TypeNameProps)
    $content = $content -replace "\}: \w+Props\) \{", "}) {"
    $content = $content -replace "\}: \w+Props\)", "}"
    $content = $content -replace "\}: ThemeProviderProps\)", "}"
    # Remove event handler types
    $content = $content -replace "\(e: React\.FormEvent\)", "(e)"
    $content = $content -replace "\(e: React\.ChangeEvent<\w+>\)", "(e)"
    $content = $content -replace "\(e: React\.DragEvent\)", "(e)"
    $content = $content -replace "\(e: React\.KeyboardEvent\)", "(e)"
    # Remove function parameter types like (event: MouseEvent)
    $content = $content -replace "\(event: MouseEvent\)", "(event)"
    # Remove "as Node" casts 
    $content = $content -replace " as Node\)", ")"
    # Remove simple param types: (name: number), (name: string)
    $content = $content -replace "\((\w+): number\)", '($1)'
    $content = $content -replace "\((\w+): string\)", '($1)'
    $content = $content -replace "\((\w+): string, (\w+): number\)", '($1, $2)'
    # Remove as const
    $content = $content -replace " as const", ""
    # Remove Record<string, any>
    $content = $content -replace ": Record<string, any>", ""
    # Remove catch type annotations
    $content = $content -replace "catch \((\w+): any\)", 'catch ($1)'
    # Remove async function param types like { params }: { params: Promise<{ id: string }> }
    $content = $content -replace "\{ params \}: \{ params: Promise<\{ id: string \}> \}", "{ params }"
    # Remove typed const declarations
    $content = $content -replace "const data: \w+ =", "const data ="
    # Remove complex union type params
    $content = $content -replace '\(mode: "add" \| "edit", category\?: Category\)', "(mode, category)"
    $content = $content -replace '\(mode: "add" \| "edit"\)', "(mode)"
    # Remove ReactNode import  
    $content = $content -replace "import \{ ReactNode \} from ""react"";\r?\n", ""

    # Determine new extension
    if ($file.Extension -eq ".tsx") {
        $newName = [System.IO.Path]::ChangeExtension($file.FullName, ".jsx")
    } else {
        $newName = [System.IO.Path]::ChangeExtension($file.FullName, ".js")
    }

    Set-Content -LiteralPath $newName -Value $content -NoNewline
    Remove-Item -LiteralPath $file.FullName -Force
    Write-Host "Converted: $($file.Name) -> $([System.IO.Path]::GetFileName($newName))"
}

Write-Host "`n=== Conversion complete! ==="
