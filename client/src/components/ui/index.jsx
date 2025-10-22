import React from 'react';

const SkeletonCard = () => (
  <div className="stat-card animate-pulse">
    <div className="flex items-center">
      <div className="flex-shrink-0 p-4 rounded-2xl bg-gray-200 h-16 w-16"></div>
      <div className="ml-6">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);

const SkeletonTableRow = () => (
  <tr className="animate-pulse">
    <td className="table-cell">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
        <div className="ml-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </td>
    <td className="table-cell">
      <div className="h-4 bg-gray-200 rounded w-48"></div>
    </td>
    <td className="table-cell">
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
    </td>
    <td className="table-cell">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="table-cell">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="table-cell">
      <div className="flex gap-2">
        <div className="h-4 w-4 bg-gray-200 rounded"></div>
        <div className="h-4 w-4 bg-gray-200 rounded"></div>
      </div>
    </td>
  </tr>
);

const SkeletonTable = ({ rows = 5 }) => (
  <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
        <tr>
          <th className="table-header">Name</th>
          <th className="table-header">Email</th>
          <th className="table-header">Role</th>
          <th className="table-header">Organization</th>
          <th className="table-header">Created</th>
          <th className="table-header">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, index) => (
          <SkeletonTableRow key={index} />
        ))}
      </tbody>
    </table>
  </div>
);

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}></div>
  );
};

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction, 
  className = "" 
}) => (
  <div className={`text-center py-12 ${className}`}>
    <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
      <Icon className="h-16 w-16" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
    {actionText && onAction && (
      <button onClick={onAction} className="btn-primary">
        {actionText}
      </button>
    )}
  </div>
);

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className = "" 
}) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-field pl-10 pr-4"
      placeholder={placeholder}
    />
  </div>
);

const FilterSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Filter by...", 
  className = "" 
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`input-field ${className}`}
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "danger" 
}) => {
  if (!isOpen) return null;

  const buttonClass = type === 'danger' ? 'btn-danger' : 'btn-primary';

  return (
    <div className="modal-overlay">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="modal-content">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={onClose} className="btn-secondary">
                {cancelText}
              </button>
              <button onClick={onConfirm} className={buttonClass}>
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message, type = 'success', onClose }) => {
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed top-4 right-4 ${typeClasses[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export {
  SkeletonCard,
  SkeletonTable,
  SkeletonTableRow,
  LoadingSpinner,
  EmptyState,
  SearchInput,
  FilterSelect,
  ConfirmDialog,
  Toast
};
