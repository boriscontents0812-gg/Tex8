import { createServer } from 'vite';
import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('----------------------------------------------------');
console.log('🚀 Starting Message Video Generator (Tex8)...');
console.log('----------------------------------------------------');

// Start backend server via fork (space-safe on Windows)
const serverProcess = fork(path.join(__dirname, 'server', 'server.js'), [], {
  cwd: __dirname,
  stdio: 'inherit'
});

// Start Vite dev server programmatically
try {
  const vite = await createServer({
    configFile: path.join(__dirname, 'vite.config.js'),
    root: __dirname,
    server: {
      port: 5173,
      host: true
    }
  });

  await vite.listen();
  vite.printUrls();
  console.log('----------------------------------------------------');
  console.log('✨ Message Video Generator is live at http://localhost:5173');
  console.log('----------------------------------------------------');
} catch (err) {
  console.error('Failed to start Vite server:', err);
}

process.on('SIGINT', () => {
  serverProcess.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  serverProcess.kill();
  process.exit();
});
