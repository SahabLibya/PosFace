import { Clock, Trash2 } from 'lucide-react';
import type { CartItem } from './types';

type HeldInvoice = {
    id: string;
    cart: CartItem[];
    timestamp: number;
};

type HeldInvoicesModalProps = {
    open: boolean;
    heldInvoices: HeldInvoice[];
    onClose: () => void;
    onSelectInvoice: (invoice: HeldInvoice) => void;
    onRemoveInvoice: (id: string) => void;
};

export default function HeldInvoicesModal({ open, heldInvoices, onClose, onSelectInvoice, onRemoveInvoice }: HeldInvoicesModalProps) {
    if (!open) return null;

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <div className="pos-modal-card w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                        <Clock className="w-5 h-5 text-blue-500" /> الفواتير المعلقة
                    </h3>
                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-md text-xs font-bold">{heldInvoices.length}</span>
                </div>

                {heldInvoices.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                        <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>لا توجد فواتير معلقة حالياً</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                        {heldInvoices.map((invoice) => {
                            const itemCount = invoice.cart.reduce((sum, item) => sum + item.quantity, 0);
                            const total = invoice.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

                            return (
                                <div key={invoice.id} className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-[#242424] border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                                    <button onClick={() => { onSelectInvoice(invoice); onClose(); }} className="flex-1 text-right">
                                        <div className="text-base font-bold text-gray-900 dark:text-white mb-1">فاتورة • {itemCount} صنف</div>
                                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">{total.toFixed(2)} ر.س <span className="text-gray-400 mx-1">•</span> <span className="text-gray-500 text-xs">{formatTime(invoice.timestamp)}</span></div>
                                    </button>
                                    <button onClick={() => onRemoveInvoice(invoice.id)} className="p-3 bg-white dark:bg-[#1e1e1e] shadow-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-6">
                    <button onClick={onClose} className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
}