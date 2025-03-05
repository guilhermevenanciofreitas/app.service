[Setup]
AppName=Printer
AppVersion=1.0
DefaultDirName=C:\tools\printer
DefaultGroupName=Printer
OutputDir=.
OutputBaseFilename=printer
Compression=lzma
SolidCompression=yes
DisableDirPage=yes

[Files]
Source: "{#SourcePath}\bin\Release\net9.0-windows\*.*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Registry]
Root: HKCR; Subkey: "tools.printer"; ValueType: string; ValueData: "URL:Tools Printer Protocol"; Flags: uninsdeletekey
Root: HKCR; Subkey: "tools.printer"; ValueType: string; ValueName: "URL Protocol"; ValueData: ""; Flags: uninsdeletevalue
Root: HKCR; Subkey: "tools.printer\shell\open\command"; ValueType: string; ValueData: """{app}\printer.exe"" ""%1"""; Flags: uninsdeletekey
