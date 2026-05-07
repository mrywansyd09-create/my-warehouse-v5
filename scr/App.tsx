/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation,
  useNavigate,
  useSearchParams,
  useParams
} from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  LayoutDashboard, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Search, 
  Plus, 
  Minus,
  FileText, 
  Settings,
  Menu,
  X,
  Box,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Filter,
  Camera,
  Image as ImageIcon,
  Loader2,
  ChevronDown,
  Clock,
  User,
  UserPlus,
  Eye,
  EyeOff,
  Edit3,
  XCircle,
  Check,
  Save,
  Trash2,
  ExternalLink as LinkIcon,
  PieChart as PieChartIcon,
  MapPin,
  Snowflake,
  Refrigerator,
  Flame,
  Wind,
  Armchair,
  Tv,
  Laptop,
  Waves,
  Monitor,
  UtensilsCrossed,
  Coffee,
  Smartphone,
  Smartphone as Phone,
  Mic,
  MicOff,
  Calendar,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Activity,
  History,
  Store,
  Mail,
  Key,
  Lock,
  LogOut,
  Database,
  Download,
  Upload,
  ShieldCheck,
  Bell,
  Filter as FilterIcon,
  ChefHat,
  Droplets,
  ShoppingBag,
  DollarSign,
  Home,
  Fan,
  Zap,
  Wind as AirIcon,
  Speaker,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { MOCK_PRODUCTS, Product, DamagedItem, SparePart } from './data';
import { auth, googleProvider } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';

// --- Constants ---

import { GoogleGenAI, Type } from "@google/genai";

const PRODUCT_COLORS = [
  { id: 'black', name: 'ڕەش', hex: '#1a1a1a', shadow: 'shadow-black/20' },
  { id: 'silver', name: 'زیوی', hex: '#c0c0c0', shadow: 'shadow-slate-300/40' },
  { id: 'white', name: 'سپی', hex: '#ffffff', shadow: 'shadow-slate-200/40', border: 'border-slate-200' },
  { id: 'gold', name: 'زێڕی', hex: '#d4af37', shadow: 'shadow-yellow-600/20' },
  { id: 'blue', name: 'شین', hex: '#2563eb', shadow: 'shadow-blue-600/20' },
  { id: 'red', name: 'سوور', hex: '#dc2626', shadow: 'shadow-red-600/20' },
  { id: 'steel', name: 'ستیل', hex: '#4a5568', shadow: 'shadow-slate-600/20' },
];

const PRODUCT_ICONS = [
  { id: 'fridge', name: 'ثلاجة', icon: Refrigerator },
  { id: 'freezer', name: 'مجمدة', icon: Snowflake },
  { id: 'stove', name: 'طباخ', icon: ChefHat },
  { id: 'water_cooler', name: 'براد ماء', icon: Droplets },
  { id: 'display_fridge', name: 'تلاجة\\عارضة', icon: ShoppingBag },
  { id: 'display_freezer', name: 'مجمدة\\عارضة', icon: Box },
  { id: 'water_filter', name: 'فلتر ماء', icon: Filter },
  { id: 'ac', name: 'مكيف', icon: AirIcon },
  { id: 'washing', name: 'غسالة', icon: Waves },
  { id: 'dishwasher', name: 'غسالة مواعين', icon: UtensilsCrossed },
  { id: 'washing_manual', name: 'غسالة عادي', icon: Waves },
  { id: 'split', name: 'سبلت', icon: Wind },
  { id: 'cooler', name: 'موبریده', icon: Wind },
  { id: 'fan', name: 'مروحة', icon: Fan },
  { id: 'iron', name: 'مكوة', icon: Zap },
  { id: 'oven', name: 'فرن', icon: ChefHat },
  { id: 'vacuum', name: 'مكناسة', icon: Wind },
  { id: 'blender', name: 'خلاط', icon: Zap },
  { id: 'grinder', name: 'مثرمه', icon: Zap },
  { id: 'juicer', name: 'عصارة', icon: Droplets },
  { id: 'fryer', name: 'قلاية', icon: Flame },
  { id: 'sofa', name: 'قەنەفە', icon: Armchair },
  { id: 'bedroom', name: 'ژووری نووستن', icon: Home },
  { id: 'carpet_item', name: 'فەرش', icon: ShoppingBag },
  { id: 'default', name: 'گشتی', icon: Package },
];

const ELECTRIC_SUB_CATEGORIES = [
  { id: 'fridge', name: 'ثلاجة' },
  { id: 'freezer', name: 'مجمدة' },
  { id: 'stove', name: 'طباخ' },
  { id: 'water_cooler', name: 'براد ماء' },
  { id: 'display_fridge', name: 'تلاجة\\عارضة' },
  { id: 'display_freezer', name: 'مجمدة\\عارضة' },
  { id: 'water_filter', name: 'فلتر ماء' },
  { id: 'ac', name: 'مكيف' },
  { id: 'washing', name: 'غسالة' },
  { id: 'dishwasher', name: 'غسالة مواعين' },
  { id: 'washing_manual', name: 'غسالة عادي' },
  { id: 'split', name: 'سبلت' },
  { id: 'cooler', name: 'موبريده' },
  { id: 'fan', name: 'مروحة' },
  { id: 'iron', name: 'مكوة' },
  { id: 'oven', name: 'فرن' },
  { id: 'vacuum', name: 'مكناسة' },
  { id: 'blender', name: 'خلاط' },
  { id: 'grinder', name: 'مثرمه' },
  { id: 'juicer', name: 'عصارة' },
  { id: 'fryer', name: 'قلاية' },
];

const FURNITURE_SUB_CATEGORIES = [
  { id: 'sofa', name: 'قەنەفە' },
  { id: 'bedroom', name: 'ژووری نووستن' },
  { id: 'dining', name: 'مێزی نانخواردن' },
  { id: 'office', name: 'ئۆفیس' },
];

const CARPET_SUB_CATEGORIES = [
  { id: 'turkish', name: 'فەرشی تورکی' },
  { id: 'iranian', name: 'فەرشی ئێرانی' },
  { id: 'modern', name: 'مۆدێرن' },
];

const CATEGORIES = [
  { id: 'electric', name: 'کارەبایی', icon: Flame, subItems: ELECTRIC_SUB_CATEGORIES },
  { id: 'furniture', name: 'موبلیات', icon: Armchair, subItems: FURNITURE_SUB_CATEGORIES },
  { id: 'carpet', name: 'فەرش', icon: ShoppingBag, subItems: CARPET_SUB_CATEGORIES },
];

const CATEGORIES_PLACEHOLDER = []; // Reserved for future use if needed

// --- Components ---

const ImageLightbox = ({ src, onClose }: { src: string, onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
    >
      <motion.button
        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[111] bg-white/10 p-2 rounded-full backdrop-blur-md"
        onClick={onClose}
      >
        <X size={24} />
      </motion.button>
      <motion.img 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        src={src} 
        alt="Full Preview" 
        className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain border border-white/10"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
};

const ProductEditModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onSave,
  onDelete,
  allColors,
  onAddCustomColor,
  onDeleteColor,
  onReportDamaged
}: { 
  product: Product | null, 
  isOpen: boolean, 
  onClose: () => void,
  onSave: (updatedProduct: Product) => void,
  onDelete: (id: string) => void,
  allColors: any[],
  onAddCustomColor: (color: any) => void,
  onDeleteColor: (id: string) => void,
  onReportDamaged: (id: string) => void
}) => {
  const [formData, setFormData] = useState<Product | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [isIconDropdownOpen, setIsIconDropdownOpen] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [showSmartColorInput, setShowSmartColorInput] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [smartColorQuery, setSmartColorQuery] = useState('');

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const handleSmartColorSearch = async () => {
    if (!smartColorQuery || isAiProcessing) return;
    setIsAiProcessing(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            { text: `Identify the color based on this name: "${smartColorQuery}". It could be in Kurdish, English or Arabic. Return a JSON object with 'hex' (accurate hex code) and 'name' (a short, professional Kurdish name for this color). Make it a high-quality version of that color.` }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hex: { type: Type.STRING },
              name: { type: Type.STRING }
            },
            required: ["hex", "name"]
          }
        }
      });
      
      const result = JSON.parse(response.text);
      if (result.hex && result.name) {
        const newColor = {
          id: `smart-${Date.now()}`,
          name: result.name,
          hex: result.hex,
          shadow: `shadow-[${result.hex}]/20`,
          border: 'border-slate-100'
        };
        onAddCustomColor(newColor);
        setFormData(prev => prev ? { ...prev, color: result.name } : null);
        setShowSmartColorInput(false);
        setSmartColorQuery('');
      }
    } catch (error) {
      console.error("Smart Color Error:", error);
    } finally {
      setIsAiProcessing(false);
    }
  };

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
      setIsConfirmingDelete(false);
    }
  }, [product]);

  if (!isOpen || !formData) return null;

  const handleSave = () => {
    if (formData) {
      const now = new Date();
      const preciseTime = now.toLocaleTimeString('ku-IQ', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      });
      const preciseDate = now.toLocaleDateString('ku-IQ');
      
      onSave({
        ...formData,
        lastUpdated: `${preciseDate} | ${preciseTime}`,
        updatedBy: 'مەریوان'
      });
    }
  };

  const handleDelete = () => {
    if (isConfirmingDelete) {
      onDelete(formData.id);
      onClose();
    } else {
      setIsConfirmingDelete(true);
      setTimeout(() => setIsConfirmingDelete(false), 3000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 max-h-[92vh] flex flex-col"
        >
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-20 py-4 -mx-2 px-2 border-b border-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">ڕێکخستنی کاڵا</h3>
                <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-widest">دەستکاری زانیارییەکان بکە</p>
              </div>
              <div className="flex items-center gap-1">
                {formData.stock > 0 && (
                  <button 
                    onClick={() => {
                      onReportDamaged(formData.id);
                      onClose();
                    }}
                    title="تۆمارکردن وەک شکاو"
                    className="p-2.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all border border-orange-100"
                  >
                    <AlertTriangle size={18} />
                  </button>
                )}
                <button 
                  onClick={handleDelete}
                  className={cn(
                    "p-2.5 rounded-xl transition-all",
                    isConfirmingDelete ? "bg-red-500 text-white shadow-lg shadow-red-100 animate-pulse" : "text-slate-400 hover:bg-red-50 hover:text-red-500"
                  )}
                  title="سڕینەوە"
                >
                  <Trash2 size={18} />
                </button>
                <button 
                  onClick={handleSave}
                  className="p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                  title="پاشەکەوتکردن"
                >
                  <Save size={18} />
                </button>
                <div className="w-px h-4 bg-slate-100 mx-1" />
                <button 
                  onClick={onClose}
                  className="p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all"
                  title="داخستن"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Photo Section - Smaller and moved down slightly in visual weight */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  {formData.imageUri ? (
                    <div className="relative shrink-0">
                      <img 
                        src={formData.imageUri} 
                        className="w-24 h-16 object-cover rounded-xl border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform"
                        alt="Product"
                        onClick={() => setShowLightbox(true)}
                      />
                      <button 
                        onClick={() => setFormData({ ...formData, imageUri: '' })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 shadow-inner">
                      <ImageIcon size={22} />
                    </div>
                  )}
                  
                  <div className="flex-1 flex gap-2">
                    <label className="cursor-pointer group flex-1">
                      <div className="h-10 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center justify-center text-xs font-bold gap-2 transition-all hover:border-blue-300 hover:text-blue-600">
                        <Camera size={14} />
                        <span>کامێرا</span>
                      </div>
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, imageUri: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>

                    <label className="cursor-pointer group flex-1">
                      <div className="h-10 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center justify-center text-xs font-bold gap-2 transition-all hover:border-blue-300 hover:text-blue-600">
                        <ImageIcon size={14} />
                        <span>گالێری</span>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, imageUri: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">ناوی کاڵا</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    placeholder="ناوی کاڵا لێرە بنووسە..."
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-800 text-[10px]"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">پۆڵین (Category)</label>
                  <div className="relative">
                    <button
                      onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 flex items-center justify-between transition-all hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        {(() => {
                          const catObj = CATEGORIES.find(c => c.name === formData.category);
                          const CatIcon = catObj?.icon || Package;
                          return <CatIcon size={12} className="text-blue-500" />;
                        })()}
                        <span className="text-[10px] font-bold text-slate-700">{formData.category}</span>
                      </div>
                      <ChevronDown size={12} className={cn("text-slate-400 transition-transform", isCatDropdownOpen && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                      {isCatDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setIsCatDropdownOpen(false)} />
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-40 overflow-hidden"
                          >
                            <div className="p-1 max-h-48 overflow-y-auto custom-scrollbar">
                              {CATEGORIES.map((cat) => {
                                const CatIcon = cat.icon;
                                return (
                                  <button
                                    key={cat.id}
                                    onClick={() => {
                                      setFormData({ ...formData, category: cat.name });
                                      setIsCatDropdownOpen(false);
                                    }}
                                    className={cn(
                                      "w-full text-right px-3 py-2 rounded-lg flex items-center gap-2 transition-colors",
                                      formData.category === cat.name ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                                    )}
                                  >
                                    <CatIcon size={12} />
                                    <span className="text-[10px] font-bold">{cat.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">کۆد (SKU)</label>
                    <input 
                      type="text" 
                      value={formData.sku}
                      placeholder="کۆدی بێ هاوتا"
                      onChange={(e) => setFormData({ ...formData, sku: (e.target.value).toUpperCase() })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-[10px] uppercase"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5 px-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">نرخ</label>
                      <div className="flex bg-slate-100 p-0.5 rounded-lg">
                        <button 
                          onClick={() => setFormData({ ...formData, priceCurrency: 'USD' })}
                          className={cn(
                            "text-[8px] font-bold px-2 py-0.5 rounded-md transition-all",
                            formData.priceCurrency === 'USD' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
                          )}
                        >
                          USD
                        </button>
                        <button 
                          onClick={() => setFormData({ ...formData, priceCurrency: 'IQD' })}
                          className={cn(
                            "text-[8px] font-bold px-2 py-0.5 rounded-md transition-all",
                            formData.priceCurrency === 'IQD' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
                          )}
                        >
                          IQD
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-800 text-[10px]"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 pointer-events-none">
                        {formData.priceCurrency === 'IQD' ? 'د.ع' : '$'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">بڕ (Stock)</label>
                <input 
                  type="number" 
                  value={formData.stock || ''}
                  placeholder="0"
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-800 text-[10px]"
                />
              </div>

                <div>
                  <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">ئایکۆن (Icon)</label>
                  <div className="relative">
                    <button
                      onClick={() => setIsIconDropdownOpen(!isIconDropdownOpen)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 flex items-center justify-between transition-all hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        {(() => {
                          const iconObj = PRODUCT_ICONS.find(i => i.id === formData.iconType) || PRODUCT_ICONS.find(i => i.id === 'default');
                          const Icon = iconObj.icon;
                          return <Icon size={12} className="text-blue-500" />;
                        })()}
                        <span className="text-[10px] font-bold text-slate-700">
                          {formData.iconType === 'default' && formData.customIconName 
                            ? formData.customIconName 
                            : (PRODUCT_ICONS.find(i => i.id === formData.iconType)?.name || 'هەڵبژاردنی ئایکۆن')}
                        </span>
                      </div>
                      <ChevronDown size={12} className={cn("text-slate-400 transition-transform", isIconDropdownOpen && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                      {isIconDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setIsIconDropdownOpen(false)} />
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-40 overflow-hidden"
                          >
                            <div className="p-1 max-h-56 overflow-y-auto custom-scrollbar">
                              {PRODUCT_ICONS.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <button
                                    key={item.id}
                                    onClick={() => {
                                      setFormData({ ...formData, iconType: item.id as any });
                                      setIsIconDropdownOpen(false);
                                    }}
                                    className={cn(
                                      "w-full text-right px-3 py-2 rounded-lg flex items-center gap-2 transition-colors",
                                      formData.iconType === item.id ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                                    )}
                                  >
                                    <Icon size={12} />
                                    <span className="text-[10px] font-bold">{item.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {formData.iconType === 'default' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3"
                    >
                      <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">ناوی ئایکۆنی گشتی</label>
                      <input 
                        type="text" 
                        value={formData.customIconName || ''}
                        onChange={(e) => setFormData({ ...formData, customIconName: e.target.value })}
                        placeholder="بۆ نموونە: پەنەکە"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-800 text-[10px]"
                      />
                    </motion.div>
                  )}
                </div>

              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">شوێن (Location)</label>
                <div className="flex gap-2">
                  {['بان', 'مخزن', 'عرض'].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setFormData({ ...formData, location: loc as any })}
                      className={cn(
                        "flex-1 py-2 px-2 rounded-xl font-bold text-[10px] transition-all border",
                        formData.location === loc 
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                          : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duplicate Section Removed */}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">ڕەنگ</label>
                <div className="flex flex-wrap gap-3">
                  {allColors.map((c) => (
                    <div key={c.id} className="relative group/color">
                      <button
                        onClick={() => setFormData({ ...formData, color: c.name })}
                        className={cn(
                          "w-10 h-10 rounded-2xl transition-all border-4 relative",
                          c.border || "border-transparent",
                          formData.color === c.name 
                            ? "scale-125 ring-2 ring-blue-500 ring-offset-2 z-10" 
                            : "hover:scale-110"
                        )}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        <div className={cn("absolute inset-0 rounded-xl", c.id === 'white' ? 'bg-white' : '')} style={{ backgroundColor: c.hex }}>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                          {formData.color === c.name && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className={cn("w-2 h-2 rounded-full", c.id === 'white' ? 'bg-slate-400' : 'bg-white')} />
                            </div>
                          )}
                        </div>
                        <div className={cn("absolute -inset-2 rounded-xl blur-xl opacity-60 -z-10", c.shadow)} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteColor(c.id);
                          if (formData?.color === c.name) {
                            setFormData({ ...formData, color: '' });
                          }
                        }}
                        className="absolute -top-2 -right-2 bg-white text-red-500 w-6 h-6 rounded-full shadow-md transition-all z-20 hover:scale-110 flex items-center justify-center border border-slate-200"
                        title={`لادانی ڕەنگی ${c.name}`}
                      >
                        <X size={12} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Smart Color Input Toggle */}
                  <button
                    onClick={() => setShowSmartColorInput(!showSmartColorInput)}
                    className={cn(
                      "w-10 h-10 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 transition-all hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500",
                      showSmartColorInput && "bg-blue-50 border-blue-300 text-blue-500 ring-2 ring-blue-200"
                    )}
                  >
                    <Sparkles size={16} />
                  </button>

                  <button
                    onClick={() => setFormData({ ...formData, color: '' })}
                    className={cn(
                      "w-10 h-10 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 transition-all",
                      !formData.color && "ring-2 ring-blue-500 ring-offset-2 scale-110"
                    )}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Smart Color Search Popover */}
                <AnimatePresence>
                  {showSmartColorInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4 overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-3 px-1">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                          <Sparkles size={12} className="text-blue-500" />
                          گەڕانی زیرەک بۆ ڕەنگ
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm border border-slate-100 flex-shrink-0">
                          {isAiProcessing ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : (
                            <Sparkles size={20} />
                          )}
                        </div>
                        <div className="flex-1">
                          <input 
                            type="text" 
                            value={smartColorQuery}
                            onChange={(e) => setSmartColorQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSmartColorSearch()}
                            placeholder="بنووسە (بۆ نموونە: شینی تۆخ، ڕەش، سوور...)"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all text-right"
                            autoFocus
                          />
                        </div>
                        <button 
                          onClick={handleSmartColorSearch}
                          disabled={!smartColorQuery || isAiProcessing}
                          className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-blue-200 flex-shrink-0"
                        >
                          {isAiProcessing ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Check size={18} />
                          )}
                        </button>
                      </div>
                      <p className="text-[8px] text-slate-400 text-center uppercase tracking-widest font-bold">زیادکردنی ڕەنگ بە شێوەیەکی زیرەک</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between px-8 shrink-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">کۆتا نوێکردنەوە:</span>
            <span className="text-[10px] text-slate-500 font-mono font-bold">{formData.lastUpdated}</span>
          </div>
          
          <AnimatePresence>
            {showLightbox && formData.imageUri && (
              <ImageLightbox src={formData.imageUri} onClose={() => setShowLightbox(false)} />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Sidebar = ({ isOpen, toggle, user }: { isOpen: boolean, toggle: () => void, user: FirebaseUser | null }) => {
  const location = useLocation();
  const [isKogaExpanded, setIsKogaExpanded] = useState(false);
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
  
  const navItems = [
    { name: 'داشبۆرد', icon: LayoutDashboard, path: '/' },
    { 
      name: 'کۆگا', 
      icon: Package, 
      path: '/inventory',
      hasSubMenu: true,
      subItems: CATEGORIES.map(cat => ({
        name: cat.name,
        path: `/inventory?cat=${encodeURIComponent(cat.name)}`,
        id: cat.id,
        subItems: cat.subItems?.map(sub => ({
          name: sub.name,
          path: `/inventory?cat=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub.name)}`
        }))
      }))
    },
    { name: 'شکاوەکان', icon: XCircle, path: '/damaged' },
    { name: 'ڕاپۆرتەکان', icon: FileText, path: '/reports' },
    { name: 'ڕێکخستن', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggle}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        className={cn(
          "fixed top-0 bottom-0 right-0 w-64 bg-white border-l border-slate-200 z-50 transition-all duration-300 transform lg:translate-x-0 outline-none",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
              K
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 font-sans">کۆگای زیرەک</h1>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              const hasSub = item.hasSubMenu;
              
              if (hasSub) {
                const isKogaItem = item.name === 'کۆگا';
                const expanded = isKogaExpanded;
                
                return (
                  <div key={item.path} className="space-y-1">
                    <div className={cn(
                      "w-full flex items-center rounded-xl transition-all group overflow-hidden",
                      active 
                        ? "bg-blue-50 text-blue-700" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}>
                      <Link 
                        to={item.path}
                        onClick={toggle}
                        className="flex-1 flex items-center gap-3 px-4 py-3"
                      >
                        <item.icon size={20} className={cn(active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                        <span className="font-medium text-sm">{item.name}</span>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsKogaExpanded(!isKogaExpanded);
                        }}
                        className="p-3 hover:bg-slate-100/50 transition-colors border-r border-slate-100"
                      >
                        <motion.div
                          animate={{ rotate: expanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={16} className="text-slate-400" />
                        </motion.div>
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-y-auto max-h-[350px] custom-scrollbar mr-4 border-r-2 border-slate-100 pr-2 space-y-1 pt-1"
                        >
                          {item.subItems?.map((sub: any) => {
                            const isSubActive = location.search.includes(`cat=${encodeURIComponent(sub.name)}`);
                            
                            return (
                              <div key={sub.name} className="space-y-1">
                                {sub.subItems ? (
                                  <div className="space-y-0.5">
                                    <div className={cn(
                                       "flex items-center rounded-lg transition-all overflow-hidden",
                                       isSubActive ? "bg-slate-100 text-blue-600" : "text-slate-500 hover:text-slate-700"
                                    )}>
                                      <Link 
                                        to={sub.path}
                                        onClick={toggle}
                                        className="flex-1 px-4 py-2 text-sm font-medium"
                                      >
                                        {sub.name}
                                      </Link>
                                      <button
                                        onClick={() => setExpandedSubId(expandedSubId === sub.id ? null : sub.id)}
                                        className="p-2 hover:bg-slate-200/50 transition-colors border-r border-slate-50"
                                      >
                                        <ChevronDown 
                                          size={14} 
                                          className={cn("transition-transform duration-200 text-slate-400", expandedSubId === sub.id && "rotate-180")} 
                                        />
                                      </button>
                                    </div>
                                    <AnimatePresence>
                                      {expandedSubId === sub.id && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          className="mr-2 border-r border-slate-100 pr-2 space-y-0.5 overflow-hidden py-1"
                                        >
                                          {sub.subItems.map((nested: any) => (
                                            <Link
                                              key={nested.name}
                                              to={nested.path}
                                              onClick={toggle}
                                              className={cn(
                                                "block px-4 py-1.5 text-[11px] text-slate-500 hover:text-blue-500 transition-colors",
                                                location.search.includes(`sub=${encodeURIComponent(nested.name)}`) && "text-blue-600 font-bold"
                                              )}
                                            >
                                              {nested.name}
                                            </Link>
                                          ))}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                ) : (
                                  <Link 
                                    to={sub.path}
                                    onClick={toggle}
                                    className={cn(
                                      "block px-4 py-1.5 rounded-lg text-sm transition-all",
                                      isSubActive ? "bg-slate-50 text-blue-600 font-bold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-600"
                                    )}
                                  >
                                    {sub.name}
                                  </Link>
                                )}
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && toggle()}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                    active 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon size={20} className={cn(active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-slate-100">
            <div className="bg-slate-900 rounded-xl p-4 text-white text-center">
              <p className="text-xs text-slate-400 mb-1">وەشانی پڕۆ</p>
              <p className="text-sm font-semibold italic text-slate-200">SmartWare v1.2</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

const StatCard = ({ title, value, subValue, icon: Icon, trend }: any) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all h-full"
  >
    <p className="text-slate-500 text-sm mb-2">{title}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
      {trend && (
        <span className={cn(
          "text-xs font-bold px-2 py-1 rounded",
          trend > 0 ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"
        )}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    {subValue && <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wide">{subValue}</p>}
  </motion.div>
);

// --- Pages ---

// --- Pages ---

const ProductListItem = ({ 
  product, 
  onProductEdit, 
  onStockAdjust,
  allColors
}: { 
  product: Product, 
  onProductEdit: (id: string) => void, 
  onStockAdjust: (e: React.MouseEvent, id: string, delta: number) => void,
  allColors: any[],
  key?: string
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const ProductIcon = PRODUCT_ICONS.find(i => i.id === product.iconType)?.icon || Package;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group flex flex-col bg-white border border-slate-100 rounded-2xl transition-all relative overflow-hidden",
        "shadow-[0_8px_30px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1),0_4px_12px_rgba(59,130,246,0.08)]"
      )}
      onClick={toggleExpand}
    >
      {/* Main Row */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col flex-1 min-w-0">
          <h4 className="text-base font-bold text-slate-800 leading-tight mb-1 truncate">{product.name}</h4>
          
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-bold text-slate-400 tracking-tight">
            <span className="font-mono uppercase text-slate-500">{product.sku}</span>
            <div className="w-px h-2 bg-slate-200" />
            <div className="flex items-center gap-1 text-blue-600">
              <span className="text-[10px] opacity-60">{product.priceCurrency === 'IQD' ? 'د.ع' : '$'}</span>
              <span>{product.price.toLocaleString()}</span>
            </div>
            
            {product.location && (
              <>
                <div className="w-px h-2 bg-slate-200" />
                <div className="flex items-center gap-1">
                  <MapPin size={10} className="text-slate-300" />
                  <span className="text-slate-500">{product.location}</span>
                </div>
              </>
            )}



            <div className="w-px h-2 bg-slate-200" />
            <div className="flex items-center justify-center gap-1.5">
              <ProductIcon size={12} className="text-slate-400" />
              {product.iconType === 'default' && product.customIconName && (
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{product.customIconName}</span>
              )}
            </div>

            {product.color && allColors.find(c => c.name === product.color) && (
              <>
                <div className="w-px h-2 bg-slate-200" />
                <div 
                  className="w-6 h-2.5 rounded-[4px] shadow-sm relative overflow-hidden border border-slate-200/50" 
                  style={{ backgroundColor: allColors.find(c => c.name === product.color)?.hex }} 
                />
              </>
            )}
          </div>
        </div>

        {/* Stock Adjust & Controls */}
        <div className="flex items-center gap-4 justify-between sm:justify-end">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest opacity-60">بڕ</span>
              <span className="text-2xl font-black text-blue-600 leading-none">{product.stock}</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100/40 p-1.5 rounded-xl border border-slate-100/50">
              <button 
                onClick={(e) => onStockAdjust(e, product.id, 1)}
                className="w-8 h-8 flex items-center justify-center bg-white text-blue-600 rounded-md shadow-sm border border-slate-100 hover:bg-blue-50 transition-colors"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
              <button 
                onClick={(e) => onStockAdjust(e, product.id, -1)}
                className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 rounded-md shadow-sm border border-slate-100 hover:text-red-500 transition-colors"
              >
                <Minus size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onProductEdit(product.id);
              }}
              className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all border border-slate-200/50"
            >
              <Settings size={18} strokeWidth={2.5} />
            </button>

            <button 
              onClick={toggleExpand}
              className={cn(
                "p-2 rounded-full transition-all flex items-center justify-center",
                isExpanded ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
              )}
            >
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                <ChevronDown size={18} strokeWidth={2.5} />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Curtain */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 border-t border-dashed border-slate-100 bg-slate-50/50">
              {product.imageUri && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-4 group relative w-max mx-auto sm:mx-0"
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowLightbox(true); }}
                    className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl max-w-[120px] transition-transform active:scale-95 block relative group"
                  >
                    <img src={product.imageUri} alt="Product" className="w-full h-auto object-cover" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Search size={22} className="text-white drop-shadow-md" />
                    </div>
                  </button>
                </motion.div>
              )}
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} strokeWidth={2.5} className="text-slate-300" />
                    <span className="text-slate-600">{product.lastUpdated}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User size={12} strokeWidth={2.5} className="text-slate-300" />
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-100/50 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                    {product.updatedBy || 'مەریوان'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showLightbox && product.imageUri && (
          <ImageLightbox src={product.imageUri} onClose={() => setShowLightbox(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ProductIcon = ({ type, customName, size = 20, className = "" }: { type?: string, customName?: string, size?: number, className?: string }) => {
  const iconData = PRODUCT_ICONS.find(i => i.id === type);
  const IconComponent = iconData ? iconData.icon : Package;
  
  if (customName) {
    return <span className={cn("font-bold text-[10px]", className)}>{customName.substring(0, 2)}</span>;
  }
  
  return <IconComponent size={size} className={className} />;
};

const CompactProductListItem = ({ 
  product, 
}: { 
  product: Product, 
  key?: string
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 0, x: 0 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center justify-between p-3 bg-white border border-slate-50 rounded-xl hover:bg-slate-50 transition-all"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
          <ProductIcon type={product.iconType} customName={product.customIconName} size={18} className="text-slate-500" />
        </div>
        <div className="overflow-hidden">
          <h4 className="text-sm font-bold text-slate-800 truncate leading-none">{product.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1 rounded">{product.sku}</span>
            {product.color && (
              <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border border-slate-200" style={{ backgroundColor: product.color }} />
                {product.color}
              </span>
            )}
            {product.lastAction && (
              <span className="text-[9px] text-blue-600 font-black uppercase tracking-tighter bg-blue-50 px-1.5 py-0.5 rounded-full">
                {product.lastAction}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">کۆتا دەستکاری</p>
          <div className="flex items-center justify-end gap-1.5 mt-0.5">
            <User size={10} className="text-blue-500" />
            <span className="text-[10px] font-black text-slate-700">{product.updatedBy || 'مەریوان'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LoginPage = () => {
  const [mode, setMode] = useState<'login' | 'create'>('login');
  const [loading, setLoading] = useState(false);
  const [storeData, setStoreData] = useState({ name: '', email: '', password: '', adminEmail: '' });

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate store creation - In a real app, this would write to Firestore
    setTimeout(() => {
      setLoading(false);
      setMode('login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0502] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Immersive Atmospheric Background - Sped up for better UX */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, 3, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#ff4e00] blur-[120px] opacity-[0.1]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.15, 1, 1.15],
            rotate: [0, -3, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#3b82f6] blur-[150px] opacity-[0.08]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff4e00]/20 to-[#3b82f6]/20 rounded-[40px] blur transition duration-1000"></div>
          
          <div className="relative bg-[#111]/80 backdrop-blur-[60px] border border-white/5 p-8 md:p-12 rounded-[40px] shadow-2xl flex flex-col">
            <div className="flex flex-col items-center text-center mb-8">
              <motion.div 
                layoutId="logo"
                className="w-16 h-16 bg-gradient-to-tr from-[#ff4e00] to-[#ff8c00] rounded-[20px] flex items-center justify-center shadow-[0_0_30px_rgba(255,78,0,0.2)] mb-6"
              >
                <Package size={32} className="text-white" strokeWidth={1.5} />
              </motion.div>

              <h1 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic">
                بایساید <span className="text-[#ff4e00] not-italic">ستۆر</span>
              </h1>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                {mode === 'login' ? 'بەڕێوەبردنی کۆگا' : 'درووستکردنی کۆگا نوێ'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="group relative w-full h-[60px] flex items-center justify-center bg-white rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-4 text-black">
                      {loading ? <Loader2 className="animate-spin" size={20} /> : (
                        <>
                          <svg width="20" height="20" className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          <span className="font-black text-sm uppercase tracking-tight">بەردەوامبە بە گووگڵ</span>
                        </>
                      )}
                    </div>
                  </button>

                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">یان بە هەژماری کۆگا</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>

                  <button
                    onClick={() => setMode('create')}
                    className="w-full h-[60px] border border-white/10 rounded-2xl text-white/50 text-sm font-bold hover:bg-white/5 hover:text-white transition-all"
                  >
                    درووستکردنی کۆگای نوێ
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="create"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleCreateStore}
                  className="space-y-4"
                >
                  <div className="space-y-3" dir="rtl">
                    <div className="mb-4 text-center">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">مۆڵەتی کۆگا (Store ID)</span>
                      <div className="text-[#ff4e00] font-mono text-sm tracking-widest mt-1">
                        {storeData.name ? `BS-${storeData.name.toUpperCase().substring(0, 3)}-${Math.floor(Math.random() * 9000 + 1000)}` : 'BS-XXXX-0000'}
                      </div>
                    </div>
                    <div className="relative group">
                      <Store className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#ff4e00] transition-colors" size={18} />
                      <input 
                        required
                        type="text" 
                        placeholder="ناوی کۆگا"
                        className="w-full bg-white/5 border border-white/10 h-14 pr-12 rounded-2xl text-white text-sm focus:outline-none focus:border-[#ff4e00]/50 focus:bg-white/[0.08] transition-all"
                        value={storeData.name}
                        onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                      />
                    </div>
                    <div className="relative group">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#ff4e00] transition-colors" size={18} />
                      <input 
                        required
                        type="email" 
                        placeholder="ئیمەیڵی تایبەت بە کۆگا"
                        className="w-full bg-white/5 border border-white/10 h-14 pr-12 rounded-2xl text-white text-sm focus:outline-none focus:border-[#ff4e00]/50 focus:bg-white/[0.08] transition-all"
                        value={storeData.email}
                        onChange={(e) => setStoreData({ ...storeData, email: e.target.value })}
                      />
                    </div>
                    <div className="relative group">
                      <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#ff4e00] transition-colors" size={18} />
                      <input 
                        required
                        type="password" 
                        placeholder="وشەی نهێنی کۆگا"
                        className="w-full bg-white/5 border border-white/10 h-14 pr-12 rounded-2xl text-white text-sm focus:outline-none focus:border-[#ff4e00]/50 focus:bg-white/[0.08] transition-all"
                        value={storeData.password}
                        onChange={(e) => setStoreData({ ...storeData, password: e.target.value })}
                      />
                    </div>
                    <div className="relative group">
                      <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input 
                        type="email" 
                        placeholder="ئیمەیڵی ئەدمین (بۆ گەڕانەوە)"
                        className="w-full bg-white/5 border border-white/10 h-14 pr-12 rounded-2xl text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all"
                        value={storeData.adminEmail}
                        onChange={(e) => setStoreData({ ...storeData, adminEmail: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-gradient-to-r from-[#ff4e00] to-[#ff8c00] rounded-2xl text-white font-black uppercase tracking-tighter italic text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'درووستکردنی کۆگا'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] hover:text-white transition-colors"
                  >
                    گەڕانەوە بۆ چوونەژوورەوە
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AccountPage = ({ user }: { user: FirebaseUser }) => {
  const navigate = useNavigate();
  const [showPasswordUI, setShowPasswordUI] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="p-4 md:p-10 max-w-4xl mx-auto font-sans bg-slate-50/50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 md:p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-[#ff4e00] rounded-full blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
             <div className="relative">
               {user.photoURL ? (
                 <img src={user.photoURL} alt={user.displayName || ''} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-sm" />
               ) : (
                 <div className="w-32 h-32 rounded-full bg-slate-50 flex items-center justify-center border-4 border-white shadow-sm">
                   <User size={48} className="text-slate-300" />
                 </div>
               )}
               <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full shadow-md" />
             </div>
          </div>
          
          <div className="flex-1 text-center md:text-right">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{user.displayName || 'کۆگاوان'}</h2>
            <p className="text-slate-400 font-medium mb-6 text-sm italic">{user.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
              <span className="px-5 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">Executive</span>
              <span className="px-5 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">ID: {user.uid.substring(0, 8)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              پاراستنی هەژمار
            </h3>
            
            <div className="space-y-4">
              <div className="p-5 bg-slate-50 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key size={16} className="text-slate-400" />
                    <span className="font-bold text-slate-700 text-sm">وشەی نهێنی کۆگا</span>
                  </div>
                  <button 
                    onClick={() => setShowPasswordUI(!showPasswordUI)}
                    className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline"
                  >
                    {showPasswordUI ? 'داخستن' : 'گۆڕین'}
                  </button>
                </div>
                
                {showPasswordUI && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="space-y-3 pt-2"
                  >
                    <input 
                      type="password" 
                      placeholder="وشەی نهێنی کۆن"
                      className="w-full bg-white border border-slate-200 h-12 px-4 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                    />
                    <input 
                      type="password" 
                      placeholder="وشەی نهێنی نوێ"
                      className="w-full bg-white border border-slate-200 h-12 px-4 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button className="w-full h-12 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200">
                      پەسەندکردن
                    </button>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl">
                <div className="flex items-center gap-3">
                  <Zap size={16} className="text-amber-500" />
                  <span className="font-bold text-slate-700 text-sm">٢-قۆناغی پاراستن</span>
                </div>
                <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center px-1">
                   <div className="w-3 h-3 bg-white rounded-full ml-auto shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ff4e00]/10 text-[#ff4e00] flex items-center justify-center">
                <LogOut size={20} />
              </div>
              چوونە دەرەوە
            </h3>
            
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              بۆ پاراستنی هەژمارەکەت و سەلامەتی کۆگاکەت، پێشنیار دەکەین لە کاتی تەواو بوون لە کارەکانت لە هەژمارەکەت بچیتە دەرەوە.
            </p>
            
            <button 
              onClick={handleLogout}
              className="group w-full py-5 bg-red-50 text-red-600 rounded-2xl font-black uppercase tracking-[0.1em] hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-lg hover:shadow-red-200"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              دەرچوون لە هەژمار
            </button>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md p-6 rounded-[32px] border border-white flex items-center justify-center gap-4">
           <div className="flex gap-4">
             <ShieldCheck size={14} className="text-blue-600 opacity-30" />
             <div className="w-px h-3 bg-slate-200" />
             <Database size={14} className="text-[#ff4e00] opacity-30" />
             <div className="w-px h-3 bg-slate-200" />
             <Lock size={14} className="text-amber-500 opacity-30" />
           </div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bayside Enterprise Protection</span>
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ products, damagedItems }: { products: Product[], damagedItems: DamagedItem[] }) => {
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const categoriesCount = new Set(products.map(p => p.category)).size;

  // Sort products by lastUpdated descending to show actual recent changes
  const recentProducts = [...products].sort((a, b) => {
    return new Date(b.lastUpdated.replace(/ \| /g, ' ')).getTime() - new Date(a.lastUpdated.replace(/ \| /g, ' ')).getTime();
  }).slice(0, 4);

  return (
    <div className="space-y-6 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Changes Section */}
        <section className="bg-white/60 backdrop-blur-md p-6 rounded-[32px] border border-white shadow-sm space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <History size={18} className="text-blue-600" />
              <span>نوێترین گۆڕانکارییەکان</span>
            </h3>
            <Link to="/inventory" className="text-blue-600 hover:underline text-[10px] font-black uppercase tracking-widest leading-none">هەمووی ببینە</Link>
          </div>
          
          <div className="space-y-2">
            {recentProducts.map((product) => (
              <CompactProductListItem 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
        </section>

        {/* Quick Insights / Active Alerts */}
        <section className="bg-slate-900 p-6 rounded-[32px] text-white space-y-4 shadow-xl shadow-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              <span>ئاگادارییە خێراکان</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400">ئەمڕۆ</span>
          </div>

          <div className="space-y-3">
            {lowStockCount > 0 ? (
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold leading-tight">{lowStockCount} کاڵا بڕەکەیان کەمبووە</h4>
                  <p className="text-[10px] text-slate-400 mt-1">ئێستا پێویستت بەوەیە بڕی ئەم کاڵایانە زیاد بکەیتەوە لە کۆگا.</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <Check size={16} />
                </div>
                <p className="text-sm font-bold">هەموو کاڵاکان لە بارێکی باشدان</p>
              </div>
            )}

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                <Store size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">کۆی پۆڵێنەکان: {categoriesCount} بەش</h4>
                <p className="text-[10px] text-slate-400 mt-1">سیستەمەکە ئێستا بەپێی و بەشەکان ڕێکخراوە بۆ گەڕانی ئاسانتر.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const DamagedPage = ({ 
  damagedItems, 
  spareParts,
  onReviewDamaged,
  onDeleteDamaged,
  onSaveSparePartImage,
  onAddSparePart,
  onDeleteSparePart
}: { 
  damagedItems: DamagedItem[], 
  spareParts: SparePart[],
  onReviewDamaged: (id: string, fixed: boolean) => void,
  onDeleteDamaged: (id: string) => void,
  onSaveSparePartImage: (id: string, image: string) => void,
  onAddSparePart: (sparePart: SparePart) => void,
  onDeleteSparePart: (id: string) => void
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'damaged' | 'spare'>('damaged');
  const [showSpareModal, setShowSpareModal] = useState(false);
  const [newSpare, setNewSpare] = useState({ name: '', code: '', image: '', notes: '' });

  const filteredDamaged = damagedItems.filter(item => 
    item.status === 'pending' && (
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredSpare = spareParts.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCaptureSpare = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSpare(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const submitSparePart = () => {
    if (!newSpare.name || !newSpare.image) return;
    onAddSparePart({
      id: Math.random().toString(36).substring(2, 9),
      name: newSpare.name,
      code: newSpare.code || 'SP-' + Math.floor(Math.random() * 1000),
      image: newSpare.image,
      addedDate: new Date().toLocaleDateString('ku-IQ'),
      notes: newSpare.notes
    });
    setNewSpare({ name: '', code: '', image: '', notes: '' });
    setShowSpareModal(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">بەڕێوەبردنی زیانەکان</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">تۆمارکردنی کاڵای شکاو و پارچە یەدەگەکان</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('damaged')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'damaged' ? "bg-red-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-700"
            )}
          >
            کاڵا شکاوەکان
          </button>
          <button 
            onClick={() => setActiveTab('spare')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'spare' ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-700"
            )}
          >
            پارچەی یەدەگ
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={activeTab === 'damaged' ? "گەڕان بۆ کاڵای شکاو..." : "گەڕان بۆ پارچەی یەدەگ..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
          />
        </div>
        {activeTab === 'spare' && (
          <button 
            onClick={() => setShowSpareModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Camera size={18} />
            تۆمارکردنی یەدەگ
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {activeTab === 'damaged' ? (
            filteredDamaged.map((item) => (
              <motion.div 
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all group relative"
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-inner">
                      <AlertTriangle size={24} />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onReviewDamaged(item.id, true)}
                        className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        title="چاکبووەوە و گەڕانەوە بۆ عەمبار"
                      >
                        <Check size={20} />
                      </button>
                      <button 
                        onClick={() => onDeleteDamaged(item.id)}
                        className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="سڕینەوە"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-slate-800 leading-tight">{item.productName}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1">
                      <span className="bg-slate-50 px-2 py-0.5 rounded">{item.sku}</span>
                      <span>|</span>
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100 italic">
                      "{item.notes}"
                    </p>
                  )}

                  <div className="space-y-3 pt-2">
                    <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                      <Camera size={12} />
                      وێنەی پارچەکە
                    </h5>
                    {item.sparePartImage ? (
                      <div className="relative group/img">
                        <img 
                          src={item.sparePartImage} 
                          alt="Spare" 
                          className="w-full aspect-video object-cover rounded-2xl border border-slate-100 cursor-pointer"
                        />
                        <button 
                          onClick={() => onSaveSparePartImage(item.id, '')}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover/img:opacity-100 transition-all scale-75 group-hover/img:scale-100"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ) : (
                      <label className="block w-full aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all text-slate-400">
                        <Camera size={24} strokeWidth={1.5} />
                        <span className="text-[10px] font-bold">وێنە بگرە</span>
                        <input 
                          type="file" accept="image/*" capture="environment" className="hidden"
                          onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               const reader = new FileReader();
                               reader.onloadend = () => onSaveSparePartImage(item.id, reader.result as string);
                               reader.readAsDataURL(file);
                             }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            filteredSpare.map((item) => (
              <motion.div 
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all group relative"
              >
                <img src={item.image} className="w-full aspect-square object-cover" alt={item.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                   <div className="flex gap-2">
                     <button className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm">
                       <Check size={16} /> چاکبووە
                     </button>
                     <button 
                       onClick={() => onDeleteSparePart(item.id)}
                       className="w-12 h-12 bg-red-500 text-white rounded-xl flex items-center justify-center"
                     >
                       <X size={20} />
                     </button>
                   </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800">{item.name}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{item.code}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">{item.addedDate} تۆمارکراوە</p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Spare Part Modal */}
      <AnimatePresence>
        {showSpareModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSpareModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight">تۆمارکردنی یەدەگ</h3>
                  <button onClick={() => setShowSpareModal(false)} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 transition-all">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">ناوی پارچەکە</label>
                    <input 
                      type="text" value={newSpare.name} onChange={e => setNewSpare(p => ({...p, name: e.target.value}))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                      placeholder="ناوی پارچە یەدەگەکە بنوسە..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">کۆدی یەدەگ</label>
                    <input 
                      type="text" value={newSpare.code} onChange={e => setNewSpare(p => ({...p, code: e.target.value}))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                      placeholder="کۆد (وەک: SP-101)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className={cn(
                      "aspect-square rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden transition-all",
                      newSpare.image ? "border-emerald-200 bg-emerald-50/20" : "hover:border-blue-400 hover:bg-blue-50/30"
                    )}>
                      {newSpare.image ? (
                        <img src={newSpare.image} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
                             <Camera size={24} />
                          </div>
                          <span className="text-xs font-bold text-slate-400">وێنە بگرە</span>
                        </>
                      )}
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCaptureSpare} />
                    </label>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">تێبینی</label>
                      <textarea 
                        value={newSpare.notes} onChange={e => setNewSpare(p => ({...p, notes: e.target.value}))}
                        className="w-full h-[calc(100%-24px)] bg-slate-50 border border-slate-100 rounded-3xl py-4 px-6 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium resize-none"
                        placeholder="زیاتر بنوسە..."
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={submitSparePart}
                  disabled={!newSpare.name || !newSpare.image}
                  className="w-full bg-blue-600 disabled:bg-slate-200 text-white py-5 rounded-[24px] font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                >
                  <Plus size={24} strokeWidth={3} />
                  تۆمارکردن
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InventoryPage = ({ products, onProductClick, onStockAdjust, onAddProduct, allColors }: { products: Product[], onProductClick: (id: string) => void, onStockAdjust: (e: React.MouseEvent, id: string, delta: number) => void, onAddProduct: () => void, allColors: any[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [searchParams] = useSearchParams();

  const startVoiceSearch = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('گەڕانی دەنگی پشتگیری ناکرێت لەم وێبگەڕەدا (Voice search is not supported in this browser)');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ku-IQ'; // Standard for Kurdish Central (Sorani)
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };
  const filteredProducts = products.filter(p => {
    const category = searchParams.get('cat');
    const subCategory = searchParams.get('sub');
    
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category ? p.category === category : true;
    const matchesSub = subCategory ? (
      p.iconType === subCategory || 
      (PRODUCT_ICONS.find(i => i.name === subCategory)?.id === p.iconType) ||
      p.customIconName === subCategory ||
      p.name.includes(subCategory)
    ) : true;

    return matchesSearch && matchesCategory && matchesSub;
  });

  const activeCategory = searchParams.get('cat');
  const activeSub = searchParams.get('sub');

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              {activeCategory ? (
                <div className="flex items-center gap-2">
                  <span>{activeCategory}</span>
                  {activeSub && (
                    <>
                      <ChevronRight size={20} className="text-slate-300 -rotate-180" />
                      <span className="text-blue-600">{activeSub}</span>
                    </>
                  )}
                </div>
              ) : 'لیستی کاڵاکان'}
            </h2>
          </div>
          <p className="text-slate-500 text-sm font-medium mt-1">
            {activeCategory ? `بینینی کاڵاکانی بەشی ${activeCategory}` : 'بەڕێوەبردنی تەواوی کەلوپەلەکانی کۆگا'}
          </p>
        </div>
        <button 
          onClick={onAddProduct}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          <span>کاڵای نوێ</span>
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="گەڕان بۆ کاڵا، کۆد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pr-12 pl-12 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
          />
          <button 
            onClick={startVoiceSearch}
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all",
              isListening ? "bg-red-50 text-red-500 animate-pulse" : "text-slate-400 hover:bg-slate-50 hover:text-blue-500"
            )}
            title="گەڕانی دەنگی"
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm">
          <Filter size={18} />
          <span>فلتەرکردن</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredProducts.map((product) => (
          <ProductListItem 
            key={product.id} 
            product={product} 
            onProductEdit={onProductClick} 
            onStockAdjust={onStockAdjust} 
            allColors={allColors}
          />
        ))}
        {filteredProducts.length === 0 && (
          <div className="p-20 text-center text-slate-400 italic bg-white/40 backdrop-blur-md rounded-2xl border border-white/50">
            هیچ کاڵایەک نەدۆزرایەوە...
          </div>
        )}
      </div>
    </div>
  );
};

const NotificationSystem = ({ products, damagedItems, onProductClick, settings }: { products: Product[], damagedItems: DamagedItem[], onProductClick: (id: string) => void, settings: any }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const lowStockItems = products.filter(p => p.stock <= (p.minStock || settings.lowStockThreshold));
  const pendingDamagedItems = damagedItems.filter(d => d.status === 'pending');
  const totalCount = lowStockItems.length + pendingDamagedItems.length;

  const [prevCount, setPrevCount] = useState(totalCount);

  useEffect(() => {
    if (settings.enableNotifications && totalCount > prevCount) {
      if (settings.notificationSound !== 'none') {
        const audio = new Audio();
        const sounds: Record<string, string> = {
          chime: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
          subtle: 'https://assets.mixkit.co/active_storage/sfx/2345/2345-preview.mp3',
          alert: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'
        };
        audio.src = sounds[settings.notificationSound] || sounds.chime;
        audio.play().catch(e => console.log('Audio playback prevented:', e));
      }
    }
    setPrevCount(totalCount);
  }, [totalCount, settings]);

  return (
    <div className="relative">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-all relative",
          totalCount > 0 ? "bg-amber-50 text-amber-500 shadow-lg shadow-amber-100" : "bg-slate-50 text-slate-400"
        )}
      >
        <Bell size={20} className={totalCount > 0 ? "animate-bounce" : ""} />
        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {totalCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowDropdown(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 z-40 overflow-hidden origin-top-left"
            >
              <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-800">ئاگادارییەکان</h4>
                <div className="flex gap-1">
                  {pendingDamagedItems.length > 0 && <span className="text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-black uppercase">شکاو</span>}
                  {lowStockItems.length > 0 && <span className="text-[8px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-black uppercase">کەمبوو</span>}
                </div>
              </div>
              
              <div className="max-h-80 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {totalCount === 0 ? (
                  <div className="py-12 px-6 text-center">
                    <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check size={24} />
                    </div>
                    <p className="text-slate-500 text-xs font-medium">هەموو شتێک جێگیرە!</p>
                  </div>
                ) : (
                  <>
                    {pendingDamagedItems.map(item => (
                      <div key={item.id} className="p-3 hover:bg-slate-50 rounded-2xl flex items-start gap-4 transition-colors border border-transparent hover:border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                          <XCircle size={18} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="font-bold text-xs text-slate-800 truncate">{item.productName}</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">ئەم کاڵایە شکاوە و پێویستی بە سەرنج هەیە.</p>
                        </div>
                      </div>
                    ))}
                    {lowStockItems.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onProductClick(p.id);
                          setShowDropdown(false);
                        }}
                        className="w-full text-right p-3 hover:bg-slate-50 rounded-2xl flex items-start gap-4 transition-colors border border-transparent hover:border-slate-100"
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                          <AlertTriangle size={18} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="font-bold text-xs text-slate-800 truncate">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">بڕ: {p.stock}</span>
                            <span className="text-[9px] text-slate-400">کۆد: {p.sku}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReportsPage = ({ products, exchangeRate }: { products: Product[], exchangeRate: number }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  const totalUSDValue = products.reduce((sum, p) => {
    const priceInUSD = p.priceCurrency === 'IQD' ? p.price / exchangeRate : p.price;
    return sum + (priceInUSD * p.stock);
  }, 0);
  const totalIQDValue = totalUSDValue * exchangeRate;

  const categoryData = CATEGORIES.map(cat => {
    const count = products.filter(p => p.category === cat.name).reduce((sum, p) => sum + p.stock, 0);
    return { name: cat.name, value: count };
  });

  const topProducts = [...products]
    .sort((a, b) => {
      const valB = (b.priceCurrency === 'IQD' ? b.price / exchangeRate : b.price) * b.stock;
      const valA = (a.priceCurrency === 'IQD' ? a.price / exchangeRate : a.price) * a.stock;
      return valB - valA;
    })
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      value: (p.priceCurrency === 'IQD' ? p.price / exchangeRate : p.price) * p.stock
    }));

  const revenueTrendData = React.useMemo(() => {
    const allSales = products.flatMap(p => 
      (p.history || [])
        .filter(h => h.action === 'فرۆشتن')
        .map(h => ({
          date: new Date(h.date.includes('|') ? h.date.split('|')[0].trim() : h.date),
          isoDate: h.date.includes('|') ? h.date.split('|')[0].trim() : h.date,
          revenue: h.price
        }))
    );

    const now = new Date('2024-05-03');
    
    if (timeRange === 'year') {
      const monthlyData: { [key: string]: number } = {};
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(now.getMonth() - i);
        const monthLabel =`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthLabel] = 0;
      }

      allSales.forEach(sale => {
        const monthLabel = `${sale.date.getFullYear()}-${String(sale.date.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyData[monthLabel] !== undefined) {
          monthlyData[monthLabel] += sale.revenue;
        }
      });

      return Object.entries(monthlyData).map(([month, revenue]) => ({
        date: month,
        revenue
      }));
    }

    let daysToLookBack = timeRange === 'week' ? 7 : 30;
    const labels = [];
    for (let i = daysToLookBack - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      labels.push(d.toISOString().split('T')[0]);
    }

    return labels.map(labelDate => {
      const daySales = allSales.filter(s => s.isoDate === labelDate);
      const totalRevenue = daySales.reduce((sum, s) => sum + s.revenue, 0);
      return { date: labelDate, revenue: totalRevenue };
    });
  }, [products, timeRange]);

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10 text-right"
      dir="rtl"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">ڕاپۆرتەکان</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">ئامار و زانیاری گشتی دارایی و کاڵاکان</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-center">
          {(['week', 'month', 'year'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize",
                timeRange === r ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {r === 'week' ? 'هەفتانە' : r === 'month' ? 'مانگانە' : 'ساڵانە'}
            </button>
          ))}
        </div>
      </header>

      {/* Compact Financial Bar */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* USD Compact Card */}
          <motion.div 
            whileHover={{ scale: 1.002 }}
            className="bg-white px-6 py-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg">
                <DollarSign size={15} />
              </div>
              <span className="text-[11px] font-bold text-slate-400">کۆی دۆلار</span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <AnimatePresence mode="wait">
                <motion.span 
                  key={totalUSDValue}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-2xl font-bold text-slate-800 font-display tracking-tight"
                >
                  {totalUSDValue.toLocaleString()}
                </motion.span>
              </AnimatePresence>
              <span className="text-lg font-bold text-slate-300 font-display">$</span>
            </div>
          </motion.div>

          {/* IQD Compact Card */}
          <motion.div 
            whileHover={{ scale: 1.002 }}
            className="bg-slate-900 px-6 py-3.5 rounded-2xl shadow-xl flex items-center justify-between group text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-500/20 text-blue-300 rounded-lg">
                <Activity size={15} />
              </div>
              <span className="text-[11px] font-bold text-slate-500">کۆی دینار</span>
            </div>

            <div className="flex items-baseline gap-2">
              <AnimatePresence mode="wait">
                <motion.span 
                  key={totalIQDValue}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-2xl font-bold text-white font-display tracking-tight"
                >
                  {Math.round(totalIQDValue).toLocaleString()}
                </motion.span>
              </AnimatePresence>
              <span className="text-[10px] font-bold text-blue-400 uppercase font-display px-1.5 py-0.5 bg-blue-400/10 rounded-md">IQD</span>
            </div>
          </motion.div>
        </div>

        {/* Live Rate Bottom Context */}
        <div className="flex items-center justify-between px-3">
           <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 font-display uppercase tracking-widest">
                نرخی زیندوو: {exchangeRate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
              <Calendar size={10} />
              {new Date('2024-05-03').toLocaleDateString('ku-IQ')}
            </div>
          </div>

          <a 
            href="https://qamaralfajr.com/production/exchange_rates.php" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 group bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-all border border-slate-200/40"
          >
            <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors">Qamar Al-Fajr</span>
            <div className="text-slate-400 group-hover:text-blue-500">
              <LinkIcon size={11} />
            </div>
          </a>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            داهاتی گشتی کاڵاکان بەپێی کات
          </h3>
          <div className="p-2 bg-slate-50 text-slate-400 rounded-xl">
            <Calendar size={18} />
          </div>
        </div>
        <div className="h-[350px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickFormatter={(date) => {
                  const d = new Date(date);
                  if (timeRange === 'year') {
                    return d.toLocaleDateString('ku-IQ', { month: 'short' });
                  }
                  return d.toLocaleDateString('ku-IQ', { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickFormatter={(value) => `$${value}`}
                orientation="right"
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', textAlign: 'right' }}
                labelFormatter={(label) => {
                  const d = new Date(label);
                  if (timeRange === 'year') {
                    return d.toLocaleDateString('ku-IQ', { year: 'numeric', month: 'long' });
                  }
                  return d.toLocaleDateString('ku-IQ', { dateStyle: 'full' });
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'داهات']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={4}
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-blue-500" />
            دابەشبوونی کاڵاکان بەپێی بەشەکان
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', textAlign: 'right' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products by Value */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-500" />
            گرانترین کاڵاکانی کۆگا (بەپێی بڕ)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 'bold', fill: '#64748b' }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', textAlign: 'right' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'بەها']}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SettingsPage = ({ 
  settings, 
  onSettingsChange, 
  activeTab: initialTab = 'users' 
}: { 
  settings: any, 
  onSettingsChange: (s: any) => void, 
  activeTab?: 'users' | 'backup' | 'notifications' 
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'backup' | 'notifications'>(initialTab);
  const [users, setUsers] = useState([
    { id: '1', name: 'ئاراس', role: 'Admin', canView: true, canEdit: true, createdAt: '2024/01/15' },
    { id: '2', name: 'کاروان', role: 'Staff', canView: true, canEdit: false, createdAt: '2024/02/20' },
  ]);
  const [newUserName, setNewUserName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddUser = () => {
    if (!newUserName.trim()) return;
    const newUser = {
      id: Date.now().toString(),
      name: newUserName,
      role: 'Staff',
      canView: true,
      canEdit: false,
      createdAt: new Date().toLocaleDateString('en-CA'),
    };
    setUsers([...users, newUser]);
    setNewUserName('');
  };

  const togglePermission = (userId: string, permission: 'canView' | 'canEdit') => {
    setUsers(users.map(u => u.id === userId ? { ...u, [permission]: !u[permission] } : u));
  };

  const deleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-20"
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">ڕێکخستنی گشتی</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">بەڕێوەبردنی بەکارهێنەران و دەسەڵاتەکان</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
        >
          {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
          <span>{isSaving ? 'پاشەکەوت دەکرێت...' : 'پاشەکەوتکردن'}</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('users')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all text-right",
              activeTab === 'users' ? "bg-white border border-blue-100 text-blue-600 shadow-sm" : "bg-transparent text-slate-500 hover:bg-slate-50"
            )}
          >
            <User size={18} />
            <span>بەکارھێنەران</span>
          </button>
          <button 
            onClick={() => setActiveTab('backup')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all text-right",
              activeTab === 'backup' ? "bg-white border border-blue-100 text-blue-600 shadow-sm" : "bg-transparent text-slate-500 hover:bg-slate-50"
            )}
          >
            <Database size={18} />
            <span>باکی ئەپ (Backup)</span>
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all text-right",
              activeTab === 'notifications' ? "bg-white border border-blue-100 text-blue-600 shadow-sm" : "bg-transparent text-slate-500 hover:bg-slate-50"
            )}
          >
            <Bell size={18} />
            <span>ئاگادارییەکان</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          {activeTab === 'users' ? (
            <div className="space-y-6">
              {/* Add User Section */}
              <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">زیادکردنی بەکارهێنەر</h3>
                    <p className="text-slate-400 text-[11px]">بەکارهێنەرێکی نوێ بۆ سیستەمەکە زیاد بکە</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="ناوی بەکارهێنەر بنووسە..."
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-800"
                  />
                  <button 
                    onClick={handleAddUser}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                  >
                    <Plus size={18} />
                    <span>زیادکردن</span>
                  </button>
                </div>
              </section>

              {/* Users List */}
              <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                  <h3 className="font-bold text-slate-800">لیستی بەکارهێنەران</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                        <th className="px-6 py-4">بەکارهێنەر</th>
                        <th className="px-6 py-4 text-center">بینین</th>
                        <th className="px-6 py-4 text-center">دەستکاریکردن</th>
                        <th className="px-6 py-4">بەرواری زیادکردن</th>
                        <th className="px-6 py-4 text-center">کردارەکان</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                                <div className="text-[10px] text-slate-400">{user.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <button 
                                onClick={() => togglePermission(user.id, 'canView')}
                                className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                  user.canView ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-300"
                                )}
                              >
                                {user.canView ? <Eye size={18} /> : <EyeOff size={18} />}
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <button 
                                onClick={() => togglePermission(user.id, 'canEdit')}
                                className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                  user.canEdit ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-300"
                                )}
                              >
                                {user.canEdit ? <Edit3 size={18} /> : <XCircle size={18} />}
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-500">
                            {user.createdAt}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <button 
                                onClick={() => deleteUser(user.id)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : activeTab === 'notifications' ? (
            <div className="space-y-6">
              <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                    <Bell size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl tracking-tight text-slate-800">ڕێکخستنی ئاگادارییەکان</h3>
                    <p className="text-slate-400 text-xs mt-1">دیاریکردنی کاتی ئاگادارکردنەوە و جۆری دەنگ</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Toggle Notifications */}
                  <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                        <Bell size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">چالاککردنی ئاگادارییەکان</h4>
                        <p className="text-[10px] text-slate-400">ئاگادارکردنەوەی بەکارھێنەر کاتێک بڕی کاڵا کەم دەبێت</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onSettingsChange({ ...settings, enableNotifications: !settings.enableNotifications })}
                      className={cn(
                        "w-12 h-7 rounded-full relative transition-all",
                        settings.enableNotifications ? "bg-emerald-500 shadow-lg shadow-emerald-100" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-sm",
                        settings.enableNotifications ? "right-1" : "right-6"
                      )} />
                    </button>
                  </div>

                  {/* Threshold Setting */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className="text-amber-500" />
                        <label className="text-xs font-bold text-slate-700">کاتی ئاگادارکردنەوە بۆ کاڵا کەمبووەکان</label>
                      </div>
                      <span className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1 rounded-full border border-blue-100 italic">
                        {settings.lowStockThreshold} دانە
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      step="1"
                      value={settings.lowStockThreshold}
                      onChange={(e) => onSettingsChange({ ...settings, lowStockThreshold: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 px-1 uppercase tracking-widest">
                      <span>١ دانە</span>
                      <span>١٠ دانە ئاسایی</span>
                      <span>٢٠ دانە</span>
                    </div>
                  </div>

                  {/* Sound Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1 mb-2">
                      <Speaker size={14} className="text-blue-500" />
                      <label className="text-xs font-bold text-slate-700">جۆری دەنگی ئاگادارکردنەوە</label>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { id: 'none', name: 'بێ دەنگ', icon: VolumeX },
                        { id: 'chime', name: 'کلاسیک', icon: Bell },
                        { id: 'subtle', name: 'لەبەرخۆ', icon: Bell },
                        { id: 'alert', name: 'ئاژار', icon: AlertTriangle }
                      ].map((sound) => {
                        const Icon = sound.icon;
                        const isActive = settings.notificationSound === sound.id;
                        return (
                          <button
                            key={sound.id}
                            onClick={() => onSettingsChange({ ...settings, notificationSound: sound.id })}
                            className={cn(
                              "p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                              isActive 
                                ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100 scale-105" 
                                : "bg-white border-slate-50 text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                            )}
                          >
                            <Icon size={20} />
                            <span className="text-[10px] font-bold">{sound.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-6">
              <section className="bg-slate-900 p-8 rounded-3xl text-white space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/30">
                    <Database size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl tracking-tight">بەڕێوەبردنی داتا</h3>
                    <p className="text-slate-400 text-xs mt-1">هەناردەکردن و پاشەکەوتکردنی داتاکانی سیستەم</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="bg-white/5 hover:bg-white/10 p-6 rounded-2xl text-right border border-white/10 transition-all flex flex-col gap-3 group">
                    <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                      <Download size={20} />
                    </div>
                    <h4 className="font-bold text-sm">ھەناردەکردن (Excel)</h4>
                    <p className="text-[10px] text-slate-500">هەناردەکردنی لیستی کاڵاکان بۆ فایلی ئێکسڵ</p>
                  </button>
                  
                  <button className="bg-blue-600 hover:bg-blue-700 p-6 rounded-2xl text-right transition-all flex flex-col gap-3 group">
                    <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="font-bold text-sm">دروستکردنی باک ئەپ</h4>
                    <p className="text-[10px] text-blue-100/70">پاشەکەوتکردنی هەموو گۆڕانکارییەکانی ئێستا</p>
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---
export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('app_settings_v1');
    return saved ? JSON.parse(saved) : {
      lowStockThreshold: 5,
      notificationSound: 'chime',
      enableNotifications: true
    };
  });

  useEffect(() => {
    localStorage.setItem('app_settings_v1', JSON.stringify(settings));
  }, [settings]);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [damagedItems, setDamagedItems] = useState<DamagedItem[]>(() => {
    const saved = localStorage.getItem('damaged_items_v1');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('damaged_items_v1', JSON.stringify(damagedItems));
  }, [damagedItems]);

  const [spareParts, setSpareParts] = useState<SparePart[]>(() => {
    const saved = localStorage.getItem('spare_parts_v1');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('spare_parts_v1', JSON.stringify(spareParts));
  }, [spareParts]);

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState(1530);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleReviewDamaged = (id: string, fixed: boolean) => {
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${YYYY}/${MM}/${DD} | ${hh}:${mm}:${ss}`;
    
    setDamagedItems(prev => prev.map(item => {
      if (item.id === id) {
        if (fixed) {
          // Adjust stock back in inventory if it's being marked as fixed
          setProducts(prevProducts => prevProducts.map(p => 
            p.id === item.productId ? { 
              ...p, 
              stock: p.stock + 1, 
              lastUpdated: timestamp, 
              updatedBy: 'مەریوان',
              lastAction: 'گەڕایەوە (چاکبووە)'
            } : p
          ));
          return { ...item, status: 'fixed' };
        }
        return item;
      }
      return item;
    }));
  };

  const handleDeleteDamaged = (id: string) => {
    setDamagedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveSparePartImage = (id: string, image: string) => {
    setDamagedItems(prev => prev.map(item => 
      item.id === id ? { ...item, sparePartImage: image } : item
    ));
  };

  const handleAddDamaged = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock <= 0) return;

    const newDamaged: DamagedItem = {
      id: Math.random().toString(36).substring(2, 9),
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      date: new Date().toLocaleDateString('ku-IQ'),
      status: 'pending'
    };

    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${YYYY}/${MM}/${DD} | ${hh}:${mm}:${ss}`;

    setDamagedItems(prev => [newDamaged, ...prev]);
    setProducts(prev => prev.map(p => 
      p.id === productId ? { 
        ...p, 
        stock: p.stock - 1, 
        lastUpdated: timestamp, 
        updatedBy: 'مەریوان',
        lastAction: 'بە شکاو تۆمارکرا'
      } : p
    ));
  };

  const [availableColors, setAvailableColors] = useState<{ id: string, name: string, hex: string, shadow: string, border?: string }[]>(() => {
    const saved = localStorage.getItem('available_colors_v3');
    return saved ? JSON.parse(saved) : [...PRODUCT_COLORS];
  });

  useEffect(() => {
    localStorage.setItem('available_colors_v3', JSON.stringify(availableColors));
  }, [availableColors]);

  const allColors = availableColors;

  useEffect(() => {
     const interval = setInterval(() => {
      setExchangeRate(prev => {
        // Very small, infrequent fluctuation to simulate "live" but stable data
        const fluctuation = (Math.random() - 0.5) * 0.05; 
        return Number((prev + fluctuation).toFixed(3));
      });
    }, 60000); // Update every minute instead of 10 seconds
    return () => clearInterval(interval);
  }, []);

  const selectedProduct = products.find(p => p.id === editingProductId) || null;
  const totalValue = products.reduce((acc, p) => {
    const priceInUSD = p.priceCurrency === 'IQD' ? p.price / exchangeRate : p.price;
    return acc + (priceInUSD * p.stock);
  }, 0);

  const handleProductUpdate = (updatedProduct: Product) => {
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${YYYY}/${MM}/${DD} | ${hh}:${mm}:${ss}`;
    
    setProducts(products.map(p => p.id === updatedProduct.id ? { ...updatedProduct, lastUpdated: timestamp, updatedBy: 'مەریوان', lastAction: 'زانیاری نوێکرایەوە' } : p));
    setEditingProductId(null);
  };

  const handleAddNewProduct = () => {
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${YYYY}/${MM}/${DD} | ${hh}:${mm}:${ss}`;
    const newId = Math.random().toString(36).substring(2, 9);
    const newProduct: Product = {
      id: newId,
      name: '',
      sku: '',
      category: 'کارەبایی',
      stock: 0,
      minStock: 2,
      price: 0,
      priceCurrency: 'USD',
      status: 'Out of Stock',
      lastUpdated: timestamp,
      updatedBy: 'مەریوان',
      lastAction: 'کاڵای نوێ زیادکرا',
      iconType: 'default',
      location: 'مخزن'
    };
    setProducts([newProduct, ...products]);
    setEditingProductId(newId);
  };

  const handleProductDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    setEditingProductId(null);
  };

  const handleStockAdjust = (e: React.MouseEvent, id: string, delta: number) => {
    e.stopPropagation();
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${YYYY}/${MM}/${DD} | ${hh}:${mm}:${ss}`;

    setProducts(prev => prev.map(p => 
      p.id === id ? { 
        ...p, 
        stock: Math.max(0, p.stock + delta), 
        lastUpdated: timestamp, 
        updatedBy: 'مەریوان',
        lastAction: delta > 0 ? 'بڕ زیادکرا' : 'بڕ کەمکرا'
      } : p
    ));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0502] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-12 h-12 bg-[#ff4e00] rounded-xl flex items-center justify-center"
        >
          <Package className="text-white animate-pulse" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <LoginPage />
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-blue-600 selection:text-white" dir="rtl">
        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed bottom-6 left-6 w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl z-50 lg:hidden"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(false)} user={user} />

        <main className="flex-1 lg:mr-64 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">نرخی دۆلار</p>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <p className="text-sm font-bold text-blue-600 font-display">{exchangeRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-100 hidden sm:block"></div>
              <div className="hidden sm:block text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">کۆی گشتی بەهای کۆگا</p>
                <p className="text-sm font-bold text-slate-800 font-display">
                  {(totalValue * exchangeRate).toLocaleString('ku-IQ')} دینار
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-xs font-bold text-slate-400 hidden lg:block">
                {new Date().toLocaleDateString('ku-IQ')}
              </div>
              <div className="w-px h-6 bg-slate-100 mx-2 hidden lg:block" />
              <NotificationSystem products={products} damagedItems={damagedItems} onProductClick={setEditingProductId} settings={settings} />
              
              <div className="w-px h-6 bg-slate-100 mx-1 hidden sm:block"></div>

              <Link to="/account" className="flex items-center gap-3 pl-1 group">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden transform group-hover:rotate-6 transition-all duration-300">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} className="text-white" />
                  )}
                </div>
              </Link>
            </div>
          </header>

          <div className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto w-full max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard products={products} damagedItems={damagedItems} />} />
              <Route path="/inventory" element={<InventoryPage products={products} onProductClick={setEditingProductId} onStockAdjust={handleStockAdjust} onAddProduct={handleAddNewProduct} allColors={allColors} />} />
              <Route path="/damaged" element={
                <DamagedPage 
                  damagedItems={damagedItems} 
                  spareParts={spareParts}
                  onReviewDamaged={handleReviewDamaged}
                  onDeleteDamaged={handleDeleteDamaged}
                  onSaveSparePartImage={handleSaveSparePartImage}
                  onAddSparePart={(part) => setSpareParts(prev => [part, ...prev])}
                  onDeleteSparePart={(id) => setSpareParts(prev => prev.filter(p => p.id !== id))}
                />
              } />
              <Route path="/reports" element={<ReportsPage products={products} exchangeRate={exchangeRate} />} />
              <Route path="/settings" element={<SettingsPage settings={settings} onSettingsChange={setSettings} activeTab="users" />} />
              <Route path="/account" element={<AccountPage user={user} />} />
            </Routes>
          </div>
        </main>

        <ProductEditModal 
          isOpen={!!editingProductId}
          product={selectedProduct}
          onClose={() => setEditingProductId(null)}
          onSave={handleProductUpdate}
          onDelete={handleProductDelete}
          allColors={allColors}
          onAddCustomColor={(newColor) => setAvailableColors(prev => [...prev, newColor])}
          onDeleteColor={(colorId) => setAvailableColors(prev => prev.filter(c => c.id !== colorId))}
          onReportDamaged={handleAddDamaged}
        />
      </div>
    </Router>
  );
}
