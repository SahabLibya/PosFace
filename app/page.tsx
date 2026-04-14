"use client";

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import CartTable from './components/pos/CartTable';
import { DUMMY_PRODUCTS, SEARCH_OPTIONS } from './components/pos/constants';
import DiscountModal from './components/pos/DiscountModal';
import QuantityModal from './components/pos/QuantityModal';
import SearchBarRow from './components/pos/SearchBarRow';
import SidePanel from './components/pos/SidePanel';
import HeldInvoicesModal from './components/pos/HeldInvoicesModal';
import ConfirmModal from './components/pos/ConfirmModal';
import { NotificationManager, type Notification } from './components/pos/NotificationManager';
import type { CartItem, PaymentMethod, Product, SearchMode } from './components/pos/types';

type HeldInvoice = {
    id: string;
    cart: CartItem[];
    timestamp: number;
};

export default function PosFace() {
    const [cart, setCart] = useState<CartItem[]>([{ ...DUMMY_PRODUCTS[0], quantity: 2, selectedPriceKey: 'retail' }]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchMode, setSearchMode] = useState<SearchMode>('all');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [editingPriceItemId, setEditingPriceItemId] = useState<number | null>(null);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

    // Modal states
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
    const [quantityInput, setQuantityInput] = useState('1');
    const [activeModal, setActiveModal] = useState<null | 'note' | 'customer'>(null);
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
    const [discountScope, setDiscountScope] = useState<'item' | 'invoice'>('item');
    const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
    const [discountInput, setDiscountInput] = useState('0');

    // Invoice states
    const [invoiceDiscountType, setInvoiceDiscountType] = useState<'percent' | 'amount'>('percent');
    const [invoiceDiscountValue, setInvoiceDiscountValue] = useState(0);
    const [noteInput, setNoteInput] = useState('');
    const [customerName, setCustomerName] = useState('محلي');
    const [customerInput, setCustomerInput] = useState('محلي');

    // Held invoices & Notifications
    const [heldCarts, setHeldCarts] = useState<HeldInvoice[]>([]);
    const [showHeldInvoicesModal, setShowHeldInvoicesModal] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration?: number) => {
        const id = `notif-${Date.now()}`;
        setNotifications((prev) => [...prev, { id, message, type, duration }]);
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    const addToCart = useCallback((product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
            }
            return [...prev, { ...product, quantity: 1, selectedPriceKey: 'retail', discountPercent: 0, note: '' }];
        });
    }, []);

    const getBaseListPrice = (item: CartItem) => item.priceLists.find((list) => list.key === item.selectedPriceKey)?.price ?? item.price;
    const applyUnitDiscount = (basePrice: number, type: 'percent' | 'amount', value: number) => {
        if (type === 'percent') return Math.max(0, basePrice * (1 - value / 100));
        return Math.max(0, basePrice - value);
    };

    const updateItemPriceFromList = (id: number, priceKey: string) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;
                const selected = item.priceLists.find((list) => list.key === priceKey);
                if (!selected) return item;
                const itemDiscountType = item.discountType ?? 'percent';
                const itemDiscountValue = item.discountValue ?? 0;
                const discountedPrice = applyUnitDiscount(selected.price, itemDiscountType, itemDiscountValue);
                return { ...item, selectedPriceKey: selected.key, price: discountedPrice };
            }),
        );
    };

    const removeFromCart = useCallback((id: number) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
        if (selectedItemId === id) setSelectedItemId(null);
    }, [selectedItemId]);

    const clearCart = useCallback(() => { setShowClearConfirm(true); }, []);
    const confirmClearCart = () => {
        setCart([]);
        setSelectedItemId(null);
        showNotification('تم إلغاء الفاتورة', 'success');
    };

    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
    const invoiceDiscountAmount = useMemo(() => {
        if (invoiceDiscountType === 'percent') {
            const raw = subtotal * (invoiceDiscountValue / 100);
            return Math.min(subtotal, Math.max(0, raw));
        }
        return Math.min(subtotal, Math.max(0, invoiceDiscountValue));
    }, [subtotal, invoiceDiscountType, invoiceDiscountValue]);
    const tax = 0;
    const total = subtotal - invoiceDiscountAmount + tax;

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredProducts = useMemo(() => {
        return DUMMY_PRODUCTS.filter((product) => {
            if (!normalizedQuery) return true;
            if (searchMode === 'name') return product.name.toLowerCase().includes(normalizedQuery);
            if (searchMode === 'number') return product.number.toLowerCase().includes(normalizedQuery);
            if (searchMode === 'barcode') return product.barcode.toLowerCase().includes(normalizedQuery);
            return product.name.toLowerCase().includes(normalizedQuery) || product.number.toLowerCase().includes(normalizedQuery) || product.barcode.toLowerCase().includes(normalizedQuery);
        });
    }, [normalizedQuery, searchMode]);

    const showSearchDropdown = isSearchFocused && normalizedQuery.length > 0;
    const selectedItem = cart.find((item) => item.id === selectedItemId) ?? null;

    // --- Modal Openers ---
    const openQuantityModal = useCallback(() => {
        if (!selectedItem) { showNotification('اختر صنفاً أولاً', 'warning'); return; }
        setQuantityInput(String(selectedItem.quantity));
        setIsQuantityModalOpen(true);
    }, [selectedItem, showNotification]);

    const openDiscountModal = useCallback(() => {
        if (selectedItem) {
            setDiscountScope('item');
            setDiscountType(selectedItem.discountType ?? 'percent');
            setDiscountInput(String(selectedItem.discountValue ?? 0));
        } else {
            setDiscountScope('invoice');
            setDiscountType(invoiceDiscountType);
            setDiscountInput(String(invoiceDiscountValue));
        }
        setIsDiscountModalOpen(true);
    }, [selectedItem, invoiceDiscountType, invoiceDiscountValue]);

    const openNoteModal = useCallback(() => {
        if (!selectedItem) { showNotification('اختر صنفاً أولاً', 'warning'); return; }
        setNoteInput(selectedItem.note ?? '');
        setActiveModal('note');
    }, [selectedItem, showNotification]);

    const openCustomerModal = useCallback(() => {
        setCustomerInput(customerName);
        setActiveModal('customer');
    }, [customerName]);

    // --- Action Handlers ---
    const toggleHoldInvoice = useCallback(() => {
        if (cart.length > 0) {
            setHeldCarts((prev) => [...prev, { id: `invoice-${Date.now()}`, cart, timestamp: Date.now() }]);
            setCart([]);
            setSelectedItemId(null);
            showNotification(`تم تعليق الفاتورة`, 'success');
            return;
        }
        if (heldCarts.length > 0) { setShowHeldInvoicesModal(true); return; }
        showNotification('لا توجد فاتورة للتعليق', 'info');
    }, [cart, heldCarts.length, showNotification]);

    const toggleRefundSelected = useCallback(() => {
        if (!selectedItem) { showNotification('اختر صنفاً أولاً', 'warning'); return; }
        setCart((prev) => prev.map((item) => item.id === selectedItem.id ? { ...item, quantity: item.quantity > 0 ? -Math.abs(item.quantity) : Math.abs(item.quantity) } : item));
    }, [selectedItem, showNotification]);

    const handleSideAction = useCallback((action: string) => {
        switch (action) {
            case 'delete': if (selectedItem) removeFromCart(selectedItem.id); else showNotification('اختر صنفاً للحذف', 'warning'); break;
            case 'quantity': openQuantityModal(); break;
            case 'new-invoice': clearCart(); break;
            case 'search': setIsSearchFocused(true); (document.querySelector('input[type="text"]') as HTMLInputElement)?.focus(); break;
            case 'drawer': showNotification('تم فتح درج النقد', 'success'); break;
            case 'local': setCustomerName('محلي'); break;
            case 'customer': openCustomerModal(); break;
            case 'discount': openDiscountModal(); break;
            case 'note': openNoteModal(); break;
            case 'refund': toggleRefundSelected(); break;
            case 'hold': toggleHoldInvoice(); break;
            case 'transfer': showNotification('تم تحويل الطلب', 'info'); break;
            case 'more': showNotification('خيارات إضافية قريباً', 'info'); break;
            case 'credit': showNotification('تم البيع الآجل', 'success'); clearCart(); break;
            default: break;
        }
    }, [selectedItem, removeFromCart, openQuantityModal, clearCart, openCustomerModal, openDiscountModal, openNoteModal, toggleRefundSelected, toggleHoldInvoice, showNotification]);

    // Global Keybindings logic using Ref to avoid stale closures
    const stateRef = useRef({ handleSideAction, setPaymentMethod });
    useEffect(() => { stateRef.current = { handleSideAction, setPaymentMethod }; }, [handleSideAction]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only trigger if we aren't typing in an input/textarea
            const isTyping = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName);

            switch (e.key) {
                case 'F2': e.preventDefault(); stateRef.current.handleSideAction('discount'); break;
                case 'F3': e.preventDefault(); stateRef.current.handleSideAction('search'); break;
                case 'F4': e.preventDefault(); stateRef.current.handleSideAction('quantity'); break;
                case 'F7': e.preventDefault(); stateRef.current.handleSideAction('transfer'); break;
                case 'F8': e.preventDefault(); stateRef.current.handleSideAction('new-invoice'); break;
                case 'F9': e.preventDefault(); stateRef.current.handleSideAction('hold'); break;
                case 'F10': e.preventDefault(); stateRef.current.handleSideAction('credit'); break;
                case 'F12': e.preventDefault(); stateRef.current.setPaymentMethod('cash'); break;
                case 'Delete':
                    if (!isTyping) { e.preventDefault(); stateRef.current.handleSideAction('delete'); }
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Application functions
    const applyQuantityChange = () => {
        if (!selectedItem) { setIsQuantityModalOpen(false); return; }
        const nextQty = Number(quantityInput);
        if (!Number.isFinite(nextQty) || nextQty <= 0) { showNotification('الكمية يجب أن تكون أكبر من صفر', 'error'); return; }
        setCart((prev) => prev.map((item) => (item.id === selectedItem.id ? { ...item, quantity: nextQty } : item)));
        setIsQuantityModalOpen(false);
    };

    const applyDiscount = () => {
        const value = Number(discountInput);
        if (!Number.isFinite(value) || value < 0) { showNotification('الخصم يجب أن يكون رقماً', 'error'); return; }
        if (discountType === 'percent' && value > 100) { showNotification('نسبة الخصم يجب أن تكون من 0 إلى 100', 'error'); return; }
        if (discountScope === 'invoice') { setInvoiceDiscountType(discountType); setInvoiceDiscountValue(value); setIsDiscountModalOpen(false); showNotification('تم تطبيق الخصم', 'success'); return; }
        if (!selectedItem) { showNotification('اختر صنفاً أولاً', 'warning'); return; }
        setCart((prev) => prev.map((item) => {
            if (item.id !== selectedItem.id) return item;
            const basePrice = getBaseListPrice(item);
            return { ...item, discountPercent: discountType === 'percent' ? value : undefined, discountType, discountValue: value, price: applyUnitDiscount(basePrice, discountType, value) };
        }));
        setIsDiscountModalOpen(false);
    };

    const removeDiscount = () => {
        if (discountScope === 'invoice') { setInvoiceDiscountValue(0); setIsDiscountModalOpen(false); return; }
        if (!selectedItem) return;
        setCart((prev) => prev.map((item) => {
            if (item.id !== selectedItem.id) return item;
            return { ...item, discountPercent: 0, discountType: 'percent', discountValue: 0, price: getBaseListPrice(item) };
        }));
        setIsDiscountModalOpen(false);
    };

    const applyNote = () => {
        if (!selectedItem) { setActiveModal(null); return; }
        setCart((prev) => prev.map((item) => (item.id === selectedItem.id ? { ...item, note: noteInput.trim() } : item)));
        setActiveModal(null);
    };

    const applyCustomer = () => {
        const nextName = customerInput.trim();
        if (!nextName) { showNotification('ادخل اسم العميل', 'error'); return; }
        setCustomerName(nextName);
        setActiveModal(null);
    };

    if (!mounted) return null;

    return (
        <div className="flex flex-col h-screen overflow-hidden selection:bg-blue-500 selection:text-white font-sans">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-[#1a1a1a] shadow-sm z-10 shrink-0 gap-4">
                <div className="flex items-center gap-3 text-xl font-black tracking-wider text-blue-600 dark:text-blue-400">
                    <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-lg">P</span>
                    PosFace
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    العميل: <span className="text-blue-600 dark:text-blue-400 mr-2">{customerName}</span>
                </div>
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors">
                    {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 flex flex-col border-l border-gray-200 dark:border-pos-border bg-white dark:bg-pos-dark">
                    <SearchBarRow
                        searchOptions={SEARCH_OPTIONS}
                        searchMode={searchMode}
                        onSearchModeChange={setSearchMode}
                        searchQuery={searchQuery}
                        onSearchQueryChange={setSearchQuery}
                        onSearchFocusedChange={setIsSearchFocused}
                        showSearchDropdown={showSearchDropdown}
                        filteredProducts={filteredProducts}
                        onSelectProduct={(product) => { addToCart(product); setSearchQuery(''); setIsSearchFocused(false); }}
                    />
                    <CartTable
                        cart={cart}
                        selectedItemId={selectedItemId}
                        editingPriceItemId={editingPriceItemId}
                        subtotal={subtotal}
                        invoiceDiscount={invoiceDiscountAmount}
                        tax={tax}
                        total={total}
                        onSelectRow={setSelectedItemId}
                        onStartPriceEdit={setEditingPriceItemId}
                        onStopPriceEdit={() => setEditingPriceItemId(null)}
                        onPriceListChange={updateItemPriceFromList}
                        onRemoveItem={removeFromCart}
                        onQuickAddFromEmpty={addToCart}
                        products={DUMMY_PRODUCTS}
                    />
                </div>
                <SidePanel paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} onAction={handleSideAction} onClearInvoice={clearCart} />
            </div>

            {/* Modals */}
            <QuantityModal open={isQuantityModalOpen} value={quantityInput} productName={selectedItem?.name} onValueChange={setQuantityInput} onClose={() => setIsQuantityModalOpen(false)} onSubmit={applyQuantityChange} />
            <DiscountModal open={isDiscountModalOpen} hasSelectedItem={Boolean(selectedItem)} scope={discountScope} type={discountType} value={discountInput} itemName={selectedItem?.name} onScopeChange={setDiscountScope} onTypeChange={setDiscountType} onValueChange={setDiscountInput} onClose={() => setIsDiscountModalOpen(false)} onSubmit={applyDiscount} onRemoveDiscount={removeDiscount} />

            {/* Note Inline Modal */}
            {activeModal === 'note' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200" onMouseDown={(e) => e.target === e.currentTarget && setActiveModal(null)}>
                    <div className="pos-modal-card w-full max-w-sm p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">ملاحظة الصنف</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">{selectedItem?.name}</p>
                        <textarea autoFocus value={noteInput} onChange={(e) => setNoteInput(e.target.value)} rows={4} className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#141414] p-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all resize-none" placeholder="اكتب ملاحظة هنا..." onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); applyNote(); } if (e.key === 'Escape') setActiveModal(null); }} />
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setActiveModal(null)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">إلغاء</button>
                            <button onClick={applyNote} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-colors">حفظ</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Customer Inline Modal */}
            {activeModal === 'customer' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200" onMouseDown={(e) => e.target === e.currentTarget && setActiveModal(null)}>
                    <div className="pos-modal-card w-full max-w-sm p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">اسم العميل</h3>
                        <input autoFocus value={customerInput} onChange={(e) => setCustomerInput(e.target.value)} className="w-full h-14 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#141414] px-4 text-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all" placeholder="محلي" onKeyDown={(e) => { if (e.key === 'Enter') applyCustomer(); if (e.key === 'Escape') setActiveModal(null); }} />
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setActiveModal(null)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">إلغاء</button>
                            <button onClick={applyCustomer} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-colors">حفظ</button>
                        </div>
                    </div>
                </div>
            )}

            <HeldInvoicesModal open={showHeldInvoicesModal} heldInvoices={heldCarts} onClose={() => setShowHeldInvoicesModal(false)} onSelectInvoice={(inv) => { setCart(inv.cart); setHeldCarts((p) => p.filter((h) => h.id !== inv.id)); setSelectedItemId(null); }} onRemoveInvoice={(id) => setHeldCarts((p) => p.filter((inv) => inv.id !== id))} />
            <ConfirmModal open={showClearConfirm} title="إلغاء الفاتورة" message="هل أنت متأكد من إلغاء الفاتورة الحالية؟ لا يمكن التراجع عن هذا الإجراء." confirmText="نعم، ألغ" cancelText="تراجع" isDangerous onClose={() => setShowClearConfirm(false)} onConfirm={confirmClearCart} />

            <NotificationManager notifications={notifications} onRemove={removeNotification} />
        </div>
    );
}