import { ProductCategoryEnum } from './product-category.enum';
import { ProductModel } from './product.model';
import { RegionEnum } from './region.enum';

export class OrderModel {
  id?: string;
  price?: number;
  customerId!: string;
  productIds!: string[];

  private readonly holidayStartMonth = 6; // July
  private readonly holidayEndMonth = 7; // August

  private readonly blackFridayMonth = 10; // November
  private readonly blackFridayDayOfWeek = 5; // Friday

  private readonly promotionalProductCategories: ProductCategoryEnum[] = [
    ProductCategoryEnum.Books,
    ProductCategoryEnum.Electronics,
  ];

  constructor(data: Partial<OrderModel>) {
    Object.assign(this, data);
  }

  calculateOrderValue(products: ProductModel[], region: RegionEnum): void {
    let totalOrder = 0;
    let seasonalOrPromotionalDiscount = 0;

    if (this.isHolidaySales()) {
      [totalOrder, seasonalOrPromotionalDiscount] = this.calculateHolidaySalesOrderValue(products, region);
    } else if (this.isBlackFridaySale()) {
      totalOrder = this.calculateOrdinaryOrderValue(products, region);
      seasonalOrPromotionalDiscount = totalOrder * 0.25;
    } else {
      totalOrder = this.calculateOrdinaryOrderValue(products, region);
    }

    const volumeBasedDiscount = this.calculateVolumeBasedDiscount(totalOrder, products.length);
    const discount = Math.max(seasonalOrPromotionalDiscount, volumeBasedDiscount);

    this.price = totalOrder - discount;
  }

  private isHolidaySales(): boolean {
    const currentMonth = new Date().getMonth();
    return currentMonth >= this.holidayStartMonth && currentMonth <= this.holidayEndMonth;
  }

  private calculateHolidaySalesOrderValue(products: ProductModel[], region: RegionEnum): [number, number] {
    return products.reduce(
      (prices, product) => {
        const price = this.calculateProductPrice(product, region);
        prices[0] += price;
        prices[1] += this.promotionalProductCategories.includes(product.category) ? price * 0.15 : 0;

        return prices;
      },
      [0, 0],
    );
  }

  private isBlackFridaySale(): boolean {
    const now = new Date();
    let november = new Date(now.getFullYear(), this.blackFridayMonth, 0);

    while (november.getDay() !== this.blackFridayDayOfWeek) {
      november = new Date(november.getFullYear(), november.getMonth(), november.getDate() - 1);
    }

    return november.getMonth() === now.getMonth() && november.getDate() === now.getDate();
  }

  private calculateOrdinaryOrderValue(products: ProductModel[], region: RegionEnum): number {
    return products.reduce((total, product) => total + this.calculateProductPrice(product, region), 0);
  }

  private calculateVolumeBasedDiscount(totalOrder: number, productsCount: number): number {
    if (productsCount >= 50) {
      return totalOrder * 0.3;
    } else if (productsCount >= 10) {
      return totalOrder * 0.2;
    } else if (productsCount >= 5) {
      return totalOrder * 0.1;
    }

    return 0;
  }

  private calculateProductPrice(product: ProductModel, region: RegionEnum): number {
    switch (region) {
      case RegionEnum.US: {
        return product.price;
      }
      case RegionEnum.Europe: {
        return product.price * 1.15;
      }
      case RegionEnum.Asia: {
        return product.price * 0.95;
      }
    }
  }
}
