import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-4">
      <Link to="/" className="hover:text-blue-600 flex items-center gap-1">
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href ? (
            <Link to={item.href} className="hover:text-blue-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
