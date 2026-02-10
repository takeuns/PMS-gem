
import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Language } from '../App';

const dashboardTranslations = {
  ko: { title: '프로젝트 요약 정보', sub: '차세대 시스템 개발 프로젝트 (Phase 1)', total: '전체 업무', inprog: '진행 중', delayed: '지연 업무', remaining: '잔여 기간', deadline: '마감일', progress: '전체 프로젝트 진행 추이', actual: '실제 진행률', expected: '목표 진행선' },
  en: { title: 'Project Summary', sub: 'Next-Gen System Development (Phase 1)', total: 'Total Tasks', inprog: 'In Progress', delayed: 'Delayed', remaining: 'Remaining', deadline: 'Deadline', progress: 'Project Progress Trend', actual: 'Actual Progress', expected: 'Target Goal' },
  zh: { title: '项目摘要信息', sub: '下世代系统开发项目 (第一阶段)', total: '全部任务', inprog: '进行中', delayed: '延期任务', remaining: '剩余时间', deadline: '截止日期', progress: '项目整体进度趋势', actual: '实际进度', expected: '目标基准线' },
  th: { title: 'สรุปโครงการ', sub: 'โครงการพัฒนาระบบ (ระยะที่ 1)', total: 'งานทั้งหมด', inprog: 'กำลังดำเนินการ', delayed: 'งานที่ล่าช้า', remaining: 'เวลาที่เหลือ', deadline: 'กำหนดการ', progress: 'แนวโน้มความคืบหน้าโครงการ', actual: 'ความคืบหน้าจริง', expected: 'เป้าหมาย' },
  lo: { title: 'ສະຫຼຸບໂຄງການ', sub: 'ໂຄງການພັດທະນາລະບົບ (ໄລຍະທີ່ 1)', total: 'ວຽກທັງໝົດ', inprog: 'ກຳລັງດຳເນີນການ', delayed: 'ວຽກທີ່ຊັກຊ້າ', remaining: 'ເວລາທີ່ເຫຼືອ', deadline: 'ກຳນົດສົ່ງ', progress: 'ແນວໂນ້ມຄວາມຄືບໜ້າໂຄງການ', actual: 'ຄວາມຄືບໜ້າຕົວຈິງ', expected: 'ເປົ້າໝາຍ' }
};

interface Props {
  lang: Language;
}

const Dashboard: React.FC<Props> = ({ lang }) => {
  const t = dashboardTranslations[lang];

  const stats = [
    { label: t.total, value: '24', icon: <CheckCircle2 size={20} className="text-indigo-500" /> },
    { label: t.inprog, value: '12', icon: <TrendingUp size={20} className="text-blue-500" /> },
    { label: t.delayed, value: '3', icon: <AlertTriangle size={20} className="text-amber-500" /> },
    { label: t.remaining, value: '15d', icon: <Clock size={20} className="text-slate-500" /> },
  ];

  const actualProgress = 62;
  const expectedProgress = 75;
  const isDelayed = actualProgress < expectedProgress;

  return (
    <div className="p-8 space-y-8 overflow-auto h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.title}</h2>
          <p className="text-slate-500">{t.sub}</p>
        </div>
        <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg">
          <span className="text-sm font-semibold text-indigo-700">{t.deadline}: 2024.12.31</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
              {stat.icon}
            </div>
            <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Progress Widget */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-600" />
            {t.progress} ({t.actual} vs {t.expected})
          </h3>
        </div>

        <div className="relative pt-6 pb-2">
          <div className="flex justify-between text-xs font-bold mb-4">
            <span className="text-indigo-600 flex items-center gap-1">
              <div className="w-3 h-3 bg-indigo-600 rounded-sm"></div> {t.actual} ({actualProgress}%)
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <div className="w-0.5 h-3 bg-slate-300"></div> {t.expected} ({expectedProgress}%)
            </span>
          </div>

          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${isDelayed ? 'bg-amber-500' : 'bg-indigo-600'}`}
              style={{ width: `${actualProgress}%` }}
            ></div>
          </div>

          <div 
            className="absolute top-4 h-8 w-0.5 bg-slate-400 z-10 flex flex-col items-center"
            style={{ left: `${expectedProgress}%` }}
          >
            <div className="w-2 h-2 bg-slate-400 rounded-full -mt-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
