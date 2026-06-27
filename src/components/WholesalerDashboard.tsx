import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit2, Trash2, Package, ShoppingBag, DollarSign, AlertTriangle, 
  CheckCircle2, XCircle, Clock, Eye, ChevronDown, ChevronUp, Tag, Layers, RefreshCw
} from 'lucide-react';
import { Product, Order, OrderStatus, Category } from '../types';

interface WholesalerDashboardProps {
  products: Product[];
  orders: Order[];
  categories: { id: string; name: string }[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAddCategory: (name: string) => void;
}

export default function WholesalerDashboard({
  products,
  orders,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onAddCategory
}: WholesalerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'categories'>('products');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Product Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'الغذائية',
    price: 0,
    retailPrice: 0,
    unit: 'كرتونة',
    stock: 100,
    code: '',
    description: ''
  });

  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Expanded Order State
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Stats Calculations
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
  const lowStockProducts = products.filter(p => p.stock <= 10).length;

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (product.code && product.code.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 animate-pulse" /> قيد الانتظار
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> قيد التحضير
          </span>
        );
      case 'shipping':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200">
            <Package className="w-3.5 h-3.5" /> قيد التوصيل
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> مكتمل ومسلم
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> ملغي
          </span>
        );
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || newProduct.price <= 0) return;

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        retailPrice: newProduct.retailPrice ? Number(newProduct.retailPrice) : undefined,
        unit: newProduct.unit,
        stock: Number(newProduct.stock),
        code: newProduct.code,
        description: newProduct.description
      });
      setEditingProduct(null);
    } else {
      onAddProduct({
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        retailPrice: newProduct.retailPrice ? Number(newProduct.retailPrice) : undefined,
        unit: newProduct.unit,
        stock: Number(newProduct.stock),
        code: newProduct.code || 'PRD-' + Math.floor(Math.random() * 10000),
        description: newProduct.description
      });
    }

    // Reset Form
    setNewProduct({
      name: '',
      category: 'الغذائية',
      price: 0,
      retailPrice: 0,
      unit: 'كرتونة',
      stock: 100,
      code: '',
      description: ''
    });
    setIsAddingProduct(false);
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      retailPrice: product.retailPrice || 0,
      unit: product.unit,
      stock: product.stock,
      code: product.code || '',
      description: product.description || ''
    });
    setIsAddingProduct(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    onAddCategory(newCategoryName.trim());
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  return (
    <div className="w-full text-right" dir="rtl">
      {/* Wholesaler Hero Banner */}
      <div className="mb-8 rounded-sm bg-slate-900 border-2 border-slate-950 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 rounded-none mix-blend-multiply filter blur-3xl opacity-10 -translate-x-10 -translate-y-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-2.5 py-1 rounded-none font-bold">لوحة المورّد والتاجر</span>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">مكتب تجارة الجملة الغذائية</h1>
            </div>
            <p className="text-slate-300 text-xs md:text-sm max-w-xl font-medium">مرحباً بك مجدداً. يمكنك التحكم في مخزونك وأسعارك والاطلاع على طلبات أصحاب السوبرماركت الواردة وتحديث حالات التوصيل بكل سهولة.</p>
          </div>
          <button 
            onClick={() => {
              setEditingProduct(null);
              setNewProduct({
                name: '',
                category: 'الغذائية',
                price: 0,
                retailPrice: 0,
                unit: 'كرتونة',
                stock: 100,
                code: '',
                description: ''
              });
              setIsAddingProduct(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-4 py-2.5 rounded-sm border border-indigo-700 transition-all cursor-pointer shadow-none"
          >
            <Plus className="w-4 h-4" /> إضافة منتج جديد
          </button>
        </div>
      </div>

      {/* Stats Summary Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-sm border-2 border-slate-200 flex items-center justify-between shadow-none">
          <div>
            <span className="text-slate-500 text-xs block mb-1 font-bold">إجمالي المبيعات المكتملة</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">{(totalRevenue).toLocaleString()} <span className="text-xs font-sans text-slate-500 font-medium">د.ع</span></span>
          </div>
          <div className="w-10 h-10 rounded-none border border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border-2 border-slate-200 flex items-center justify-between shadow-none">
          <div>
            <span className="text-slate-500 text-xs block mb-1 font-bold">الطلبات قيد المعالجة</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">{pendingOrdersCount} <span className="text-xs font-sans text-slate-500 font-medium">طلب</span></span>
          </div>
          <div className="w-10 h-10 rounded-none border border-amber-200 bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border-2 border-slate-200 flex items-center justify-between shadow-none">
          <div>
            <span className="text-slate-500 text-xs block mb-1 font-bold">المنتجات المعروضة للبيع</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">{products.length} <span className="text-xs font-sans text-slate-500 font-medium">صنف</span></span>
          </div>
          <div className="w-10 h-10 rounded-none border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 font-bold">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border-2 border-slate-200 flex items-center justify-between shadow-none">
          <div>
            <span className="text-slate-500 text-xs block mb-1 font-bold">منتجات أوشكت على النفاد</span>
            <span className={`text-xl font-extrabold font-mono ${lowStockProducts > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {lowStockProducts} <span className="text-xs font-sans text-slate-500 font-medium">أصناف</span>
            </span>
          </div>
          <div className={`w-10 h-10 rounded-none border flex items-center justify-center font-bold ${lowStockProducts > 0 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="border-b-2 border-slate-200 mb-6 flex gap-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 font-extrabold text-sm transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'products' 
              ? 'border-b-2 border-indigo-600 text-indigo-600' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Package className="w-4 h-4" /> إدارة المنتجات والأسعار
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 font-extrabold text-sm transition-all flex items-center gap-2 relative cursor-pointer ${
            activeTab === 'orders' 
              ? 'border-b-2 border-indigo-600 text-indigo-600' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> الطلبات الواردة من السوبرماركت
          {pendingOrdersCount > 0 && (
            <span className="absolute -top-1.5 -left-3 bg-rose-500 text-white text-[10px] w-4.5 h-4.5 rounded-none flex items-center justify-center font-mono font-bold">
              {pendingOrdersCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 font-extrabold text-sm transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'categories' 
              ? 'border-b-2 border-indigo-600 text-indigo-600' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Layers className="w-4 h-4" /> إدارة الأقسام والـخانات
        </button>
      </div>

      {/* Add / Edit Product Panel Overlay */}
      <AnimatePresence>
        {isAddingProduct && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-none w-full max-w-xl shadow-none border-2 border-slate-950 overflow-hidden text-right max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b-2 border-slate-950 flex justify-between items-center bg-slate-50">
                <h3 className="text-base font-extrabold text-slate-900 font-sans">
                  {editingProduct ? `تعديل منتج: ${editingProduct.name}` : 'إضافة صنف جديد لقائمة المبيعات'}
                </h3>
                <button 
                  onClick={() => setIsAddingProduct(false)}
                  className="text-slate-500 hover:text-slate-900 text-2xl font-bold cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">اسم المنتج بالجملة <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="مثال: كرتونة حليب كالم دير كامل الدسم"
                    className="w-full px-4 py-2 text-xs border-2 border-slate-200 rounded-none focus:outline-none focus:border-slate-900 focus:bg-slate-50 text-right font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">الفئة / الخانة <span className="text-rose-500">*</span></label>
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-4 py-2 text-xs border-2 border-slate-200 rounded-none bg-white focus:outline-none focus:border-slate-900 text-right font-medium"
                    >
                      {categories.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">الوحدة للبيع بالجملة <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={newProduct.unit}
                      onChange={e => setNewProduct({...newProduct, unit: e.target.value})}
                      placeholder="مثال: كرتونة (12 علبة)"
                      className="w-full px-4 py-2 text-xs border-2 border-slate-200 rounded-none focus:outline-none focus:border-slate-900 text-right font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">سعر الجملة (د.ع) <span className="text-rose-500">*</span></label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProduct.price || ''}
                      onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                      placeholder="سعر البيع لأصحاب السوبرماركت"
                      className="w-full px-4 py-2 text-xs border-2 border-slate-200 rounded-none focus:outline-none focus:border-slate-900 font-mono text-right"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">سعر البيع المفرد المقترح (د.ع)</label>
                    <input
                      type="number"
                      min="0"
                      value={newProduct.retailPrice || ''}
                      onChange={e => setNewProduct({...newProduct, retailPrice: Number(e.target.value)})}
                      placeholder="السعر المقترح للمستهلك النهائي"
                      className="w-full px-4 py-2 text-xs border-2 border-slate-200 rounded-none focus:outline-none focus:border-slate-900 font-mono text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">الكمية المتوفرة بالمخزن <span className="text-rose-500">*</span></label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProduct.stock}
                      onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                      placeholder="العدد المتوفر حالياً للجملة"
                      className="w-full px-4 py-2 text-xs border-2 border-slate-200 rounded-none focus:outline-none focus:border-slate-900 font-mono text-right"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">رمز المنتج / الباركود</label>
                    <input
                      type="text"
                      value={newProduct.code}
                      onChange={e => setNewProduct({...newProduct, code: e.target.value})}
                      placeholder="مثال: WH-1049"
                      className="w-full px-4 py-2 text-xs border-2 border-slate-200 rounded-none focus:outline-none focus:border-slate-900 text-left font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">وصف المنتج (اختياري)</label>
                  <textarea
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="اكتب تفاصيل أكثر حول الوزن، بلد المنشأ، أو جودة المنتج..."
                    rows={3}
                    className="w-full px-4 py-2 text-xs border-2 border-slate-200 rounded-none focus:outline-none focus:border-slate-900 text-right resize-none font-medium"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t-2 border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddingProduct(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-none border border-slate-300 cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-none border border-slate-950 flex items-center gap-1 cursor-pointer"
                  >
                    {editingProduct ? 'حفظ التعديلات' : 'إضافة للمتجر'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRODUCTS TAB CONTENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Filtering and search row */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category horizontal scroll */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-none text-xs font-bold whitespace-nowrap transition-all border-2 cursor-pointer ${
                    selectedCategory === cat.id 
                      ? 'bg-slate-900 text-white border-slate-950' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="ابحث باسم المنتج أو الباركود..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 text-xs border-2 border-slate-200 rounded-none focus:outline-none focus:border-slate-900 text-right pr-4 font-bold"
              />
            </div>
          </div>

          {/* Products Table/List */}
          <div className="bg-white rounded-none border-2 border-slate-950 overflow-hidden shadow-none">
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-500" />
                <p className="text-sm">لم يتم العثور على منتجات تطابق البحث أو التصنيف.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-slate-950 text-slate-800 text-xs font-extrabold">
                      <th className="p-4 font-extrabold">المنتج والرمز</th>
                      <th className="p-4 font-extrabold">القسم / الفئة</th>
                      <th className="p-4 text-left font-extrabold">سعر الجملة (د.ع)</th>
                      <th className="p-4 text-left font-extrabold">سعر المفرد المقترح</th>
                      <th className="p-4 text-center font-extrabold">الوحدة بيع بالجملة</th>
                      <th className="p-4 text-center font-extrabold">المخزون المتوفر</th>
                      <th className="p-4 text-center font-extrabold">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-slate-50 transition-colors text-xs text-slate-700">
                        <td className="p-4 font-bold text-slate-900">
                          <div className="flex flex-col">
                            <span>{product.name}</span>
                            {product.code && <span className="text-[10px] text-slate-400 font-mono pr-0.5 mt-0.5">{product.code}</span>}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none text-xs bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-200">
                            <Tag className="w-3 h-3" /> {product.category}
                          </span>
                        </td>
                        <td className="p-4 text-left font-mono font-extrabold text-indigo-600">
                          {product.price.toLocaleString()} د.ع
                        </td>
                        <td className="p-4 text-left font-mono text-slate-500">
                          {product.retailPrice ? `${product.retailPrice.toLocaleString()} د.ع` : '-'}
                        </td>
                        <td className="p-4 text-center bg-slate-50/30">
                          <span className="text-slate-700 font-bold">{product.unit}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1 font-extrabold ${product.stock <= 10 ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                            {product.stock} {product.stock <= 10 && <span className="text-[10px] bg-rose-50 text-rose-800 px-1.5 py-0.5 rounded-none border border-rose-200">نفذ تقريباً!</span>}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => startEditProduct(product)}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-none border border-slate-200 transition-colors cursor-pointer"
                              title="تعديل المنتج"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`هل أنت متأكد من حذف المنتج: ${product.name}؟`)) {
                                  onDeleteProduct(product.id);
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-none border border-slate-200 transition-colors cursor-pointer"
                              title="حذف المنتج"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ORDERS TAB CONTENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700">سجل طلبات الشراء الواردة من السوبرماركت</h3>
            <span className="text-xs text-slate-400 font-mono">إجمالي الطلبات: {orders.length}</span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-none border-2 border-slate-200 p-12 text-center text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">لا توجد أي طلبات شراء واردة حتى الآن.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const isExpanded = expandedOrderId === order.id;
                return (
                  <div 
                    key={order.id} 
                    className="bg-white rounded-none border-2 border-slate-950 shadow-none overflow-hidden transition-all"
                  >
                    {/* Header line of Order block */}
                    <div 
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900">{order.supermarketName}</span>
                            <span className="text-xs text-slate-400 font-mono font-bold">#{order.id.slice(0, 8)}</span>
                          </div>
                          <span className="text-xs text-slate-500 block mt-1 font-medium">المالك: {order.ownerName} | هاتف: <span className="font-mono">{order.phone}</span></span>
                        </div>
                        <div className="h-6 w-px bg-slate-300 hidden md:block"></div>
                        <div className="text-xs text-slate-500 font-medium">
                          <span>التاريخ: {new Date(order.date).toLocaleDateString('ar-EG')} - {new Date(order.date).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block font-bold">إجمالي الفاتورة</span>
                          <span className="text-sm font-extrabold text-indigo-600 font-mono">{(order.totalPrice).toLocaleString()} د.ع</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(order.status)}
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Invoice Body (Expanded) */}
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="border-t-2 border-slate-950 bg-slate-50 p-5 space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                          <div className="bg-white p-4 rounded-none border-2 border-slate-200">
                            <span className="font-bold text-slate-800 block mb-2">📍 معلومات التوصيل والشحن:</span>
                            <p className="mb-1 font-medium"><span className="text-slate-400 font-bold">العنوان:</span> {order.address}</p>
                            <p className="font-medium"><span className="text-slate-400 font-bold">ملاحظات الطلب:</span> {order.notes || 'لا توجد ملاحظات إضافية'}</p>
                          </div>

                          <div className="bg-white p-4 rounded-none border-2 border-slate-200 flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-slate-800 block mb-2">⚙️ التحكم في حالة الطلب:</span>
                              <p className="text-slate-500 mb-2 text-[11px] font-medium">قم بتغيير حالة الطلب لإعلام صاحب السوبرماركت بتقدم شحن منتجاته.</p>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {(['pending', 'preparing', 'shipping', 'completed', 'cancelled'] as OrderStatus[]).map(st => {
                                const names: Record<OrderStatus, string> = {
                                  pending: 'قيد الانتظار',
                                  preparing: 'تجهيز الشحنة',
                                  shipping: 'جاري التوصيل',
                                  completed: 'اكتمل وتسلم',
                                  cancelled: 'إلغاء الطلب'
                                };
                                return (
                                  <button
                                    key={st}
                                    onClick={() => onUpdateOrderStatus(order.id, st)}
                                    className={`px-2.5 py-1 rounded-none text-[10px] font-bold transition-all cursor-pointer ${
                                      order.status === st
                                        ? 'bg-slate-900 text-white border border-slate-950'
                                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                                    }`}
                                  >
                                    {names[st]}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Order Items Table */}
                        <div className="bg-white rounded-none border-2 border-slate-200 overflow-hidden">
                          <table className="w-full text-right border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-100 text-slate-700 font-bold border-b-2 border-slate-200">
                                <th className="p-3 font-bold">المنتج والمواصفات</th>
                                <th className="p-3 text-center font-bold">الوحدة المستلمة</th>
                                <th className="p-3 text-center font-bold">الكمية المطلوبة</th>
                                <th className="p-3 text-left font-bold">سعر الوحدة بالجملة</th>
                                <th className="p-3 text-left font-bold">المجموع الفرعي</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-slate-700">
                              {order.items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="p-3 font-bold text-slate-900">{item.productName}</td>
                                  <td className="p-3 text-center text-slate-500 font-medium">{item.unit}</td>
                                  <td className="p-3 text-center font-mono font-bold text-slate-900">{item.quantity}</td>
                                  <td className="p-3 text-left font-mono text-slate-500">{item.price.toLocaleString()} د.ع</td>
                                  <td className="p-3 text-left font-mono font-bold text-slate-900">{(item.price * item.quantity).toLocaleString()} د.ع</td>
                                </tr>
                              ))}
                              <tr className="bg-slate-100 font-bold text-slate-900">
                                <td colSpan={3} className="p-3 text-left font-extrabold">إجمالي قيمة الفاتورة شاملة الشحن والتسليم:</td>
                                <td colSpan={2} className="p-3 text-left text-indigo-600 font-mono text-sm font-extrabold">{(order.totalPrice).toLocaleString()} د.ع</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CATEGORIES TAB CONTENT */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-none border-2 border-slate-950 shadow-none space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 font-sans">
              <Layers className="w-4 h-4 text-indigo-600" /> خانات وتصنيفات المنتجات الحالية
            </h3>
            <p className="text-xs text-slate-500 font-medium">تساعدك الخانات على تقسيم منتجاتك ليسهل على صاحب السوبرماركت الوصول إليها وطلبها بسرعة.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.filter(c => c.id !== 'all').map((cat, idx) => {
                const count = products.filter(p => p.category === cat.name).length;
                return (
                  <div key={cat.id} className="p-4 rounded-none border-2 border-slate-200 hover:border-slate-900 transition-all bg-slate-50 flex flex-col justify-between shadow-none">
                    <span className="font-extrabold text-slate-900 text-sm">{cat.name}</span>
                    <span className="text-[11px] text-slate-500 mt-2 font-mono font-bold block">يحتوي على: {count} أصناف</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-none border-2 border-slate-950 shadow-none flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-2 font-sans">إضافة تصنيف / خانة جديدة</h3>
              <p className="text-xs text-slate-500 mb-4 font-medium">إنشاء خانة جديدة لكي تظهر تلقائياً في قائمة الفئات والمنتجات للمتجر.</p>

              <form onSubmit={handleCategorySubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-700 font-bold">اسم الخانة الجديدة</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: بهارات ومكسرات، معلبات..."
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    className="w-full px-4 py-2 text-xs border-2 border-slate-200 rounded-none focus:outline-none focus:border-slate-900 text-right font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-none border border-slate-950 cursor-pointer transition-colors"
                >
                  إضافة الفئة
                </button>
              </form>
            </div>
            <div className="mt-6 pt-4 border-t-2 border-slate-100 text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <span>💡 يمكنك إضافة أي أقسام جديدة مثل "مجمدات"، "منظفات"، إلخ.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
