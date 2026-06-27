import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Search, Plus, Minus, Trash2, CheckCircle2, 
  MapPin, Phone, User, Store, FileText, Check, Truck, Clock, RefreshCw, XCircle, Tag, DollarSign, TrendingUp
} from 'lucide-react';
import { Product, CartItem, Order, OrderStatus } from '../types';

interface SupermarketDashboardProps {
  products: Product[];
  orders: Order[];
  categories: { id: string; name: string }[];
  cart: CartItem[];
  onAddToCart: (product: Product, qty: number) => void;
  onUpdateCartQty: (productId: string, qty: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onPlaceOrder: (orderDetails: {
    supermarketName: string;
    ownerName: string;
    phone: string;
    address: string;
    notes?: string;
  }) => void;
}

export default function SupermarketDashboard({
  products,
  orders,
  categories,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onPlaceOrder
}: SupermarketDashboardProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'my-orders'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [lastPlacedOrderId, setLastPlacedOrderId] = useState<string | null>(null);

  // Form Fields (loaded from localStorage if exists, to remember supermarket details)
  const [supermarketName, setSupermarketName] = useState(() => localStorage.getItem('sm_name') || '');
  const [ownerName, setOwnerName] = useState(() => localStorage.getItem('sm_owner') || '');
  const [phone, setPhone] = useState(() => localStorage.getItem('sm_phone') || '');
  const [address, setAddress] = useState(() => localStorage.getItem('sm_address') || '');
  const [notes, setNotes] = useState('');

  // Local product quantity selectors
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Persist supermarket profile fields
  useEffect(() => {
    localStorage.setItem('sm_name', supermarketName);
    localStorage.setItem('sm_owner', ownerName);
    localStorage.setItem('sm_phone', phone);
    localStorage.setItem('sm_address', address);
  }, [supermarketName, ownerName, phone, address]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (product.code && product.code.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleQtyChange = (productId: string, val: number, maxStock: number) => {
    const current = quantities[productId] || 1;
    const next = current + val;
    if (next >= 1 && next <= maxStock) {
      setQuantities({ ...quantities, [productId]: next });
    }
  };

  const handleAddToCartClick = (product: Product) => {
    const qty = quantities[product.id] || 1;
    onAddToCart(product, qty);
    // Reset temporary qty back to 1
    setQuantities({ ...quantities, [product.id]: 1 });
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supermarketName || !ownerName || !phone || !address) return;

    onPlaceOrder({
      supermarketName,
      ownerName,
      phone,
      address,
      notes
    });

    setNotes('');
    setIsCheckoutOpen(false);
    setIsOrderSuccess(true);
    // Fetch the last order ID placed by this supermarket
    const placedOrder = orders[orders.length - 1];
    if (placedOrder) {
      setLastPlacedOrderId(placedOrder.id);
    }
  };

  const getOrderStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'قيد الانتظار والمراجعة', color: 'bg-amber-500 text-white', icon: Clock };
      case 'preparing':
        return { label: 'جاري تجهيز طلبيتك في المخزن', color: 'bg-blue-500 text-white', icon: RefreshCw };
      case 'shipping':
        return { label: 'خرجت الشحنة للتوصيل المباشر', color: 'bg-purple-500 text-white', icon: Truck };
      case 'completed':
        return { label: 'تم تسليم الطلب واستلام المبلغ', color: 'bg-emerald-500 text-white', icon: CheckCircle2 };
      case 'cancelled':
        return { label: 'تم إلغاء الطلب', color: 'bg-rose-500 text-white', icon: XCircle };
    }
  };

  return (
    <div className="w-full text-right" dir="rtl">
      {/* Hero Banner for Supermarket */}
      <div className="mb-8 rounded-sm bg-slate-900 border-2 border-slate-950 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500 rounded-none mix-blend-multiply filter blur-3xl opacity-10 -translate-x-10 -translate-y-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-none font-bold">حساب السوبرماركت والمحلات</span>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">منصة الشراء المباشر بسعر الجملة</h1>
            </div>
            <p className="text-slate-300 text-xs md:text-sm max-w-xl">تسوّق الآن واحصل على أفضل أسعار الجملة لمتجرك الغذائي، مع شحن مباشر وسريع إلى باب محلك مع كشوفات فواتير مفصلة.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 text-xs font-bold rounded-sm cursor-pointer transition-all border ${
                activeTab === 'browse' ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              تسوّق المنتجات
            </button>
            <button
              onClick={() => setActiveTab('my-orders')}
              className={`px-4 py-2 text-xs font-bold rounded-sm cursor-pointer transition-all border flex items-center gap-1.5 ${
                activeTab === 'my-orders' ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              طلباتي السابقة ({orders.length})
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* BROWSE PRODUCTS TAB */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'browse' ? (
            <>
              {/* Category selector & Search bar */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Scrollable categories bar */}
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-1.5 rounded-sm text-xs font-bold transition-all border cursor-pointer whitespace-nowrap ${
                        selectedCategory === cat.id 
                          ? 'bg-emerald-600 text-white border-emerald-700' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Search query input */}
                <div className="relative w-full md:w-72">
                  <input
                    type="text"
                    placeholder="ابحث باسم السلعة أو الباركود..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 text-xs border border-slate-300 rounded-sm focus:outline-none focus:border-slate-900 text-right pr-4 bg-white"
                  />
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-sm border-2 border-slate-200 p-16 text-center text-slate-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-500" />
                  <p className="text-sm">لا توجد منتجات متوفرة حالياً في هذا القسم.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map(product => {
                    const tempQty = quantities[product.id] || 1;
                    const inCartItem = cart.find(item => item.product.id === product.id);
                    
                    // Margin analysis
                    const potentialProfit = product.retailPrice ? (product.retailPrice - product.price) : 0;
                    const profitPercent = product.retailPrice ? Math.round((potentialProfit / product.price) * 100) : 0;

                    return (
                      <motion.div
                        layout
                        key={product.id}
                        className="bg-white rounded-sm border-2 border-slate-200 hover:border-slate-900 transition-all p-5 flex flex-col justify-between"
                      >
                        <div>
                          {/* Upper Card Header */}
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-none border border-slate-200">
                              {product.category}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none border ${
                              product.stock > 15 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              مخزن: {product.stock} {product.unit.split(' ')[0]}
                            </span>
                          </div>

                          {/* Product details */}
                          <h4 className="text-sm font-extrabold text-slate-900 leading-snug mb-1">{product.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono block">الباركود: {product.code || 'غير متوفر'}</span>
                          
                          {product.description && (
                            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed line-clamp-2">
                              {product.description}
                            </p>
                          )}

                          {/* Pricing metrics */}
                          <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-baseline">
                            <div>
                              <span className="text-[10px] text-slate-400 block">سعر الجملة</span>
                              <span className="text-base font-extrabold text-slate-900 font-mono">
                                {product.price.toLocaleString()} <span className="text-xs font-sans font-medium text-slate-500">د.ع</span>
                              </span>
                            </div>

                            {product.retailPrice && (
                              <div className="text-left">
                                <span className="text-[10px] text-slate-400 block">المفرد المقترح</span>
                                <span className="text-xs font-bold text-slate-600 font-mono">
                                  {product.retailPrice.toLocaleString()} د.ع
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Profit margin Badge */}
                          {potentialProfit > 0 && (
                            <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-none p-2 flex items-center justify-between text-[11px]">
                              <span className="text-emerald-800 flex items-center gap-1 font-bold">
                                <TrendingUp className="w-3.5 h-3.5" /> ربحك المقدر للجملة:
                              </span>
                              <span className="font-mono font-extrabold text-emerald-800">+{potentialProfit.toLocaleString()} د.ع ({profitPercent}%)</span>
                            </div>
                          )}
                        </div>

                        {/* Order action footer inside card */}
                        <div className="mt-5 pt-3 border-t border-slate-200 flex items-center gap-3">
                          {product.stock <= 0 ? (
                            <span className="w-full text-center py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded-sm border border-slate-200">
                              الكمية نافذة مؤقتاً
                            </span>
                          ) : (
                            <>
                              {/* Quantity Selector inside card */}
                              <div className="flex items-center border border-slate-300 rounded-sm bg-slate-50 px-1">
                                <button
                                  onClick={() => handleQtyChange(product.id, -1, product.stock)}
                                  className="p-1.5 hover:text-slate-950 text-slate-400 transition-colors cursor-pointer"
                                  disabled={tempQty <= 1}
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center text-xs font-extrabold text-slate-800 font-mono">
                                  {tempQty}
                                </span>
                                <button
                                  onClick={() => handleQtyChange(product.id, 1, product.stock)}
                                  className="p-1.5 hover:text-slate-950 text-slate-400 transition-colors cursor-pointer"
                                  disabled={tempQty >= product.stock}
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Add Button */}
                              <button
                                onClick={() => handleAddToCartClick(product)}
                                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-sm flex items-center justify-center gap-1 cursor-pointer transition-all border border-slate-950"
                              >
                                <span>إضافة للسلة</span>
                                {inCartItem && (
                                  <span className="bg-emerald-500 text-white text-[10px] w-4.5 h-4.5 rounded-none border border-emerald-600 flex items-center justify-center font-mono font-bold">
                                    {inCartItem.quantity}
                                  </span>
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            // MY ORDERS LIST TAB
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-700 font-sans">سجل طلباتي وقائمة فواتير الشراء</h3>
                <span className="text-xs text-slate-400 font-mono">العدد الإجمالي: {orders.length} طلب</span>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-sm border border-slate-200 p-16 text-center text-slate-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-500" />
                  <p className="text-sm">لم تقم بإجراء أي طلبات شراء من تاجر الجملة بعد.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => {
                    const stInfo = getOrderStatusInfo(order.status);
                    const StatusIcon = stInfo.icon;
                    return (
                      <div key={order.id} className="bg-white rounded-sm border-2 border-slate-200 p-5 space-y-4 shadow-none">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-slate-900">فاتورة شراء رقم #{order.id.slice(0, 8)}</span>
                              <span className={`text-[10px] px-2.5 py-1 rounded-none font-bold flex items-center gap-1 border ${stInfo.color}`}>
                                <StatusIcon className="w-3.5 h-3.5" /> {stInfo.label}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 block mt-1">تاريخ الطلب: {new Date(order.date).toLocaleDateString('ar-EG')} - {new Date(order.date).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-slate-400 block">مجموع حساب الجملة</span>
                            <span className="text-base font-extrabold text-slate-900 font-mono">{(order.totalPrice).toLocaleString()} د.ع</span>
                          </div>
                        </div>

                        {/* Order Progress Stepper */}
                        <div className="py-2">
                          <div className="flex justify-between items-center relative">
                            {/* Line bar behind stepper */}
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
                            
                            {/* Step points */}
                            {[
                              { label: 'قيد المراجعة', status: 'pending', color: 'bg-amber-500 border-amber-600' },
                              { label: 'تجهيز السلع', status: 'preparing', color: 'bg-blue-500 border-blue-600' },
                              { label: 'جاري الشحن', status: 'shipping', color: 'bg-purple-500 border-purple-600' },
                              { label: 'مكتمل ومسلم', status: 'completed', color: 'bg-emerald-600 border-emerald-700' }
                            ].map((step, idx, arr) => {
                              const statusesOrder = ['pending', 'preparing', 'shipping', 'completed'];
                              const currentIdx = statusesOrder.indexOf(order.status);
                              const stepIdx = statusesOrder.indexOf(step.status);
                              
                              const isPassed = currentIdx >= stepIdx && order.status !== 'cancelled';
                              const isActive = order.status === step.status;

                              return (
                                <div key={step.status} className="flex flex-col items-center relative z-10">
                                  <div className={`w-7 h-7 rounded-none border-2 flex items-center justify-center text-xs font-bold transition-all ${
                                    isPassed 
                                      ? `${step.color} text-white scale-110 shadow-none` 
                                      : 'bg-white text-slate-300 border-slate-300'
                                  }`}>
                                    {isPassed ? <Check className="w-4 h-4" /> : idx + 1}
                                  </div>
                                  <span className={`text-[10px] mt-2 font-bold whitespace-nowrap ${
                                    isActive ? 'text-slate-900 font-extrabold' : 'text-slate-400'
                                  }`}>
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Items breakdown */}
                        <div className="bg-slate-50 p-4 rounded-none border border-slate-200 space-y-2 text-xs">
                          <span className="font-bold text-slate-800 block mb-1">🛒 تفاصيل السلع المطلوبة بالجملة:</span>
                          <div className="divide-y divide-slate-200">
                            {order.items.map((item, i) => (
                              <div key={i} className="py-2 flex justify-between items-center">
                                <div>
                                  <span className="font-bold text-slate-800">{item.productName}</span>
                                  <span className="text-[10px] text-slate-500 font-medium block">{item.unit} | عدد: {item.quantity}</span>
                                </div>
                                <span className="font-mono text-slate-800 font-bold">{(item.price * item.quantity).toLocaleString()} د.ع</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SIDEBAR: SHOPPING CART PANEL */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-sm border-2 border-slate-900 p-5 space-y-4 sticky top-6">
            <div className="flex justify-between items-center pb-3 border-b-2 border-slate-900">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <ShoppingBag className="w-4.5 h-4.5 text-emerald-600" /> سلة طلب الشراء
              </h3>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded-none border border-emerald-200 font-mono">
                {cartItemCount} سلع
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30 text-slate-400" />
                <p className="text-xs">سلة الشراء فارغة حالياً. تصفح الأقسام وأضف المواد لمتجرك.</p>
              </div>
            ) : (
              <>
                {/* Cart list scroll block */}
                <div className="max-h-72 overflow-y-auto space-y-3 divide-y divide-slate-200 pr-1">
                  {cart.map((item, idx) => (
                    <div key={item.product.id} className={`pt-3 flex gap-3 justify-between items-start ${idx === 0 ? 'pt-0' : ''}`}>
                      <div className="flex-1">
                        <span className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">{item.product.name}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{item.product.unit}</span>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => onUpdateCartQty(item.product.id, item.quantity - 1)}
                            className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-none border border-slate-300 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-extrabold text-slate-900 font-mono w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateCartQty(item.product.id, item.quantity + 1)}
                            className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-none border border-slate-300 cursor-pointer"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-left flex flex-col justify-between items-end h-full min-h-[50px]">
                        <button
                          onClick={() => onRemoveFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-xs font-bold text-slate-900 mt-2">
                          {(item.product.price * item.quantity).toLocaleString()} د.ع
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total invoice block */}
                <div className="border-t-2 border-slate-900 pt-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">تكلفة السلع الكلية بالجملة:</span>
                    <span className="font-mono font-bold text-slate-900">{cartTotal.toLocaleString()} د.ع</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">شحن وتوصيل مباشر للمحل:</span>
                    <span className="text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-none">مجاني لطلبك الأول!</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                    <span className="font-extrabold text-slate-900 text-sm">مجموع الحساب الصافي:</span>
                    <span className="font-mono font-extrabold text-base text-emerald-600">{cartTotal.toLocaleString()} د.ع</span>
                  </div>

                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-none border border-emerald-800 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <span>تأكيد طلب الشراء بالجملة</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CHECKOUT INFORMATION MODAL */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-none w-full max-w-lg border-2 border-slate-950 overflow-hidden text-right shadow-none"
            >
              <div className="p-6 border-b-2 border-slate-950 flex justify-between items-center bg-slate-50">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Store className="w-5 h-5 text-emerald-600" /> كود تأكيد الفاتورة ومعلومات المحل للتوصيل
                </h3>
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="text-slate-400 hover:text-slate-900 text-xl cursor-pointer font-bold"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  الرجاء كتابة تفاصيل السوبرماركت الخاص بك حتى نتمكن من شحن طلبية الجملة هذه إليك وتوصيل كشف الفاتورة المكتوب باسمك.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1 justify-end">
                    <span>اسم السوبرماركت / البقالة</span> <Store className="w-3.5 h-3.5 text-slate-400" />
                  </label>
                  <input
                    type="text"
                    required
                    value={supermarketName}
                    onChange={e => setSupermarketName(e.target.value)}
                    placeholder="مثال: سوبرماركت الأنوار الغذائي"
                    className="w-full px-4 py-2 text-xs border-2 border-slate-300 rounded-none focus:outline-none focus:border-slate-900 text-right bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1 justify-end">
                      <span>اسم صاحب المحل للتوقيع</span> <User className="w-3.5 h-3.5 text-slate-400" />
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={e => setOwnerName(e.target.value)}
                      placeholder="مثال: أبو علي الأسدي"
                      className="w-full px-4 py-2 text-xs border-2 border-slate-300 rounded-none focus:outline-none focus:border-slate-900 text-right bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1 justify-end">
                      <span>رقم الموبايل للتواصل</span> <Phone className="w-3.5 h-3.5 text-slate-400" />
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="مثال: 0770XXXXXXX"
                      className="w-full px-4 py-2 text-xs border-2 border-slate-300 rounded-none focus:outline-none focus:border-slate-900 text-left font-mono bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1 justify-end">
                    <span>عنوان السوبرماركت للتوصيل والموقع</span> <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="مثال: بغداد، الكرادة، قرب ساحة التحريات"
                    className="w-full px-4 py-2 text-xs border-2 border-slate-300 rounded-none focus:outline-none focus:border-slate-900 text-right bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1 justify-end">
                    <span>ملاحظات لسائق التوصيل (اختياري)</span> <FileText className="w-3.5 h-3.5 text-slate-400" />
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="مثال: يرجى التوصيل بعد الساعة 3 عصراً، أو الاتصال قبل الوصول بـ 15 دقيقة..."
                    rows={2}
                    className="w-full px-4 py-2 text-xs border-2 border-slate-300 rounded-none focus:outline-none focus:border-slate-900 text-right resize-none bg-white"
                  />
                </div>

                <div className="pt-4 border-t-2 border-slate-950 flex justify-between items-baseline bg-slate-50 -mx-6 -mb-6 p-6">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-bold">إجمالي الدفع عند الاستلام</span>
                    <span className="text-base font-extrabold text-emerald-600 font-mono">{cartTotal.toLocaleString()} د.ع</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCheckoutOpen(false)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-none border border-slate-300 cursor-pointer transition-colors"
                    >
                      تعديل السلة
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-none border border-emerald-700 cursor-pointer transition-colors"
                    >
                      إرسال الطلب الآن
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ORDER SUCCESS DIALOG */}
      <AnimatePresence>
        {isOrderSuccess && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-none w-full max-w-md p-6 border-2 border-slate-950 text-center shadow-none"
            >
              <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-400 rounded-none flex items-center justify-center text-emerald-600 mx-auto mb-4 scale-110">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">تم استلام طلب الشراء بنجاح! 🎉</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                أهلاً بك يا <strong>{ownerName}</strong>، لقد تم إرسال طلبيتك وتوجيه الفاتورة إلى المورّد صاحب الجملة. ستصلك شحنتك المخصصة لمحلك <strong>"{supermarketName}"</strong> في أسرع وقت.
              </p>

              {lastPlacedOrderId && (
                <div className="bg-slate-50 border border-slate-200 rounded-none p-3 mb-6 text-xs text-slate-600 font-mono flex justify-between items-center px-4">
                  <span>رقم الطلبية والمتابعة:</span>
                  <span className="font-bold text-emerald-600">#{lastPlacedOrderId.slice(0, 8)}</span>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setIsOrderSuccess(false);
                    setActiveTab('my-orders');
                  }}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-none border border-slate-950 cursor-pointer transition-colors"
                >
                  عرض فواتيري السابقة
                </button>
                <button
                  onClick={() => setIsOrderSuccess(false)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-none border border-slate-300 cursor-pointer transition-colors"
                >
                  العودة للمتجر
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
