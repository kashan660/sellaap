@echo off
echo 🚀 Creating new Vercel project with correct environment variables...
echo.

REM Create new Vercel project with environment variables
echo 📦 Setting up new Vercel project...
vercel --yes --name=sellaap-new --env DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19SVFVfUGNoX1hOYmtKN3paYlltbC0iLCJhcGlfa2V5IjoiMDFLRjEwQllCVDNZV1FLVzUwUVBCQUFYUkciLCJ0ZW5hbnRfaWQiOiI5NjAyOGMyYzZmZWM4NzQ4ZTcxMmQ3NDJiNzAzMGVkNGUxNjEzNzIyZjgzYmMxNjNjNDcwNDU3MDAzY2U3OTYwIiwiaW50ZXJuYWxfc2VjcmV0IjoiN2MzOTg4ZmItMTA3NS00ZjA0LWJlMzItNjk1YmNiM2Y3YzQxIn0.WMRMpdSX7tyqZMdy05XNTdd7t62-KZJnTcmSaD3LlNc" --env DIRECT_URL="postgres://96028c2c6fec8748e712d742b7030ed4e1613722f83bc163c470457003ce7960:sk_RTU_Pch_XNbkJ7zZbYml-@db.prisma.io:5432/postgres?sslmode=require" --env NEXTAUTH_SECRET="supersecretkey123" --env NEXTAUTH_URL="https://sellaap-new.vercel.app"

echo.
echo ✅ New Vercel project created successfully!
echo 🌐 Your website should be live at the URL provided above.
echo.
pause