$projectRoot = "c:\Users\sazid\OneDrive\Documents\GitHub\Next_js\realsteat_next - javascript"
$tsFiles = Get-ChildItem -LiteralPath $projectRoot -Recurse -Include "*.tsx","*.ts" | Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\.next" -and $_.Name -ne "next-env.d.ts" -and $_.Name -ne "next.config.ts" }
Write-Host "Found $($tsFiles.Count) files"
foreach ($file in $tsFiles) {
    $c = Get-Content -LiteralPath $file.FullName -Raw
    $c = $c -replace "import type \{[^}]+\} from [^;]+;\r?\n?", ""
    $c = $c -replace "import \{ type [^}]+ \} from [^;]+;\r?\n?", ""
    $c = $c -replace ",\s*type\s+\w+", ""
    $c = $c -replace "(?m)^type \w+ = [^;]+;\r?\n", ""
    $c = $c -replace "(?ms)^export interface \w+\r?\n\s+extends [^{]+\{[^}]+\}\r?\n\r?\n?", ""
    $c = $c -replace "(?ms)^interface \w+ \{[^}]+\}\r?\n\r?\n?", ""
    $c = $c -replace "useState<[^>]+>\(", "useState("
    $c = $c -replace "useRef<[^>]+>\(", "useRef("
    $c = $c -replace "React\.forwardRef<[^>]+>\(", "React.forwardRef("
    $c = $c -replace "\(request: NextRequest\)", "(request)"
    $c = $c -replace "\(\.\.\.\w+: \w+\[\]\)", "(...inputs)"
    $c = $c -replace ": Metadata ", " "
    $c = $c -replace "}: Readonly<\{\r?\n\s+children: React\.ReactNode;\r?\n\}>", "}"
    $c = $c -replace "\}: \{\r?\n\s+children: React\.ReactNode;\r?\n\}", "}"
    $c = $c -replace "\}: \w+Props\) \{", "}) {"
    $c = $c -replace "\}: \w+Props\)", "}"
    $c = $c -replace "\}: ThemeProviderProps\)", "}"
    $c = $c -replace "\(e: React\.FormEvent\)", "(e)"
    $c = $c -replace "\(e: React\.ChangeEvent<\w+>\)", "(e)"
    $c = $c -replace "\(e: React\.DragEvent\)", "(e)"
    $c = $c -replace "\(e: React\.KeyboardEvent\)", "(e)"
    $c = $c -replace "\(event: MouseEvent\)", "(event)"
    $c = $c -replace " as Node\)", ")"
    $c = $c -replace "\((\w+): number\)", '($1)'
    $c = $c -replace "\((\w+): string\)", '($1)'
    $c = $c -replace "\((\w+): string, (\w+): number\)", '($1, $2)'
    $c = $c -replace " as const", ""
    $c = $c -replace ": Record<string, any>", ""
    $c = $c -replace "catch \((\w+): any\)", 'catch ($1)'
    $c = $c -replace "\{ params \}: \{ params: Promise<\{ id: string \}> \}", "{ params }"
    $c = $c -replace "const data: \w+ =", "const data ="
    $c = $c -replace '\(mode: "add" \| "edit", category\?: Category\)', "(mode, category)"
    $c = $c -replace '\(mode: "add" \| "edit"\)', "(mode)"
    $c = $c -replace "import \{ ReactNode \} from ""react"";\r?\n", ""
    if ($file.Extension -eq ".tsx") { $n = [IO.Path]::ChangeExtension($file.FullName, ".jsx") }
    else { $n = [IO.Path]::ChangeExtension($file.FullName, ".js") }
    Set-Content -LiteralPath $n -Value $c -NoNewline
    Remove-Item -LiteralPath $file.FullName -Force
    Write-Host "OK: $($file.Name) -> $([IO.Path]::GetFileName($n))"
}
Write-Host "Done!"
