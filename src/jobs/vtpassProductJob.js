require("dotenv").config();

const { BillProvider, BillProduct } = require("../../models");
const vtpass = require("../services/vtPassServices");

async function syncVTpassProducts() {
  try {
    console.log("🚀 Starting VTPass product sync...");

    const providers = await BillProvider.findAll();

    console.log(`📦 Found ${providers.length} providers`);

    for (const provider of providers) {
      try {
        // Airtime does not use product variations
        const description = provider.description?.toLowerCase() || "";

        if (description.includes("airtime")) {
          console.log(`⏭️ Skipping airtime provider: ${provider.name}`);
          continue;
        }

        if (!provider.code) {
          console.warn(
            `⚠️ Skipping ${provider.name}: provider has no VTPass service code`
          );
          continue;
        }

        console.log(`🔄 Syncing products for ${provider.name}...`);

        const result = await vtpass.getProducts({
          serviceID: provider.code,
        });

        if (!result?.success || !result?.data?.content) {
          console.error(
            `❌ Failed to fetch products for ${provider.name}`
          );
          continue;
        }

        const content = result.data.content;

        // VTPass normally returns "variations".
        // Some responses also contain the misspelled "varations".
        const variations =
          Array.isArray(content.variations)
            ? content.variations
            : Array.isArray(content.varations)
              ? content.varations
              : [];

        if (variations.length === 0) {
          console.warn(
            `⚠️ No product variations found for ${provider.name}`
          );
          continue;
        }

        console.log(
          `📋 ${provider.name}: ${variations.length} variations received`
        );

        /*
         * VTPass can sometimes return the same variation_code more
         * than once. Since our purchase request uses variation_code,
         * don't create duplicate records for the same provider/code.
         *
         * Keep the first occurrence.
         */
        const uniqueVariations = new Map();

        for (const product of variations) {
          const variationCode = product.variation_code;

          if (!variationCode) {
            console.warn(
              `⚠️ Skipping product without variation_code for ${provider.name}`
            );
            continue;
          }

          if (!uniqueVariations.has(variationCode)) {
            uniqueVariations.set(variationCode, product);
          }
        }

        /*
         * Get existing products for this provider.
         */
        const existingProducts = await BillProduct.findAll({
          where: {
            provider_id: provider.provider_id,
          },
        });

        const existingMap = new Map();

        for (const product of existingProducts) {
          existingMap.set(product.variation_code, product);
        }

        let created = 0;
        let updated = 0;
        let unchanged = 0;
        let skipped = 0;

        /*
         * Create/update products.
         */
        for (const product of uniqueVariations.values()) {
          const variationCode = product.variation_code;

          const productName =
            product.name ||
            product.product_name ||
            variationCode;

          /*
           * IMPORTANT:
           * VTPass returns variation_amount, not amount/unit_price.
           */
          const price = Number(product.variation_amount);

          // Never save invalid prices
          if (!Number.isFinite(price) || price < 0) {
            console.warn(
              `⚠️ Skipping ${variationCode} for ${provider.name}: invalid price`,
              product.variation_amount
            );

            skipped++;
            continue;
          }

          const existing = existingMap.get(variationCode);

          if (!existing) {
            await BillProduct.create({
              provider_id: provider.provider_id,
              name: productName,
              variation_code: variationCode,
              price,
            });

            created++;

            console.log(
              `➕ Created ${variationCode} - ₦${price}`
            );
          } else {
            const existingPrice = Number(existing.price);

            const priceChanged = existingPrice !== price;
            const nameChanged = existing.name !== productName;

            if (priceChanged || nameChanged) {
              await existing.update({
                name: productName,
                price,
              });

              updated++;

              console.log(
                `🔄 Updated ${variationCode} - ₦${existingPrice} → ₦${price}`
              );
            } else {
              unchanged++;
            }
          }
        }

        console.log(
          `✅ ${provider.name} sync complete: ` +
            `${created} created, ` +
            `${updated} updated, ` +
            `${unchanged} unchanged, ` +
            `${skipped} skipped`
        );
      } catch (err) {
        console.error(
          `❌ Error syncing ${provider.name}:`,
          err.message || err
        );
      }
    }

    console.log("🎉 VTPass product sync completed");
  } catch (err) {
    console.error(
      "❌ VTPass product sync failed:",
      err.message || err
    );
  }
}

// Run sync
syncVTpassProducts();

module.exports = syncVTpassProducts;