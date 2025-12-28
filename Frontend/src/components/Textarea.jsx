import React, { forwardRef } from 'react';
import clsx from 'clsx';

const Textarea = forwardRef(({ label, error, className, rows = 4, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={clsx(
          "w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors",
          error 
            ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
            : "border-slate-300 dark:border-slate-600",
          "text-slate-900 dark:text-white",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
