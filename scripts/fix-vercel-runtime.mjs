import fs from 'node:fs';
import path from 'node:path';

const functionsDir = path.resolve('.vercel/output/functions');

if (fs.existsSync(functionsDir)) {
  const entries = fs.readdirSync(functionsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.endsWith('.func')) {
      const configPath = path.join(functionsDir, entry.name, '.vc-config.json');
      if (fs.existsSync(configPath)) {
        try {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          if (config.runtime === 'nodejs18.x') {
            config.runtime = 'nodejs20.x';
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            console.log(`[fix-runtime] Updated ${entry.name} runtime from nodejs18.x to nodejs20.x`);
          }
        } catch (err) {
          console.error(`[fix-runtime] Failed to update ${configPath}:`, err);
        }
      }
    }
  }
}
