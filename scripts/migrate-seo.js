const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Generate unique slugs
const slugs = new Set();
data.products.forEach(p => {
  const brand = data.brands.find(b => b.id === p.brand);
  const brandName = brand ? brand.displayName : p.brand;
  
  let baseSlug = slugify(`${brandName}-${p.name}`);
  let finalSlug = baseSlug;
  let counter = 1;
  while(slugs.has(finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  slugs.add(finalSlug);
  
  p.slug = finalSlug;
  
  // SEO Research Pattern
  // Title: [Brand Name] [Model 1] [Product Name] — [Model 2], [Model 3] Compatible | EVParts India
  const models = p.compatibleModels || [];
  const model1 = models[0] || '';
  const otherModels = models.slice(1, 3).join(", ");
  
  p.metaTitle = `${brandName} ${model1} ${p.name}` + (otherModels ? ` — ${otherModels} Compatible` : '') + ` | EVParts India`;
  
  // Meta desc: [Product Description]. Compatible with [All Models]. ₹[Price]. [Review Count]+ reviews. Free shipping above ₹399. Ships in 24hrs across India.
  p.metaDescription = `${p.description}. Compatible with ${models.join(", ")}. ₹${p.salePrice}. ${p.reviewCount}+ reviews. Free shipping above ₹399. Ships in 24hrs across India.`;
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated data.json with slug, metaTitle, and metaDescription for ' + data.products.length + ' products.');
