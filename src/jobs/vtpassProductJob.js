require('dotenv').config();
const { BillProvider, BillProduct } = require('../../models');
const vtpass = require('../services/vtPassServices');

async function syncVTpassProductsOptimized() {
  try {
    const providers = await BillProvider.findAll();

    await Promise.allSettled(
      providers.map(async (provider) => {
        try {
          if (provider.description.toLowerCase().includes('airtime')) return;

          const result = await vtpass.getProducts({ serviceID: provider.code });
          if (!result.success || !result.data?.content) {
            console.error(`Failed to fetch products for ${provider.name}`);
            return;
          }

          const variations = result.data.content.variations || result.data.content.varations || [];
          if (!variations.length) {
            console.error(`No variations found for ${provider.name}`);
            return;
          }

          const existingProducts = await BillProduct.findAll({
            where: { provider_id: provider.provider_id },
            attributes: ['variation_code', 'price', 'name'],
          });

          const existingMap = {};
          existingProducts.forEach(p => (existingMap[p.variation_code] = p));

          for (const product of variations) {
            const variationCode = product.variation_code || product.unique_element || product.name;
            const productName = product.name || product.product_name || variationCode;
            const price = parseFloat(product.amount || product.unit_price || 0);

            const existing = existingMap[variationCode];

            if (!existing) {
              await BillProduct.create({
                provider_id: provider.provider_id,
                name: productName,
                variation_code: variationCode,
                price,
              });
            } else if (parseFloat(existing.price) !== price) {
              await existing.update({ price });
            }
          }
        } catch (err) {
          console.error(`Error syncing provider ${provider.name}:`, err.message || err);
        }
      })
    );
  } catch (err) {
    console.error('Error fetching providers:', err.message || err);
  }
}

// Run the sync
syncVTpassProductsOptimized();

module.exports = syncVTpassProductsOptimized;
