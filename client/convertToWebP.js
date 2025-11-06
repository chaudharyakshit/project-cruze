import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getAllImageFiles(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    let images = [];

    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            images = images.concat(await getAllImageFiles(fullPath));
        } else {
            // Check if file is an image (jpg, png, jpeg)
            if (/\.(jpe?g|png)$/i.test(file.name)) {
                images.push(fullPath);
            }
        }
    }
    return images;
}

async function convertToWebP(imagePath) {
    try {
        const outputPath = imagePath.replace(/\.(jpe?g|png)$/i, '.webp');
        await sharp(imagePath)
            .webp({ quality: 80 }) // Adjust quality as needed (0-100)
            .toFile(outputPath);
        
        // Get file sizes for comparison
        const originalSize = (await fs.stat(imagePath)).size;
        const webpSize = (await fs.stat(outputPath)).size;
        
        console.log(`Converted: ${path.basename(imagePath)}`);
        console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
        console.log(`WebP size: ${(webpSize / 1024 / 1024).toFixed(2)}MB`);
        console.log(`Saved: ${((originalSize - webpSize) / 1024 / 1024).toFixed(2)}MB\n`);

        // Delete original file after successful conversion
        await fs.unlink(imagePath); // Delete original files after conversion
    } catch (error) {
        console.error(`Error converting ${imagePath}:`, error);
    }
}

async function main() {
    const assetsDir = path.join(__dirname, 'src', 'assets');
    const innerImagesDir = path.join(assetsDir, 'Inner-Images');
    
    // Get all image files from both directories
    const assetImages = await getAllImageFiles(assetsDir);
    const innerImages = await getAllImageFiles(innerImagesDir);
    const imageFiles = [...assetImages, ...innerImages];
    
    console.log(`Found ${imageFiles.length} images to convert\n`);
    
    for (const imagePath of imageFiles) {
        await convertToWebP(imagePath);
    }
}

main().catch(console.error);