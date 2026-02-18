const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const targetPath = path.join(__dirname, 'env-config.js');

let envVars = {};
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
            if (key) envVars[key] = value;
        }
    });
}

// Cuma export yang aman buat public
const publicEnv = {
    API_BASE_URL: envVars.API_BASE_URL || ''
};

fs.writeFileSync(targetPath, `window._env_ = ${JSON.stringify(publicEnv)};`);
console.log('✅ .env synced to Frontend successfully!');
