# if (Test-Path .\build) { Remove-Item .\build -Recurse -Force }
tsc --build
Copy-Item .\src\.env .\build\.env
Set-Location build
node index.js