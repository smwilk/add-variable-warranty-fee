export function run(input) {
  const warrantyVariantId = 'gid://shopify/ProductVariant/49377107542321';

  return {
    operations: input.cart.lines.map(lineItem => {
      // Check if the line item has the 保証 attribute and if its value is 保証あり
      const guaranteeAttribute = lineItem.attribute;

      if (guaranteeAttribute && guaranteeAttribute.value === '保証あり') {
        // Calculate the warranty fee for each line item
        const warrantyFee = parseFloat(lineItem.cost.amountPerQuantity.amount) * 0.03;
        const originalPrice = parseFloat(lineItem.cost.amountPerQuantity.amount);

        return {
          expand: {
            cartLineId: lineItem.id,
            title: `${lineItem.merchandise.product.title} - 保証付き（商品価格の3％）`,
            image: null,
            expandedCartItems: [
              {
                merchandiseId: lineItem.merchandise.id,
                quantity: lineItem.quantity,
                price: {
                  adjustment: {
                    fixedPricePerUnit: {
                      amount: originalPrice
                    }
                  }
                }
              },
              {
                merchandiseId: warrantyVariantId,
                quantity: 1,
                price: {
                  adjustment: {
                    fixedPricePerUnit: {
                      amount: warrantyFee // Setting the warranty fee per unit
                    }
                  }
                }
              }
            ]
          }
        };
      } else {
        // If there's no 保証あり property, return null or an empty object to not perform the expand operation
        return null;
      }
    }).filter(operation => operation !== null) // Filter out the null operations
  };
}