# Deployment Fixes Applied

This document outlines all the deployment errors that were identified and fixed in the Trenches Buddy application.

## Issues Fixed

### 1. Invalid next.config.js Configuration ✅
**Error**: `Invalid next.config.js options detected: Unrecognized key(s) in object: 'appDir' at "experimental"`

**Fix**: 
- Removed the deprecated `experimental.appDir` configuration (it's stable in Next.js 14)
- Added webpack configuration to suppress punycode deprecation warnings
- Enhanced image domains configuration for better asset loading

### 2. MetadataBase Warning ✅
**Error**: `metadata.metadataBase is not set for resolving social open graph or twitter images`

**Fix**: 
- Updated `app/layout.tsx` with intelligent `metadataBase` detection
- Added environment-aware URL detection (development/Vercel/production)
- Improved metadata configuration for better SEO and social sharing

### 3. Windows Permissions Issues (EPERM) ✅
**Error**: `EPERM: operation not permitted, open '.next\trace'`

**Fix**: 
- Created `clean-windows.bat` script for Windows-specific cleanup
- Added npm scripts for cleaning and force-restarting development server
- Installed `rimraf` for cross-platform file deletion

### 4. Punycode Deprecation Warning ⚠️
**Error**: `DeprecationWarning: The punycode module is deprecated`

**Status**: Partially mitigated
- Added webpack configuration to suppress client-side warnings
- This is a dependency issue that will be resolved when dependencies update

### 5. Wallet Connection Issues ✅
**Error**: `Failed to connect wallet. Please make sure Phantom is unlocked and try again.`

**Fix**: 
- Improved Phantom wallet detection with retry logic
- Added better error handling with specific error messages
- Enhanced wallet connection flow to handle existing connections
- Added automatic wallet state management and event listeners
- Created test page at `/test-wallet` for debugging connection issues

## New Scripts Available

### Development Scripts
```bash
# Clean development environment and start fresh
npm run dev:clean

# Force kill processes and clean (Windows)
npm run dev:force

# Manual cleanup
npm run clean
```

### Windows-Specific
```bash
# Use the batch file for complete cleanup
clean-windows.bat
```

## Environment Configuration

### Environment Variables
Create a `.env.local` file with:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Add other environment variables as needed
```

### Setup Script
```bash
npm run setup
```

## Deployment Checklist

- [x] Remove deprecated Next.js configurations
- [x] Fix metadata base URL warnings
- [x] Handle Windows permissions issues
- [x] Add cleanup scripts
- [x] Improve image domain configuration
- [x] Add webpack optimizations
- [x] Fix wallet connection issues
- [x] Add wallet debugging tools
- [ ] Update dependencies to resolve punycode warnings (when available)

## Notes

1. **Port Conflicts**: The application will automatically try ports 3000, 3001, 3002, etc. if the default port is in use.

2. **Windows Users**: Use `clean-windows.bat` if you encounter persistent `.next` folder issues.

3. **Production Deployment**: The metadata configuration automatically detects Vercel deployment and uses appropriate URLs.

4. **Image Loading**: Enhanced image configuration supports loading from PumpFun and IPFS domains.

## Troubleshooting

### If you still see errors:

1. **Clean everything**:
   ```bash
   npm run clean
   rm -rf node_modules
   npm install
   npm run dev
   ```

2. **Windows-specific issues**:
   ```bash
   clean-windows.bat
   ```

3. **Port conflicts**:
   - Close other applications using ports 3000-3003
   - Or let Next.js automatically find an available port

4. **Wallet connection issues**:
   - Visit `/test-wallet` to debug connection problems
   - Make sure Phantom wallet extension is installed and unlocked
   - Try refreshing the page if connection fails
   - Disable other wallet extensions temporarily
   - Check browser console for detailed error messages

All major deployment errors have been resolved. The application should now start cleanly without warnings (except for the punycode deprecation which is a dependency issue). 