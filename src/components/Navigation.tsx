import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface NavItem {
  id: string;
  name: string;
  icon: React.ElementType;
  description?: string;
  dropdownItems?: Array<{
    id: string;
    name: string;
    icon: React.ElementType;
    color: string;
    description: string;
  }>;
}

interface NavigationProps {
  items: NavItem[];
  activeSection: string;
  onNavClick: (navId: string, dropdownId?: string) => void;
}

function Navigation({ items, activeSection, onNavClick }: NavigationProps) {
  const handleNavItemClick = (item: NavItem, dropdownId?: string) => {
    onNavClick(item.id, dropdownId);
  };

  return (
    <div className="bg-gray-900 shadow-lg fixed top-16 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex -mb-px space-x-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative group"
            >
              <button
                onClick={() => handleNavItemClick(item)}
                className={`
                  flex items-center px-3 py-4 text-sm font-bold border-b-2 transition-all duration-200
                  ${(activeSection === item.id || 
                    (item.id === 'level2' && item.dropdownItems?.some(d => d.id === activeSection)) ||
                    (item.id === 'inputs' && item.dropdownItems?.some(d => d.id === activeSection)))
                    ? 'border-monaco-bronze text-monaco-bronze'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                  }
                `}
              >
                <item.icon className="h-5 w-5 mr-2" />
                <span>{item.name}</span>
                {item.dropdownItems && item.id !== 'level2' && item.id !== 'inputs' && (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </button>

              {/* Dropdown Panel */}
              {item.dropdownItems && item.id !== 'level2' && item.id !== 'inputs' && (
                <div className="absolute left-0 top-full pt-2 z-30">
                  <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 w-[800px]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white flex items-center">
                        <item.icon className="h-5 w-5 mr-2 text-monaco-bronze" />
                        {item.name}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {(item.dropdownItems || []).map((dropdownItem) => (
                        <button
                          key={dropdownItem.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavItemClick(item, dropdownItem.id);
                          }}
                          className={`
                            relative group overflow-hidden rounded-lg transition-transform duration-300
                            ${activeSection === dropdownItem.id
                              ? 'ring-2 ring-monaco-bronze shadow-lg scale-[1.02]'
                              : 'hover:shadow-lg hover:scale-[1.02]'
                            }
                          `}
                        >
                          <div className="relative p-4 bg-gray-700 hover:bg-gray-600 transition-colors">
                            <div className="flex items-center">
                              <div className={`
                                p-2 rounded-lg mr-3 transition-colors
                                ${activeSection === dropdownItem.id 
                                  ? 'bg-monaco-bronze text-white'
                                  : dropdownItem.color || 'bg-gray-600 text-gray-300'
                                }
                              `}>
                                <dropdownItem.icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white font-medium">{dropdownItem.name}</h4>
                                {dropdownItem.description && (
                                  <p className="text-sm text-gray-400 mt-1">{dropdownItem.description}</p>
                                )}
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Navigation;