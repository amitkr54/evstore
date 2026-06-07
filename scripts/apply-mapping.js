const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'data.json');
const mappingPath = 'C:\\Users\\Admin\\Downloads\\image-mapping.json';

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

let updated = 0;

for (const product of data.products) {
  if (mapping[product.id] && mapping[product.id].length > 0) {
    product.images = mapping[product.id];
    updated++;
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`Successfully updated ${updated} products with new Amazon image URLs.`);
