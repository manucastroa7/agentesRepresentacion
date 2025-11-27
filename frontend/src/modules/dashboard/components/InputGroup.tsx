import React from 'react';

interface InputGroupProps {
    label: string;
    error?: any;
    children: React.ReactNode;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, error, children }) => (
    <div className="space-y-2">
        <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</label>
        {children}
        {error && <span className="text-red-500 text-xs">{error.message}</span>}
    </div>
);

export default InputGroup;
