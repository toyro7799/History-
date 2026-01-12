import React, { useState, useRef, useEffect } from 'react';

interface BaseProps {
  label?: React.ReactNode;
  id?: string;
  className?: string;
  helpText?: string;
}

interface InputProps extends BaseProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  type?: 'text' | 'date' | 'number';
  readOnly?: boolean;
}

interface SelectProps extends BaseProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[] | { label: string; value: string }[];
  placeholder?: string;
}

const InputWrapper: React.FC<BaseProps & { children: React.ReactNode }> = ({ label, id, children, className = "", helpText }) => (
  <div className={`mb-5 ${className}`}>
    {label && (
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
      </label>
    )}
    {children}
    {helpText && <p className="mt-1 text-xs text-slate-500 italic">{helpText}</p>}
  </div>
);

export const TextInput: React.FC<InputProps> = ({ label, id, value, onChange, className, placeholder, type = 'text', helpText, readOnly }) => (
  <InputWrapper label={label} id={id} className={className} helpText={helpText}>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 px-3 transition duration-150 ease-in-out border 
        ${readOnly ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 hover:bg-white'}`}
    />
  </InputWrapper>
);

export const SelectInput: React.FC<SelectProps> = ({ label, id, value, onChange, options, className, placeholder = "Select Option", helpText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (selectedValue: string) => {
    const syntheticEvent = {
      target: {
        id: id,
        value: selectedValue
      }
    } as unknown as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => 
    (typeof opt === 'string' ? opt : opt.value) === value
  );
  const displayValue = selectedOption 
    ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label)
    : placeholder;

  const hasSelection = !!selectedOption;

  return (
    <InputWrapper label={label} id={id} className={className} helpText={helpText}>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-full cursor-pointer rounded-lg border py-3 ltr:pl-4 ltr:pr-10 rtl:pr-4 rtl:pl-10 text-start shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500/50 sm:text-sm
            ${isOpen 
              ? 'border-teal-500 ring-2 ring-teal-100 bg-white' 
              : 'border-slate-300 bg-slate-50 hover:bg-white hover:border-teal-400'
            }`}
        >
          <span className={`block truncate ${!hasSelection ? 'text-slate-400 font-normal' : 'text-slate-900 font-medium'}`}>
            {displayValue}
          </span>
          <span className="pointer-events-none absolute inset-y-0 ltr:right-0 rtl:left-0 flex items-center ltr:pr-3 rtl:pl-3">
            <svg
              className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-600' : 'text-slate-400'}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-xl ring-1 ring-black/5 focus:outline-none sm:text-sm animate-[fade-in_0.1s_ease-out]">
            {options.map((opt, index) => {
              const labelStr = typeof opt === 'string' ? opt : opt.label;
              const valueStr = typeof opt === 'string' ? opt : opt.value;
              const isSelected = value === valueStr;

              return (
                <div
                  key={index}
                  onClick={() => handleSelect(valueStr)}
                  className={`group relative cursor-pointer select-none py-2.5 ltr:pl-4 ltr:pr-9 rtl:pr-4 rtl:pl-9 transition-colors duration-100 
                    ${isSelected ? 'bg-teal-50 text-teal-900' : 'text-slate-700 hover:bg-slate-50 hover:text-teal-800'}`}
                >
                  <div className="flex items-center">
                    <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                      {labelStr}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="absolute inset-y-0 ltr:right-0 rtl:left-0 flex items-center ltr:pr-4 rtl:pl-4 text-teal-600">
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </InputWrapper>
  );
};

export const TextArea: React.FC<InputProps> = ({ label, id, value, onChange, className, helpText }) => (
  <InputWrapper label={label} id={id} className={className} helpText={helpText}>
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      rows={4}
      className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2 px-3 transition duration-150 ease-in-out bg-slate-50 border hover:bg-white"
    />
  </InputWrapper>
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-6 mt-8 pb-3 border-b-2 border-teal-100">
    <h3 className="text-xl font-bold text-teal-900 leading-6">{title}</h3>
    {subtitle && <p className="mt-2 text-sm text-slate-600 bg-teal-50 p-2 rounded-md border border-teal-100 inline-block">{subtitle}</p>}
  </div>
);

export const LabelText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-sm font-semibold text-slate-800 mb-2 mt-4">{children}</div>
);
