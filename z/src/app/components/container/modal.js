"use client";

export default function Modal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-sm w-full mx-4">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-transparent rounded-full text-secondary-light border border-secondary-light hover:bg-secondary-light/20 transition-all"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-error text-secondary-light rounded-full hover:bg-error/20 transition-all"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
}
