import { Plus, Minus, ShoppingBag, Coffee, Home, Car, Utensils, Heart, Briefcase, MoreHorizontal } from 'lucide-react';

export const CATEGORIES = [
  { id: 'food', name: 'طعام', icon: Utensils, color: 'bg-orange-100 text-orange-600' },
  { id: 'shopping', name: 'تسوق', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
  { id: 'transport', name: 'مواصلات', icon: Car, color: 'bg-purple-100 text-purple-600' },
  { id: 'home', name: 'منزل', icon: Home, color: 'bg-green-100 text-green-600' },
  { id: 'health', name: 'صحة', icon: Heart, color: 'bg-red-100 text-red-600' },
  { id: 'work', name: 'عمل', icon: Briefcase, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'other', name: 'أخرى', icon: MoreHorizontal, color: 'bg-slate-100 text-slate-600' },
];

export const getCategory = (id: string) => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
