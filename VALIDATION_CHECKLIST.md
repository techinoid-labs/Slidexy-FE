# Integration Validation Checklist

## ✅ Pre-Installation Checks

- [ ] Node.js and npm are installed
- [ ] You have access to get API keys from:
  - [ ] Firecrawl (https://firecrawl.dev)
  - [ ] Groq (https://console.groq.com)
  - [ ] Anthropic (https://console.anthropic.com)
  - [ ] OpenAI (https://platform.openai.com)
  - [ ] Gemini (https://aistudio.google.com/app/apikey)

## ✅ Installation Validation

### 1. File Structure Check
```bash
cd "C:\Users\hp\Videos\lovable\open-lovable\frontend"
```

Check these folders exist:
- [ ] `src/app/website/`
- [ ] `src/atoms/`
- [ ] `src/website-components/`
- [ ] `src/website-hooks/`
- [ ] `src/website-lib/`
- [ ] `src/website-utils/`
- [ ] `src/website-types/`
- [ ] `src/website-config/`
- [ ] `src/website-packages/`
- [ ] `src/website-styles/`
- [ ] `src/colors.json`

### 2. Configuration Files Check
- [ ] `package.json` includes new dependencies
- [ ] `.env` includes new environment variables
- [ ] `tsconfig.json` exists and is valid
- [ ] `next.config.ts` exists

### 3. Dependencies Installation
```bash
npm install
```
- [ ] Installation completes without errors
- [ ] No peer dependency warnings (or acceptable)
- [ ] `node_modules/` folder populated

### 4. Environment Variables Setup
Check `.env` file has:
- [ ] FIRECRAWL_API_KEY=...
- [ ] SANDBOX_PROVIDER=vercel
- [ ] GROQ_API_KEY=...
- [ ] ANTHROPIC_API_KEY=...
- [ ] OPENAI_API_KEY=...
- [ ] GEMINI_API_KEY=...

## ✅ Runtime Validation

### 5. Application Starts
```bash
npm run dev
```
- [ ] Development server starts successfully
- [ ] No compilation errors
- [ ] Terminal shows "Ready" message
- [ ] Shows port (default: 3000)

### 6. Slidexy Routes Work (Original Functionality)
Visit and verify:
- [ ] http://localhost:3000/ loads
- [ ] http://localhost:3000/presentation/create works
- [ ] http://localhost:3000/editor works (if applicable)
- [ ] http://localhost:3000/infographic works (if applicable)
- [ ] All existing Slidexy features work normally

### 7. Website Builder Routes Work (New Functionality)
Visit and verify:
- [ ] http://localhost:3000/website loads
- [ ] Page renders without errors
- [ ] Hero section displays
- [ ] Input field is functional
- [ ] Search/scrape functionality accessible

### 8. Website Builder Features
- [ ] Can enter a URL or search term
- [ ] Search returns results (if API keys configured)
- [ ] Can click on search results
- [ ] Generation page loads: http://localhost:3000/website/generation
- [ ] Builder interface loads: http://localhost:3000/website/builder

## ✅ API Integration Checks

### 9. Firecrawl Integration
- [ ] Can scrape a website URL
- [ ] Scraping returns content
- [ ] No CORS errors

### 10. AI Model Integration
Test each model (if keys configured):
- [ ] Groq model works
- [ ] Claude (Anthropic) works
- [ ] GPT (OpenAI) works
- [ ] Gemini works

### 11. Sandbox Integration
- [ ] Vercel sandbox initializes
- [ ] Can create a sandbox
- [ ] Code executes in sandbox
- [ ] Preview renders

## ✅ Browser Console Checks

Open Developer Tools (F12) and verify:
- [ ] No critical errors in Console
- [ ] No 404 errors for assets
- [ ] No module loading errors
- [ ] WebSocket connections work (if applicable)

## ✅ Code Quality Checks

### 12. TypeScript Compilation
```bash
npm run build
```
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] Build outputs to `.next/`

### 13. Linting
```bash
npm run lint
```
- [ ] Lint passes or shows only warnings
- [ ] No critical lint errors

## ✅ Isolation Validation

### 14. Slidexy Code Untouched
Verify these folders were NOT modified:
- [ ] `src/app/presentation/`
- [ ] `src/app/editor/`
- [ ] `src/app/infographic/`
- [ ] `src/components/` (original)
- [ ] `src/context/`
- [ ] `src/store/`
- [ ] `src/slice/`

### 15. No Conflicts
- [ ] No duplicate component names
- [ ] No import path conflicts
- [ ] Original Slidexy imports still work
- [ ] Website builder imports work

## ✅ Performance Checks

### 16. Loading Performance
- [ ] Initial page load < 3 seconds
- [ ] Route changes are smooth
- [ ] No memory leaks visible
- [ ] Browser doesn't hang

### 17. Resource Usage
- [ ] Bundle size reasonable (check `.next/` after build)
- [ ] No excessive API calls
- [ ] Images load properly

## 🐛 Common Issues & Solutions

### Issue: "Module not found" errors
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Environment variables not loading
**Solution**: 
```bash
# Restart the dev server
# Verify .env file has no syntax errors
# Check .env file is in frontend/ root
```

### Issue: TypeScript errors about missing types
**Solution**: 
```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

### Issue: Port 3000 already in use
**Solution**: 
```bash
# Find and kill the process using port 3000
# Or run on different port:
npm run dev -- -p 3001
```

### Issue: Vercel sandbox fails to initialize
**Solution**: 
```bash
vercel link
vercel env pull
# Or use E2B sandbox instead in .env:
# SANDBOX_PROVIDER=e2b
# E2B_API_KEY=your_key
```

## 📊 Final Validation Summary

### All Green? You're Good to Go! 🎉

Count your checkmarks:
- **30+ checks passed**: Perfect integration! ✅
- **25-29 checks passed**: Good, minor issues to fix
- **20-24 checks passed**: Needs attention
- **< 20 checks passed**: Review WEBSITE_INTEGRATION_GUIDE.md

## 📝 Notes

**Date Completed**: __________________

**Issues Encountered**: 
_________________________________________
_________________________________________
_________________________________________

**Solutions Applied**: 
_________________________________________
_________________________________________
_________________________________________

## 📧 Support

If you encounter persistent issues:
1. Check `WEBSITE_INTEGRATION_GUIDE.md` for detailed info
2. Review `QUICK_START.md` for setup steps
3. Check browser console for specific error messages
4. Verify all API keys are valid and have proper permissions

---

**Integration Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete | ⬜ Issues Found
