"use client";
import React from 'react';

interface PremiumSliderProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    label?: string;
    showValue?: boolean;
    unit?: string;
}

export const PremiumSlider: React.FC<PremiumSliderProps> = ({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    label,
    showValue = true,
    unit = '',
}) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="space-y-2">
            {label && (
                <div className="flex items-center justify-between">
                    <span className="editor-section-header">{label}</span>
                    {showValue && (
                        <span className="text-sm font-semibold text-gray-700">
                            {value}{unit}
                        </span>
                    )}
                </div>
            )}
            <div className="relative">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    disabled={disabled}
                    className="editor-slider w-full"
                    style={{
                        background: `linear-gradient(to right, var(--editor-accent) 0%, var(--editor-accent) ${percentage}%, var(--editor-control-bg) ${percentage}%, var(--editor-control-bg) 100%)`,
                    }}
                />
            </div>
        </div>
    );
};

interface PremiumColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    disabled?: boolean;
    label?: string;
}

export const PremiumColorPicker: React.FC<PremiumColorPickerProps> = ({
    value,
    onChange,
    disabled = false,
    label,
}) => {
    return (
        <div className="space-y-2">
            {label && <span className="editor-section-header">{label}</span>}
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className="editor-color-picker"
                />
                <div className="flex-1">
                    <input
                        type="text"
                        value={value.toUpperCase()}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className="editor-input text-sm font-mono"
                        placeholder="#000000"
                    />
                </div>
            </div>
        </div>
    );
};

interface PremiumSelectProps {
    value: string | number;
    onChange: (value: string | number) => void;
    options: Array<{ label: string; value: string | number }>;
    disabled?: boolean;
    label?: string;
    placeholder?: string;
}

export const PremiumSelect: React.FC<PremiumSelectProps> = ({
    value,
    onChange,
    options,
    disabled = false,
    label,
    placeholder,
}) => {
    return (
        <div className="space-y-2">
            {label && <span className="editor-section-header">{label}</span>}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="editor-select"
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

interface PremiumButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
    fullWidth = false,
    icon,
    type = 'button',
}) => {
    const variantClasses = {
        primary: 'editor-btn-primary',
        secondary: 'editor-btn-secondary',
        danger: 'editor-btn-danger',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`editor-btn ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''}`}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span className="relative z-10">{children}</span>
        </button>
    );
};

interface PremiumInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    multiline?: boolean;
    rows?: number;
    type?: string;
}

export const PremiumInput: React.FC<PremiumInputProps> = ({
    value,
    onChange,
    placeholder,
    disabled = false,
    label,
    multiline = false,
    rows = 3,
    type = 'text',
}) => {
    return (
        <div className="space-y-2">
            {label && <span className="editor-section-header">{label}</span>}
            {multiline ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={rows}
                    className="editor-input resize-none"
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="editor-input"
                />
            )}
        </div>
    );
};

interface PremiumIconButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
    disabled?: boolean;
    tooltip?: string;
}

export const PremiumIconButton: React.FC<PremiumIconButtonProps> = ({
    children,
    onClick,
    active = false,
    disabled = false,
    tooltip,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`editor-icon-btn ${active ? 'active' : ''}`}
            title={tooltip}
        >
            {children}
        </button>
    );
};

interface PremiumDividerProps {
    className?: string;
}

export const PremiumDivider: React.FC<PremiumDividerProps> = ({ className = '' }) => {
    return <div className={`editor-divider ${className}`} />;
};
