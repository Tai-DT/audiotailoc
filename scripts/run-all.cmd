@echo off
start "backend" /D "C:\Users\use\OneDrive\Tài liệu\code\audiotailoc\backend" cmd /k "npm install && npm run dev"
start "frontend" /D "C:\Users\use\OneDrive\Tài liệu\code\audiotailoc\frontend" cmd /k "npm install && npm run dev"
start "dashboard" /D "C:\Users\use\OneDrive\Tài liệu\code\audiotailoc\dashboard" cmd /k "npm install && npm run dev"