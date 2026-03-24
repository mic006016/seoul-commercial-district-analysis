@echo off
set MYSQL="mysql.exe"
set HOST=127.0.0.1
set PORT=3308
set USER=root
set DB=startupdb
set FOLDER=D:\_StartupProject\StartupServer\_dbtablesql

echo === Importing SQL files ===
for %%f in ("%FOLDER%\startupdb_*.sql") do (
    echo Importing %%f
    %MYSQL% -h %HOST% -P %PORT% -u %USER% -p %DB% < "%%f"
)

echo === Import Finished ===
pause
