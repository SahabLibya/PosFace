import { Boxes, X } from 'lucide-react';
import type { CartItem, Product } from './types';

type CartTableProps = {
    cart: CartItem[];
    selectedItemId: number | null;
    editingPriceItemId: number | null;
    subtotal: number;
    invoiceDiscount: number;
    tax: number;
    total: number;
    onSelectRow: (id: number) => void;
    onStartPriceEdit: (id: number) => void;
    onStopPriceEdit: () => void;
    onPriceListChange: (id: number, key: string) => void;
    onRemoveItem: (id: number) => void;
    onQuickAddFromEmpty: (product: Product) => void;
    products: Product[];
};

export default function CartTable({
    cart,
    selectedItemId,
    editingPriceItemId,
    subtotal,
    invoiceDiscount,
    tax,
    total,
    onSelectRow,
    onStartPriceEdit,
    onStopPriceEdit,
    onPriceListChange,
    onRemoveItem,
    onQuickAddFromEmpty,
    products,
}: CartTableProps) {
    return (
        <>
            <div className="grid grid-cols-13 gap-4 px-4 py-3 bg-gray-100 dark:bg-[#1a1a1a] border-b border-gray-300 dark:border-pos-border text-sm font-semibold text-gray-800 dark:text-gray-200">
                <div className="col-span-6">اسم الصنف</div>
                <div className="col-span-2 text-center">الكمية</div>
                <div className="col-span-2 text-center">السعر</div>
                <div className="col-span-2 text-left">المجموع</div>
                <div className="col-span-1" />
            </div>

            <div className="flex-1 overflow-y-auto bg-white dark:bg-pos-dark p-2">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Boxes className="w-16 h-16 mb-4 opacity-20" />
                        <p>لا توجد أصناف في الفاتورة</p>
                        <div className="mt-8 flex gap-2">
                            {products.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => onQuickAddFromEmpty(p)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                >
                                    إضافة {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    cart.map((item, index) => (
                        <div
                            key={item.id}
                            onClick={() => onSelectRow(item.id)}
                            className={`grid grid-cols-13 gap-4 px-2 py-3 border-b border-gray-200 dark:border-gray-800 items-center group cursor-pointer text-gray-800 dark:text-gray-200 ${selectedItemId === item.id
                                ? 'bg-blue-100 dark:bg-blue-900/40'
                                : 'hover:bg-gray-50 dark:hover:bg-pos-dark-hover'
                                }`}
                        >
                            <div className="col-span-6 flex flex-col">
                                <span className="font-bold text-sm text-green-700 dark:text-green-500">{item.name}</span>
                                <span className="text-[10px] text-gray-500">#{index + 1} 15:58 {item.sku}</span>
                                {item.note && <span className="text-[10px] text-amber-600 dark:text-amber-400">{item.note}</span>}
                            </div>

                            <div className="col-span-2 text-center text-sm font-bold">{item.quantity}</div>

                            <div className="col-span-2 text-center text-sm">
                                {editingPriceItemId === item.id ? (
                                    <select
                                        autoFocus
                                        className="w-full bg-white dark:bg-pos-dark-panel border border-gray-300 dark:border-gray-600 rounded px-1 py-1 text-xs text-gray-800 dark:text-gray-100"
                                        value={item.selectedPriceKey}
                                        onChange={(e) => onPriceListChange(item.id, e.target.value)}
                                        onBlur={onStopPriceEdit}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {item.priceLists.map((list) => (
                                            <option key={list.key} value={list.key}>
                                                {list.label} - {list.price.toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onStartPriceEdit(item.id);
                                        }}
                                        className="underline decoration-dotted underline-offset-4 hover:text-blue-600"
                                    >
                                        {item.price.toFixed(2)}
                                    </button>
                                )}
                            </div>

                            <div className="col-span-2 text-left text-sm font-bold">{(item.price * item.quantity).toFixed(2)}</div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveItem(item.id);
                                }}
                                className={`col-span-1 justify-self-center h-7 w-7 rounded-full border border-red-300/80 dark:border-red-800/80 bg-red-50/70 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center transition-all ${selectedItemId === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                                    }`}
                                aria-label="حذف الصنف"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-gray-100 dark:bg-[#1a1a1a] border-t border-gray-300 dark:border-pos-border p-4 shrink-0">
                <div className='w-1/3'>
                    <div className="flex justify-between items-center mb-1 text-sm text-gray-600 dark:text-gray-400">
                        <span>المجموع</span>
                        <span>{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1 text-sm text-red-600 dark:text-red-400">
                        <span>الخصم</span>
                        <span>-{invoiceDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-400">
                        <span>ضريبة</span>
                        <span>{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-2xl font-bold text-gray-900 dark:text-white">
                        <span>الإجمالي</span>
                        <span>{total.toFixed(2)}</span>
                    </div>
                </div>

            </div>
        </>
    );
}
