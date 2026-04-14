import { ArrowLeft, CornerDownLeft } from 'lucide-react';

type QuantityModalProps = {
    open: boolean;
    value: string;
    productName?: string;
    onValueChange: (value: string) => void;
    onClose: () => void;
    onSubmit: () => void;
};

const KEYS: Array<Array<{ key: string; type?: 'digit' | 'backspace' | 'escape' | 'enter' | 'dot' | 'minus' | 'empty' }>> = [
    [{ key: '1', type: 'digit' }, { key: '2', type: 'digit' }, { key: '3', type: 'digit' }, { key: 'backspace', type: 'backspace' }],
    [{ key: '4', type: 'digit' }, { key: '5', type: 'digit' }, { key: '6', type: 'digit' }, { key: 'esc', type: 'escape' }],
    [{ key: '7', type: 'digit' }, { key: '8', type: 'digit' }, { key: '9', type: 'digit' }, { key: 'enter', type: 'enter' }],
    [{ key: '-', type: 'minus' }, { key: '0', type: 'digit' }, { key: '.', type: 'dot' }, { key: 'empty', type: 'empty' }],
];

export default function QuantityModal({ open, value, productName, onValueChange, onClose, onSubmit }: QuantityModalProps) {
    if (!open) return null;

    const appendValue = (next: string) => {
        if (value === '0' && next !== '.') { onValueChange(next); return; }
        onValueChange(`${value}${next}`);
    };

    const handleKey = (type: string | undefined, key: string) => {
        switch (type) {
            case 'digit': appendValue(key); break;
            case 'dot': if (!value.includes('.')) appendValue('.'); break;
            case 'minus': if (!value.startsWith('-')) onValueChange(`-${value || '0'}`); break;
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
            <div className="pos-modal-card w-full max-w-sm p-6">
                <h3 className="text-center text-xl font-bold text-gray-900 dark:text-white">تعديل الكمية</h3>
                {productName && <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1 mb-5">{productName}</p>}

                <div className="relative mb-6">
                    <input
                        autoFocus
                        value={value}
                        onChange={(e) => onValueChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onSubmit();
                            if (e.key === 'Escape') onClose();
                        }}
                        className="w-full h-16 bg-gray-50 dark:bg-[#141414] border-2 border-blue-500 rounded-xl pr-4 pl-4 text-center text-4xl font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all"
                    />
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {KEYS.flat().map((keyDef, idx) => (
                        <button
                            key={idx}
                            disabled={keyDef.type === 'empty'}
                            onClick={() => handleKey(keyDef.type, keyDef.key)}
                            className={`pos-key-btn ${keyDef.type === 'enter' ? 'pos-key-btn-enter col-span-1 row-span-1' : ''} ${keyDef.type === 'empty' ? 'pos-key-btn-empty' : ''}`}
                        >
                            {keyDef.type === 'backspace' && <ArrowLeft className="w-6 h-6" />}
                            {keyDef.type === 'enter' && <CornerDownLeft className="w-6 h-6" />}
                            {keyDef.type === 'escape' && <span className="text-lg">Esc</span>}
                            {keyDef.type !== 'backspace' && keyDef.type !== 'enter' && keyDef.type !== 'escape' && keyDef.type !== 'empty' && keyDef.key}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}