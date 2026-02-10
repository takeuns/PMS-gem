
import React from 'react';
import { Bell, X, UserPlus, MessageCircle, AlertCircle, Check } from 'lucide-react';
import { Notification, Language, translations } from '../App';

interface Props {
  notifications: Notification[];
  lang: Language;
  onClose: () => void;
  onMarkRead: () => void;
}

const NotificationCenter: React.FC<Props> = ({ notifications, lang, onClose, onMarkRead }) => {
  const t = translations[lang];

  return (
    <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200 text-slate-800">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-indigo-600" />
          <h3 className="font-bold">{t.notifications}</h3>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onMarkRead}
            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
          >
            {t.markAllRead}
          </button>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors flex gap-4 ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
            >
              <div className={`mt-1 p-2 rounded-xl shrink-0 ${
                n.type === 'assignment' ? 'bg-blue-100 text-blue-600' : 
                n.type === 'comment' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {n.type === 'assignment' && <UserPlus size={16} />}
                {n.type === 'comment' && <MessageCircle size={16} />}
                {n.type === 'deadline' && <AlertCircle size={16} />}
              </div>
              <div className="flex-1 space-y-1 text-left">
                <p className="text-sm leading-snug">{n.message}</p>
                <span className="text-[10px] text-slate-400 font-medium">{n.timestamp}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center flex flex-col items-center gap-3 text-slate-400">
            <Check size={40} strokeWidth={1} />
            <p className="text-sm italic">{t.noNotifs}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
