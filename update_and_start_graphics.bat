@echo off
setlocal EnableDelayedExpansion

set "BRANCH="
set "OLD_COMMIT="
set "NEW_COMMIT="
set "WAS_UPDATED=0"
set "DEPS_CHANGED=0"

REM ----------------------------------------
REM Detect current branch
REM ----------------------------------------
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD 2^>nul') do (
    set "BRANCH=%%b"
)

if defined BRANCH (
    echo Current branch: !BRANCH!
    git fetch origin >nul 2>nul

    for /f "delims=" %%h in ('git rev-parse HEAD') do set "OLD_COMMIT=%%h"

    git pull --ff-only >nul 2>nul

    for /f "delims=" %%h in ('git rev-parse HEAD') do set "NEW_COMMIT=%%h"

    if not "!OLD_COMMIT!"=="!NEW_COMMIT!" (
        set "WAS_UPDATED=1"
        echo Repository updated.
    )
) else (
    echo Not inside a git repository.
)

REM ----------------------------------------
REM Check if dependencies need installing
REM ----------------------------------------

if not exist node_modules (
    echo node_modules missing. Installing dependencies...
    set "DEPS_CHANGED=1"
)

REM If lockfile is newer than node_modules, reinstall
if exist package-lock.json (
    for %%F in (package-lock.json) do set LOCKTIME=%%~tF
    for %%F in (node_modules) do set NODETIME=%%~tF
    if "!LOCKTIME!" GTR "!NODETIME!" (
        echo Lockfile newer than node_modules.
        set "DEPS_CHANGED=1"
    )
)

if "!DEPS_CHANGED!"=="1" (
    if exist package-lock.json (
        call npm ci --omit=dev
    ) else (
        call npm install --omit=dev
    )
)

REM ----------------------------------------
REM Check if build is needed
REM ----------------------------------------

if not exist dist (
    echo Build output missing. Building project...
    call npm run build
) else (
    if "!WAS_UPDATED!"=="1" (
        echo Changes pulled. Rebuilding...
        call npm run build
    )
)

REM ----------------------------------------
REM Start app
REM ----------------------------------------

echo Starting application...
call npm run start

endlocal