@echo off
setlocal EnableDelayedExpansion

set "BRANCH="
set "REMOTE_AHEAD=0"
set "WAS_UPDATED=0"
set "OLD_COMMIT="
set "NEW_COMMIT="

REM Get branch
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD 2^>nul') do (
    set "BRANCH=%%b"
)

if not defined BRANCH (
    echo Not inside a git repository.
    goto :startapp
)

echo Current branch: !BRANCH!
git fetch origin >nul 2>nul

for /f "delims=" %%c in ('git rev-list --count HEAD..origin/!BRANCH! 2^>nul') do (
    set "REMOTE_AHEAD=%%c"
)

echo Remote ahead count: !REMOTE_AHEAD!

if not "!REMOTE_AHEAD!"=="0" (
    set "WAS_UPDATED=1"
    echo Pulling updates...

    for /f "delims=" %%h in ('git rev-parse HEAD') do set "OLD_COMMIT=%%h"

    git pull --ff-only

    for /f "delims=" %%h in ('git rev-parse HEAD') do set "NEW_COMMIT=%%h"
)

if "!WAS_UPDATED!"=="1" (
    if not "!OLD_COMMIT!"=="!NEW_COMMIT!" (
        echo Updated from !OLD_COMMIT! to !NEW_COMMIT!

        set "DIFFFILE=%TEMP%\pulldiff_!RANDOM!.tmp"
        git diff --name-only !OLD_COMMIT! !NEW_COMMIT! > "!DIFFFILE!" 2>nul

        set "DEPS_CHANGED=0"

        findstr /I /C:"package.json" /C:"package-lock.json" /C:"package-lock.yaml" /C:"pnpm-lock.yaml" /C:"yarn.lock" "!DIFFFILE!" >nul 2>nul
        if not errorlevel 1 set "DEPS_CHANGED=1"

        if "!DEPS_CHANGED!"=="1" (
            echo Dependencies changed.
            if exist node_modules rd /s /q node_modules

            if exist package-lock.json (
                npm ci --omit=dev
            ) else (
                npm install --omit=dev
            )
        )

        echo Building project...
        npm run build

        if exist "!DIFFFILE!" del "!DIFFFILE!" >nul 2>nul
    )
)

:startapp
echo Starting application...
npm run start

endlocal
