import { Barcode, Hash, SearchCode, Tag } from 'lucide-react';
import type { ElementType } from 'react';
import type { Product, SearchMode } from './types';

export const DUMMY_PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'روله 1.5',
        number: '1001',
        barcode: '6281001000015',
        price: 100.0,
        sku: 'SKU: 1',
        priceLists: [
            { key: 'retail', label: 'تجزئة', price: 100.0 },
            { key: 'wholesale', label: 'جملة', price: 92.0 },
            { key: 'vip', label: 'VIP', price: 88.0 },
        ],
    },
    {
        id: 2,
        name: 'دهان بلاستيك',
        number: '1002',
        barcode: '6281001000022',
        price: 250.0,
        sku: 'SKU: 2',
        priceLists: [
            { key: 'retail', label: 'تجزئة', price: 250.0 },
            { key: 'wholesale', label: 'جملة', price: 235.0 },
            { key: 'vip', label: 'VIP', price: 225.0 },
        ],
    },
    {
        id: 3,
        name: 'فرشاة تلوين',
        number: '1003',
        barcode: '6281001000039',
        price: 25.0,
        sku: 'SKU: 3',
        priceLists: [
            { key: 'retail', label: 'تجزئة', price: 25.0 },
            { key: 'wholesale', label: 'جملة', price: 22.0 },
            { key: 'vip', label: 'VIP', price: 20.0 },
        ],
    },
    {
        id: 4,
        name: 'معجون جدران',
        number: '1004',
        barcode: '6281001000046',
        price: 45.0,
        sku: 'SKU: 4',
        priceLists: [
            { key: 'retail', label: 'تجزئة', price: 45.0 },
            { key: 'wholesale', label: 'جملة', price: 41.0 },
            { key: 'vip', label: 'VIP', price: 39.0 },
        ],
    },
    {
        id: 5,
        name: 'شطرطون لاصق',
        number: '1005',
        barcode: '6281001000053',
        price: 12.5,
        sku: 'SKU: 5',
        priceLists: [
            { key: 'retail', label: 'تجزئة', price: 12.5 },
            { key: 'wholesale', label: 'جملة', price: 11.2 },
            { key: 'vip', label: 'VIP', price: 10.8 },
        ],
    },
    {
        id: 6,
        name: 'بخاخ دهان',
        number: '1006',
        barcode: '6281001000060',
        price: 30.0,
        sku: 'SKU: 6',
        priceLists: [
            { key: 'retail', label: 'تجزئة', price: 30.0 },
            { key: 'wholesale', label: 'جملة', price: 27.0 },
            { key: 'vip', label: 'VIP', price: 25.0 },
        ],
    },
];

export const SEARCH_OPTIONS: Array<{ key: SearchMode; label: string; icon: ElementType }> = [
    { key: 'all', label: 'الكل', icon: SearchCode },
    { key: 'name', label: 'الاسم', icon: Tag },
    { key: 'number', label: 'الرقم', icon: Hash },
    { key: 'barcode', label: 'الباركود', icon: Barcode },
];
