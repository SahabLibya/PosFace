import {
    ArrowLeftRight,
    Banknote,
    CreditCard,
    Lock,
    MessageSquare,
    MoreHorizontal,
    PackagePlus,
    Percent,
    Plus,
    ScrollText,
    SearchCode,
    Trash2,
    Undo2,
    Users,
    X,
} from 'lucide-react';
import ActionButton from './ActionButton';
import type { PaymentMethod } from './types';

type SidePanelProps = {
    paymentMethod: PaymentMethod;
    onPaymentMethodChange: (method: PaymentMethod) => void;
    onAction: (action: string) => void;
    onClearInvoice: () => void;
};

export default function SidePanel({
    paymentMethod,
    onPaymentMethodChange,
    onAction,
    onClearInvoice,
}: SidePanelProps) {
    return (
        <div className="w-85 bg-gray-200 dark:bg-pos-dark-panel flex flex-col shrink-0 p-px">
            <div className="grid grid-cols-4 gap-px bg-gray-300 dark:bg-pos-border p-px ">
                <ActionButton FKey="" icon={X} label="حذف" onClick={() => onAction('delete')} />
                <ActionButton FKey="F3" icon={SearchCode} label="البحث" onClick={() => onAction('search')} />
                <ActionButton FKey="F4" icon={PackagePlus} label="الكمية" onClick={() => onAction('quantity')} />
                <ActionButton FKey="F8" icon={Plus} label="فاتورة جديدة" onClick={() => onAction('new-invoice')} />
            </div>

            <div className="grid grid-cols-3 gap-px bg-gray-300 dark:bg-pos-border p-px">
                <ActionButton
                    FKey="F12"
                    icon={Banknote}
                    label="Cash"
                    onClick={() => onPaymentMethodChange('cash')}
                    color={paymentMethod === 'cash' ? 'bg-white dark:bg-pos-dark border-b-2 border-green-500' : 'bg-white dark:bg-pos-dark'}
                />
                <ActionButton
                    icon={CreditCard}
                    label="Card"
                    onClick={() => onPaymentMethodChange('card')}
                    color={paymentMethod === 'card' ? 'bg-white dark:bg-pos-dark border-b-2 border-blue-500' : 'bg-white dark:bg-pos-dark'}
                />
                <ActionButton
                    icon={ScrollText}
                    label="Check"
                    onClick={() => onPaymentMethodChange('check')}
                    color={paymentMethod === 'check' ? 'bg-white dark:bg-pos-dark border-b-2 border-blue-400' : 'bg-white dark:bg-pos-dark'}
                />
            </div>

            <div className="flex-1 flex items-center justify-center relative bg-gray-100 dark:bg-pos-dark-panel text-gray-800 dark:text-white">
                <div className="text-center opacity-10 flex flex-col items-center">
                    <div className="w-24 h-24 border-4 border-current rounded-xl rotate-45 flex items-center justify-center mb-6">
                        <span className="-rotate-45 text-4xl font-bold">p</span>
                    </div>
                    <span className="text-2xl font-bold tracking-widest uppercase">PosFace</span>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-px bg-gray-300 dark:bg-pos-border p-px pb-0">
                <ActionButton icon={CreditCard} label="درج النقد" onClick={() => onAction('drawer')} />
                <ActionButton icon={Users} label="محلي" onClick={() => onAction('local')} />
                <ActionButton icon={Users} label="Customer" colSpan={2} onClick={() => onAction('customer')} />

                <ActionButton FKey="F2" icon={Percent} label="الخصم" onClick={() => onAction('discount')} />
                <ActionButton icon={MessageSquare} label="ملاحظة" onClick={() => onAction('note')} />
                <ActionButton icon={Undo2} label="استرداد" onClick={() => onAction('refund')} />
                <ActionButton FKey="F9" icon={Lock} label="تعليق الفاتورة" onClick={() => onAction('hold')} />

                <ActionButton icon={ArrowLeftRight} label="تحويل" FKey="F7" onClick={() => onAction('transfer')} />
                <ActionButton icon={MoreHorizontal} label="" onClick={() => onAction('more')} />

                <button
                    onClick={onClearInvoice}
                    className="col-span-1 bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center p-3 transition-colors relative"
                >
                    <Trash2 className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">إلغاء الفاتورة</span>
                </button>

                <button
                    onClick={() => onAction('credit')}
                    className="col-span-1 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center p-3 transition-colors relative"
                >
                    <span className="absolute top-1 left-1 text-[10px] opacity-80">F10</span>
                    <span className="text-xl font-bold mb-1">F10</span>
                    <span className="text-xs font-bold">آجل</span>
                </button>
            </div>
        </div>
    );
}
