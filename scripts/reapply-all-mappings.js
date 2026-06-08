const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'data.json');
const mappingFiles = [
  'C:\\Users\\Admin\\Downloads\\image-mapping.json',
  'C:\\Users\\Admin\\Downloads\\image-mapping (1).json',
  'C:\\Users\\Admin\\Downloads\\image-mapping (2).json',
  'C:\\Users\\Admin\\Downloads\\image-mapping (3).json'
];

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let updatedCount = 0;

mappingFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`Applying ${file}...`);
    try {
      const mapping = JSON.parse(fs.readFileSync(file, 'utf8'));
      for (const product of data.products) {
        if (mapping[product.id] && mapping[product.id].length > 0) {
          product.images = mapping[product.id];
          updatedCount++;
        }
      }
    } catch (err) {
      console.error(`Error parsing ${file}:`, err.message);
    }
  } else {
    console.log(`File not found, skipping: ${file}`);
  }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Done reapplying. Restored URLs for products. Total overrides applied.`);
