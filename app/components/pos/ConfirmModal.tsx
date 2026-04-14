type ConfirmModalProps = {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export default function ConfirmModal({ open, title, message, confirmText = 'تأكيد', cancelText = 'إلغاء', isDangerous = false, onClose, onConfirm }: ConfirmModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <div className="pos-modal-card w-full max-w-sm p-6 text-center">
                <div className={`mx-auto w-12 h-12 rounded-full mb-4 flex items-center justify-center ${isDangerous ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6 leading-relaxed">{message}</p>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        {cancelText}
                    </button>
                    <button onClick={() => { onConfirm(); onClose(); }} className={`flex-1 py-3 rounded-xl text-white font-bold transition-colors shadow-md ${isDangerous ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}