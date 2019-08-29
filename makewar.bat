set name=%1
set version=%2
cd ./build
jar cvf workbench.war .
setlocal enableextensions
for /f %%x in ('powershell -Command "Get-Date -format yyyyMMddHHmmss" ') do set datetime=%%x
mkdir libs
move workbench.war libs/%name%-%version%.%datetime%.war
mkdir www
move *.* www
move static www
move WEB-INF www