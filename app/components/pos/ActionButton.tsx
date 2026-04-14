import type { ElementType } from 'react';

type ActionButtonProps = {
    FKey?: string;
    icon?: ElementType;
    label: string;
    colSpan?: 1 | 2;
    color?: string;
    textColor?: string;
    onClick?: () => void;
};

export default function ActionButton({
    FKey,
    icon: Icon,
    label,
    colSpan = 1,
    color = 'bg-white dark:bg-pos-dark border border-gray-300 dark:border-pos-border hover:bg-gray-100 dark:hover:bg-pos-dark-hover',
    textColor = 'text-gray-800 dark:text-gray-200',
    onClick,
}: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`relative flex flex-col items-center justify-center p-3 rounded-sm transition-colors ${colSpan === 2 ? 'col-span-2' : ''} ${color} ${textColor}`}
        >
            {FKey && <span className="absolute top-1 left-1 text-[10px] opacity-60">{FKey}</span>}
            {Icon && <Icon className="w-6 h-6 mb-1" />}
            <span className="text-xs font-semibold">{label}</span>
        </button>
    );
}
