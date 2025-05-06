// This file helps load CommonJS modules in an ESM project
// It uses the createRequire API to allow require() in ESM context
import { createRequire } from 'module';
global.require = createRequire(import.meta.url);
