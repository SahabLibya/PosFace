const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const outputFileName = 'full-codebase.txt';

// Directories to ignore
const ignoredDirs = [
    'node_modules',
    '.next',
    '.git',
    '.vscode',
    'build',
    'dist',
    'public' // Optional: usually contains images, un-comment if you need static assets
];

// Files to ignore completely
const ignoredFiles = [
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    '.DS_Store',
    '.env',          // SECURITY: Don't share env vars
    '.env.local',
    'bundle.js',     // Don't scan this script itself
    outputFileName   // Don't scan the output file
];

// File extensions to include (add more if needed)
const allowedExtensions = [
    '.js', '.jsx',
    '.ts', '.tsx',
    '.css', '.scss', '.sass', '.less',
    '.json', // For package.json, tsconfig.json
    '.md',   // Markdown documentation
    '.mjs',
    '.cjs'
];

// --- MAIN LOGIC ---

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);

        // Check if directory
        if (fs.statSync(fullPath).isDirectory()) {
            if (!ignoredDirs.includes(file)) {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            // Check if file should be included
            if (!ignoredFiles.includes(file) && allowedExtensions.includes(path.extname(file))) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

function run() {
    console.log('🔍 Scanning project files...');

    try {
        const allFiles = getAllFiles(__dirname, []);
        let outputContent = '';

        console.log(`📂 Found ${allFiles.length} files to process.`);

        allFiles.forEach(filePath => {
            // Create a relative path for cleaner reading (e.g., src/app/page.tsx)
            const relativePath = path.relative(__dirname, filePath);

            const fileContent = fs.readFileSync(filePath, 'utf8');

            // Add a clean header for each file so AI knows where it is
            outputContent += `\n\n================================================================\n`;
            outputContent += `File Path: ${relativePath}\n`;
            outputContent += `================================================================\n\n`;
            outputContent += fileContent;
        });

        fs.writeFileSync(outputFileName, outputContent);
        console.log(`✅ Success! All code saved to: ${outputFileName}`);
        console.log(`📝 You can now copy the contents of that file to the chat.`);

    } catch (err) {
        console.error('❌ Error processing files:', err);
    }
}

run();