$layoutFiles = @(
    'd:\slidexy-frontend\slidesX-FE - Copy\src\app\components\layouts\InfographicBulletsHTML.tsx',
    'd:\slidexy-frontend\slidesX-FE - Copy\src\app\components\layouts\TimelineSlideHTML.tsx',
    'd:\slidexy-frontend\slidesX-FE - Copy\src\app\components\layouts\SplitContentHTML.tsx',
    'd:\slidexy-frontend\slidesX-FE - Copy\src\app\components\layouts\CoverSlideHTML.tsx',
    'd:\slidexy-frontend\slidesX-FE - Copy\src\app\components\layouts\ContentRightImageHTML.tsx',
    'd:\slidexy-frontend\slidesX-FE - Copy\src\app\components\layouts\ContentLeftImageHTML.tsx',
    'd:\slidexy-frontend\slidesX-FE - Copy\src\app\components\layouts\ConclusionSlideHTML.tsx',
    'd:\slidexy-frontend\slidesX-FE - Copy\src\app\components\layouts\ComparisonSlideHTML.tsx',
    'd:\slidexy-frontend\slidesX-FE - Copy\src\app\components\layouts\QuoteSlideHTML.tsx',
    'd:\slidexy-frontend\slidesX-FE - Copy\src\app\components\layouts\FullImageTextOverlayHTML.tsx'
)

$fixedCount = 0

foreach ($file in $layoutFiles) {
    if (Test-Path $file) {
        Write-Output "Processing: $file"
        $content = Get-Content $file -Raw
        $originalContent = $content
        
        # Fix 1: Add elementProperties to bullet elements (using bullet variable)
        # Pattern: EditableElement with bullet.text but no elementProperties
        $content = $content -replace '(<EditableElement[^>]*text=\{[^}]*bullet\.text[^}]*\}[^>]*)(onSelectElement=)', '$1elementProperties={bullet.properties || {}} $2'
        
        # Fix 2: Add elementProperties to title elements
        $content = $content -replace '(<EditableElement[^>]*id=\{`title-[^`]*`\}[^>]*)(onSelectElement=)', '$1elementProperties={slide.slide_title?.properties || {}} $2'
        
        # Fix 3: Add elementProperties to subtitle elements
        $content = $content -replace '(<EditableElement[^>]*id=\{`subtitle-[^`]*`\}[^>]*)(onSelectElement=)', '$1elementProperties={slide.subtitle?.properties || {}} $2'
        
        if ($content -ne $originalContent) {
            Set-Content $file $content  
            $fixedCount++
            Write-Output "  ✓ Fixed elementProperties in $file"
        } else {
            Write-Output "  - No changes needed in $file"
        }
    } else {
        Write-Output "  ✗ File not found: $file"
    }
}

Write-Output ""
Write-Output "================================"
Write-Output "Fixed $fixedCount layout files"
Write-Output "================================"
