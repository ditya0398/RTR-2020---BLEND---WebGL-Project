cl.exe /EHsc /c /I C:\glew-2.1.0-win32\glew-2.1.0\include Source.cpp
rc.exe MyWindow.rc
link.exe Source.obj MyWindow.res /LIBPATH:C:\glew-2.1.0-win32\glew-2.1.0\lib\Release\Win32 user32.lib gdi32.lib kernel32.lib /SUBSYSTEM:WINDOWS
Source.exe