import { Search } from 'lucide-react';
import type { ElementType } from 'react';
import type { Product, SearchMode } from './types';

type SearchOption = {
    key: SearchMode;
    label: string;
    icon: ElementType;
};

type SearchBarRowProps = {
    searchOptions: SearchOption[];
    searchMode: SearchMode;
    onSearchModeChange: (mode: SearchMode) => void;
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    onSearchFocusedChange: (focused: boolean) => void;
    showSearchDropdown: boolean;
    filteredProducts: Product[];
    onSelectProduct: (product: Product) => void;
};

export default function SearchBarRow({
    searchOptions,
    searchMode,
    onSearchModeChange,
    searchQuery,
    onSearchQueryChange,
    onSearchFocusedChange,
    showSearchDropdown,
    filteredProducts,
    onSelectProduct,
}: SearchBarRowProps) {
    return (
        <div className="px-4 py-2 bg-gray-100 dark:bg-[#1a1a1a] border-b border-gray-300 dark:border-pos-border">
            <div className="flex flex-row-reverse items-center gap-2 w-full min-w-0">
                {searchOptions.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => onSearchModeChange(key)}
                        className={`h-10 min-w-16.5 px-2 rounded border flex flex-col items-center justify-center transition-colors ${searchMode === key
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white dark:bg-pos-dark-panel border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-pos-dark-hover'
                            }`}
                    >
                        <Icon className="w-4 h-4 mb-0.5" />
                        <span className="text-[10px] font-bold leading-none">{label}</span>
                    </button>
                ))}

                <div className="relative w-full flex items-center">
                    <Search className="w-5 h-5 absolute right-3 text-gray-500" />
                    <input
                        type="text"
                        placeholder="ابحث بالاسم أو الرقم أو الباركود"
                        className="w-full h-10 bg-white dark:bg-pos-dark-panel border border-gray-300 dark:border-gray-600 rounded px-11 py-2 text-base focus:outline-none focus:border-blue-500 text-gray-800 dark:text-gray-200 placeholder-gray-500"
                        value={searchQuery}
                        onChange={(e) => onSearchQueryChange(e.target.value)}
                        onFocus={() => onSearchFocusedChange(true)}
                        onBlur={() => onSearchFocusedChange(false)}
                    />

                    {showSearchDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-pos-dark-panel shadow-lg z-30 max-h-64 overflow-y-auto">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <button
                                        key={product.id}
                                        onMouseDown={() => onSelectProduct(product)}
                                        className="w-full px-3 py-2 text-right border-b last:border-b-0 border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-pos-dark-hover"
                                    >
                                        <div className="text-sm font-bold text-gray-800 dark:text-gray-100">{product.name}</div>
                                        <div className="text-[11px] text-gray-500">#{product.number} | {product.barcode}</div>
                                    </button>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-sm text-gray-500">لا توجد نتائج مطابقة</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
