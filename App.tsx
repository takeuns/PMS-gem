
import React, { useState, useEffect } from 'react';
import { 
  Database, 
  GitMerge, 
  LineChart, 
  MessageSquare, 
  Terminal, 
  LayoutDashboard, 
  CheckSquare, 
  CalendarDays, 
  Trello, 
  Bell,
  Languages,
  ChevronDown
} from 'lucide-react';
import SQLSchema from './components/SQLSchema';
import ERDVisualizer from './components/ERDVisualizer';
import ProgressLogic from './components/ProgressLogic';
import AISchemaHelper from './components/AISchemaHelper';
import PythonBackend from './components/PythonBackend';
import Dashboard from './components/Dashboard';
import MyTasks from './components/MyTasks';
import Timeline from './components/Timeline';
import KanbanBoard from './components/KanbanBoard';
import NotificationCenter from './components/NotificationCenter';

export type Language = 'ko' | 'en' | 'zh' | 'th' | 'lo';

export const translations = {
  ko: {
    title: '시스템 개발 프로젝트 관리',
    dashboard: '대시보드',
    mytasks: '내 업무',
    kanban: '칸반 보드',
    timeline: '전체 일정',
    logic: '진행 로직',
    python: 'Python API',
    schema: 'SQL 스키마',
    erd: 'ERD 관계도',
    ai: 'AI 컨설턴트',
    notifications: '최신 알림',
    markAllRead: '모두 읽음',
    noNotifs: '새로운 알림이 없습니다.',
  },
  en: {
    title: 'Project Management System',
    dashboard: 'Dashboard',
    mytasks: 'My Tasks',
    kanban: 'Kanban Board',
    timeline: 'Timeline',
    logic: 'Progress Logic',
    python: 'Python API',
    schema: 'SQL Schema',
    erd: 'ERD Map',
    ai: 'AI Consultant',
    notifications: 'Notifications',
    markAllRead: 'Mark all read',
    noNotifs: 'No new notifications.',
  },
  zh: {
    title: '系统开发项目管理',
    dashboard: '仪表盘',
    mytasks: '我的任务',
    kanban: '看板',
    timeline: '时间线',
    logic: '进度逻辑',
    python: 'Python 接口',
    schema: 'SQL 架构',
    erd: '实体关系图',
    ai: 'AI 顾问',
    notifications: '最新通知',
    markAllRead: '全部标记为已读',
    noNotifs: '没有新通知。',
  },
  th: {
    title: 'ระบบจัดการโครงการ',
    dashboard: 'แดชบอร์ด',
    mytasks: 'งานของฉัน',
    kanban: 'คัมบัง',
    timeline: 'ไทม์ไลน์',
    logic: 'ตรรกะความคืบหน้า',
    python: 'Python API',
    schema: 'SQL 스คีมา',
    erd: 'ผังความสัมพันธ์ (ERD)',
    ai: 'ที่ปรึกษา AI',
    notifications: 'การแจ้งเตือน',
    markAllRead: 'อ่านทั้งหมด',
    noNotifs: 'ไม่มีการแจ้งเตือนใหม่',
  },
  lo: {
    title: 'ລະບົບຈັດການໂຄງການ',
    dashboard: 'ແຜງຄວບຄຸມ',
    mytasks: 'ວຽກຂອງຂ້ອຍ',
    kanban: 'ຄຳບັງ',
    timeline: 'ທາມລາຍ',
    logic: 'ຕັກກະຄວາມຄືບໜ້າ',
    python: 'Python API',
    schema: 'SQL ສະກີມາ',
    erd: 'ຜັງຄວາມສຳພັນ (ERD)',
    ai: 'ທີ່ປຶກສາ AI',
    notifications: 'ການແຈ້ງເຕືອນ',
    markAllRead: 'ອ່ານທັງໝົດ',
    noNotifs: 'ບໍ່ມີການແຈ້ງເຕືອນໃໝ່',
  }
};

export interface Notification {
  id: string;
  type: 'assignment' | 'comment' | 'deadline';
  message: string;
  timestamp: string;
  isRead: boolean;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'mytasks' | 'kanban' | 'timeline' | 'schema' | 'erd' | 'logic' | 'python' | 'ai'>('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [lang, setLang] = useState<Language>('ko');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const mockNotifs: Notification[] = [
      { id: 'n1', type: 'assignment', message: lang === 'ko' ? '새로운 업무 "API 보안 강화"의 담당자로 지정되었습니다.' : 'Assigned to "API Security Enhancement".', timestamp: 'Just now', isRead: false },
      { id: 'n2', type: 'deadline', message: lang === 'ko' ? '마감 임박: "DB 인덱스 최적화" 업무 기한이 1일 남았습니다.' : 'Deadline near: "DB Index Optimization" in 1 day.', timestamp: '10m ago', isRead: false },
    ];
    setNotifications(mockNotifs);
  }, [lang]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const tabs = [
    { id: 'dashboard', label: t.dashboard, icon: <LayoutDashboard size={18} /> },
    { id: 'mytasks', label: t.mytasks, icon: <CheckSquare size={18} /> },
    { id: 'kanban', label: t.kanban, icon: <Trello size={18} /> },
    { id: 'timeline', label: t.timeline, icon: <CalendarDays size={18} /> },
    { id: 'logic', label: t.logic, icon: <LineChart size={18} /> },
    { id: 'python', label: t.python, icon: <Terminal size={18} /> },
    { id: 'schema', label: t.schema, icon: <Database size={18} /> },
    { id: 'erd', label: t.erd, icon: <GitMerge size={18} /> },
    { id: 'ai', label: t.ai, icon: <MessageSquare size={18} /> },
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '简体中文', flag: '🇨🇳' },
    { code: 'th', label: 'ไทย', flag: '🇹🇭' },
    { code: 'lo', label: 'ພາສາລາວ', flag: '🇱🇦' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans transition-all duration-300">
      {/* Sticky Header Group */}
      <div className="sticky top-0 z-50">
        {/* Row 1: Top Utility Bar (The very first line) */}
        <div className="bg-indigo-950 text-indigo-200 border-b border-indigo-900 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-10 flex justify-end items-center gap-6">
            {/* Language Selector */}
            <div className="relative h-full flex items-center">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider hover:text-white transition-colors h-full px-2"
              >
                <Languages size={14} />
                <span>{languages.find(l => l.code === lang)?.flag} {languages.find(l => l.code === lang)?.label}</span>
                <ChevronDown size={12} />
              </button>
              
              {showLangMenu && (
                <div className="absolute right-0 top-full mt-0 w-40 bg-white rounded-b-xl shadow-2xl border border-slate-200 overflow-hidden z-[60] animate-in slide-in-from-top-1 duration-150">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs hover:bg-slate-50 transition-colors ${lang === l.code ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700'}`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative h-full flex items-center">
              <button 
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className="p-2 hover:bg-indigo-900 rounded-lg transition-colors relative"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-indigo-950"></span>
                )}
              </button>
              
              {showNotifPanel && (
                <div className="absolute right-0 top-full mt-0">
                  <NotificationCenter 
                    notifications={notifications} 
                    lang={lang}
                    onClose={() => setShowNotifPanel(false)} 
                    onMarkRead={markAllAsRead}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Main Header */}
        <header className="bg-indigo-700 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg text-indigo-700 shadow-inner">
                <Database size={20} />
              </div>
              <h1 className="text-lg font-bold tracking-tight">{t.title}</h1>
            </div>
            
            <nav className="flex bg-indigo-800/40 rounded-full p-1 border border-indigo-400/20 overflow-x-auto scrollbar-hide max-w-[500px] lg:max-w-none">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[75vh] flex flex-col">
          {activeTab === 'dashboard' && <Dashboard lang={lang} />}
          {activeTab === 'mytasks' && <MyTasks />}
          {activeTab === 'kanban' && <KanbanBoard lang={lang} />}
          {activeTab === 'timeline' && <Timeline />}
          {activeTab === 'schema' && <SQLSchema />}
          {activeTab === 'erd' && <ERDVisualizer />}
          {activeTab === 'logic' && <ProgressLogic />}
          {activeTab === 'python' && <PythonBackend />}
          {activeTab === 'ai' && <AISchemaHelper />}
        </div>
      </main>

      <footer className="mt-auto py-6 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Senior Project Manager Dashboard | Multi-language Enabled (KO, EN, ZH, TH, LO)
      </footer>
    </div>
  );
};

export default App;
