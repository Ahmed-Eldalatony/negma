import { Home, Grid3x3, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router";

const navItems = [
  { id: 'home', path: '/', icon: Home, labelAr: 'الرئيسية' },
  { id: 'categories', path: '/categories', icon: Grid3x3, labelAr: 'التصنيفات' },
  { id: 'cart', path: '/cart', icon: ShoppingCart, labelAr: 'السلة' },
  { id: 'account', path: '/account', icon: User, labelAr: 'حسابي' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-background border-t  z-50"
      data-testid="bottom-nav"
    >
      <div className=" max-w-md  mx-auto flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link 
              key={item.id} 
              to={item.path}
              data-testid={`link-nav-${item.id}`}
            >
              <div className="flex flex-col items-center gap-1 px-3 py-2 min-w-[60px]">
                <Icon 
                  className={`h-5 w-5 ${isActive ? 'fill-current' : ''}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span 
                  className={`text-xs ${isActive ? 'font-bold' : 'font-normal'}`}
                >
                  {item.labelAr}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
