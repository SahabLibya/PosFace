import { ArrowLeft, CornerDownLeft, Trash2 } from 'lucide-react';

type DiscountScope = 'item' | 'invoice';
type DiscountType = 'percent' | 'amount';

type DiscountModalProps = {
    open: boolean;
    hasSelectedItem: boolean;
    scope: DiscountScope;
    type: DiscountType;
    value: string;
    itemName?: string;
    onScopeChange: (scope: DiscountScope) => void;
    onTypeChange: (type: DiscountType) => void;
    onValueChange: (value: string) => void;
    onClose: () => void;
    onSubmit: () => void;
    onRemoveDiscount: () => void;
};

const KEYS: Array<Array<{ key: string; type?: 'digit' | 'backspace' | 'escape' | 'enter' | 'dot' | 'empty' }>> = [
    [{ key: '1', type: 'digit' }, { key: '2', type: 'digit' }, { key: '3', type: 'digit' }, { key: 'backspace', type: 'backspace' }],
    [{ key: '4', type: 'digit' }, { key: '5', type: 'digit' }, { key: '6', type: 'digit' }, { key: 'esc', type: 'escape' }],
    [{ key: '7', type: 'digit' }, { key: '8', type: 'digit' }, { key: '9', type: 'digit' }, { key: 'enter', type: 'enter' }],
    [{ key: '00', type: 'digit' }, { key: '0', type: 'digit' }, { key: '.', type: 'dot' }, { key: 'empty', type: 'empty' }],
];

export default function DiscountModal({ open, hasSelectedItem, scope, type, value, itemName, onScopeChange, onTypeChange, onValueChange, onClose, onSubmit, onRemoveDiscount }: DiscountModalProps) {
    if (!open) return null;

    const appendValue = (next: string) => {
        if (value === '0' && next !== '.') { onValueChange(next); return; }
        onValueChange(`${value}${next}`);
    };

    const handleKey = (kind: string | undefined, key: string) => {
        switch (kind) {
            case 'digit': appendValue(key); break;
            case 'dot': if (!value.includes('.')) appendValue('.'); break;
            case 'backspace': onValueChange(value.length > 1 ? value.slice(0, -1) : '0'); break;
            case 'escape': onClose(); break;
            case 'enter': onSubmit(); break;
            default: break;
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="pos-modal-card w-full max-w-md overflow-hidden">
                {/* Modern Segmented Control */}
                <div className="flex p-2 bg-gray-100 dark:bg-[#141414] m-4 rounded-xl">
                    <button
                        onClick={() => onScopeChange('item')}
                        disabled={!hasSelectedItem}
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${scope === 'item' ? 'bg-white dark:bg-[#2a2a2a] shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'} ${!hasSelectedItem ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        خصم للصنف
                    </button>
                    <button
                        onClick={() => onScopeChange('invoice')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${scope === 'invoice' ? 'bg-white dark:bg-[#2a2a2a] shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                    >
                        خصم للفاتورة
                    </button>
                </div>

                <div className="px-6 pb-6">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4 h-5">
                        {scope === 'item' ? (itemName || 'اختر صنفاً') : 'يطبق على إجمالي السلة'}
                    </p>

                    <div className="flex items-center gap-4 mb-6">
                        {/* Type Toggle */}
                        <div className="flex flex-col gap-2 shrink-0">
                            <button onClick={() => onTypeChange('percent')} className={`h-12 w-16 rounded-lg font-bold text-xl transition-colors ${type === 'percent' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>%</button>
                            <button onClick={() => onTypeChange('amount')} className={`h-12 w-16 rounded-lg font-bold text-xl transition-colors ${type === 'amount' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>$</button>
                        </div>

                        {/* Input */}
                        <div className="relative flex-1">
                            <input
                                autoFocus
                                value={value}
                                onChange={(e) => onValueChange(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') onSubmit(); if (e.key === 'Escape') onClose(); }}
                                className="w-full h-26 bg-gray-50 dark:bg-[#141414] border-2 border-blue-500 rounded-xl pr-4 pl-12 text-left text-5xl font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                                dir="ltr"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-blue-600/50 dark:text-blue-400/50">
                                {type === 'percent' ? '%' : '$'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {KEYS.flat().map((keyDef, idx) => (
                            <button
                                key={idx}
                                disabled={keyDef.type === 'empty'}
                                onClick={() => handleKey(keyDef.type, keyDef.key)}
                                className={`pos-key-btn ${keyDef.type === 'enter' ? 'pos-key-btn-enter' : ''} ${keyDef.type === 'empty' ? 'pos-key-btn-empty' : ''}`}
                            >
                                {keyDef.type === 'backspace' && <ArrowLeft className="w-6 h-6" />}
                                {keyDef.type === 'enter' && <CornerDownLeft className="w-6 h-6" />}
                                {keyDef.type === 'escape' && <span className="text-lg">Esc</span>}
                                {keyDef.type !== 'backspace' && keyDef.type !== 'enter' && keyDef.type !== 'escape' && keyDef.type !== 'empty' && keyDef.key}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onRemoveDiscount}
                        className="w-full py-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                        <span>إزالة الخصم</span>
                    </button>
                </div>
            </div>
        </div>
    );
}