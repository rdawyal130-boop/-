import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Store, ShoppingCart, RefreshCw, Layers, 
  HelpCircle, Info, CheckCircle2, ChevronRight, Package, ClipboardList
} from 'lucide-react';

import { Product, Order, CartItem, UserRole, OrderStatus } from './types';
import { INITIAL_PRODUCTS, DEFAULT_CATEGORIES } from './initialData';
import WholesalerDashboard from './components/WholesalerDashboard';
import SupermarketDashboard from './components/SupermarketDashboard';

// Mock historical orders for rich experience
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1049',
    supermarketName: 'أسواق الرافدين الغذائية',
    ownerName: 'الحاج أبو أحمد الكناني',
    phone: '07801234567',
    address: 'بغداد، المنصور، شارع 14 رمضان، خلف مطعم زرزور',
    items: [
      {
        productId: 'sweet-1',
        productName: 'شوكولاتة جالاكسي بالتمر ميني',
        price: 32000,
        quantity: 1,
        unit: 'كرتونة (24 علبة)'
      },
      {
        productId: 'dairy-1',
        productName: 'حليب كالم دير كامل الدسم 1 لتر',
        price: 15000,
        quantity: 2,
        unit: 'صندوق (12 علبة)'
      }
    ],
    totalPrice: 62000,
    status: 'completed',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2).toISOString(), // 2 days ago
    notes: 'يرجى إرفاق قائمة أسعار حلويات العيد الجديدة مع الطلبية.'
  },
  {
    id: 'ord-3051',
    supermarketName: 'سوبرماركت النخيل الحديث',
    ownerName: 'أبو فهد الخفاجي',
    phone: '07709876543',
    address: 'البصرة، حي الجزائر، فرع جامع الموسوي المعمور',
    items: [
      {
        productId: 'grocery-1',
        productName: 'أرز بسمتي هندي درجة أولى حبة طويلة',
        price: 35000,
        quantity: 3,
        unit: 'كيس (20 كغم)'
      },
      {
        productId: 'grocery-2',
        productName: 'زيت طبخ عافية ذرة نقي',
        price: 48000,
        quantity: 1,
        unit: 'كرتونة (6 عبوات × 1.5 لتر)'
      }
    ],
    totalPrice: 153000,
    status: 'pending',
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    notes: 'التوصيل مطلوب صباحاً قبل فتح المحل الرسمي.'
  }
];

export default function App() {
  // Load products, categories, orders, cart and active role from localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wholesale_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(() => {
    const saved = localStorage.getItem('wholesale_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('wholesale_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('wholesale_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('wholesale_role');
    return (saved as UserRole) || 'supermarket';
  });

  // Sync state with localStorage on changes
  useEffect(() => {
    localStorage.setItem('wholesale_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('wholesale_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('wholesale_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('wholesale_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wholesale_role', activeRole);
  }, [activeRole]);

  // Wholesaler Handlers
  const handleAddProduct = (newPrd: Omit<Product, 'id'>) => {
    const productWithId: Product = {
      ...newPrd,
      id: 'prd-' + Math.floor(Math.random() * 1000000)
    };
    setProducts(prev => [productWithId, ...prev]);
  };

  const handleUpdateProduct = (updatedPrd: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedPrd.id ? updatedPrd : p));
    // Update active cart items if the product is modified
    setCart(prev => prev.map(item => {
      if (item.product.id === updatedPrd.id) {
        return { ...item, product: updatedPrd };
      }
      return item;
    }));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleAddCategory = (name: string) => {
    const newId = 'cat-' + Math.floor(Math.random() * 1000);
    setCategories(prev => [...prev, { id: newId, name }]);
  };

  // Supermarket Cart Handlers
  const handleAddToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        // cap to maximum available stock
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: newQty } : item);
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        // Cap quantity to stock
        const safeQty = Math.min(quantity, product.stock);
        return { ...item, quantity: safeQty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handlePlaceOrder = (orderDetails: {
    supermarketName: string;
    ownerName: string;
    phone: string;
    address: string;
    notes?: string;
  }) => {
    const orderItems = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      unit: item.product.unit
    }));

    const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const newOrder: Order = {
      id: 'ord-' + Math.floor(Math.random() * 10000),
      ...orderDetails,
      items: orderItems,
      totalPrice,
      status: 'pending',
      date: new Date().toISOString()
    };

    // 1. Add order to wholesaler queue
    setOrders(prev => [newOrder, ...prev]);

    // 2. Reduce stock for each product purchased
    setProducts(prev => prev.map(p => {
      const purchased = cart.find(item => item.product.id === p.id);
      if (purchased) {
        return { ...p, stock: Math.max(0, p.stock - purchased.quantity) };
      }
      return p;
    }));

    // 3. Clear shopping cart
    setCart([]);
  };

  const handleResetSystem = () => {
    if (window.confirm('هل تريد بالتأكيد إعادة تعيين التطبيق إلى البيانات الافتراضية؟ سيؤدي ذلك إلى حذف المنتجات والطلبات المضافة.')) {
      setProducts(INITIAL_PRODUCTS);
      setCategories(DEFAULT_CATEGORIES);
      setOrders(INITIAL_ORDERS);
      setCart([]);
      setActiveRole('supermarket');
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white pb-16 antialiased">
      {/* GLOBAL HEADER/NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Right side: App Title & branding (Arabic is right-to-left) */}
            <div className="flex items-center gap-3 text-right" dir="rtl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-600/10">
                📦
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-slate-900 leading-none">سوق الجملة المباشر</h1>
                <span className="text-[10px] text-slate-400 mt-1 block">بوابة التوريد الفوري للمواد الغذائية</span>
              </div>
            </div>

            {/* Left side: Dual mode switcher with custom labels */}
            <div className="flex items-center gap-3">
              {/* Reset System Button */}
              <button
                onClick={handleResetSystem}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="إعادة ضبط النظام"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">إعادة تهيئة البيانات</span>
              </button>

              <div className="h-6 w-px bg-slate-200"></div>

              {/* Toggle controls */}
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                <button
                  onClick={() => setActiveRole('supermarket')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeRole === 'supermarket'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>لوحة السوبرماركت</span>
                </button>
                <button
                  onClick={() => setActiveRole('wholesaler')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeRole === 'wholesaler'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>لوحة تاجر الجملة</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* DUAL ROLE INTERACTIVE SIMULATOR EXPLAINER ACCORDION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 border border-slate-200/50 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-right" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-xs text-indigo-600">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">💡 ميزة المحاكاة التفاعلية المزدوجة:</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                يمكنك التبديل في أي وقت بين هويتين: <strong>صاحب الجملة</strong> لتعديل الأسعار وإضافة منتجات ومعالجة طلبات التوصيل، أو <strong>صاحب السوبرماركت</strong> لتصفح المواد وإجراء عمليات الشراء. البيانات متزامنة ولحظية!
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">6 فئات متكاملة</span>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">تحديث فوري لربحية المحل</span>
          </div>
        </div>
      </div>

      {/* CORE DASHBOARD PAGE BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <AnimatePresence mode="wait">
          {activeRole === 'wholesaler' ? (
            <motion.div
              key="wholesaler"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <WholesalerDashboard
                products={products}
                orders={orders}
                categories={categories}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onAddCategory={handleAddCategory}
              />
            </motion.div>
          ) : (
            <motion.div
              key="supermarket"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <SupermarketDashboard
                products={products}
                orders={orders}
                categories={categories}
                cart={cart}
                onAddToCart={handleAddToCart}
                onUpdateCartQty={handleUpdateCartQty}
                onRemoveFromCart={handleRemoveFromCart}
                onPlaceOrder={handlePlaceOrder}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* PERSISTENT FOOTER FOR CRAFTSMANSHIP */}
      <footer className="mt-16 text-center text-xs text-slate-400 py-6 border-t border-slate-200 max-w-7xl mx-auto">
        <p>نظام التوريد الذكي والربط المباشر مع أسواق الجملة الغذائية © 2026</p>
        <p className="mt-1 text-[10px] text-slate-400">صمم خصيصاً لأصحاب السوبرماركت ومحلات الأغذية وإدارة المخزون والتسعير.</p>
      </footer>
    </div>
  );
}
