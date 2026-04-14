export type PriceList = {
    key: string;
    label: string;
    price: number;
};

export type Product = {
    id: number;
    name: string;
    number: string;
    barcode: string;
    price: number;
    sku: string;
    priceLists: PriceList[];
};

export type SearchMode = 'all' | 'name' | 'number' | 'barcode';

export type CartItem = Product & {
    quantity: number;
    selectedPriceKey: string;
    discountPercent?: number;
    discountType?: 'percent' | 'amount';
    discountValue?: number;
    note?: string;
};

export type PaymentMethod = 'cash' | 'card' | 'check';
