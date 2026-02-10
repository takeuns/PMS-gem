
import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const Timeline: React.FC = () => {
  // Simple mock of task schedule
  const schedule = [
    { name: '요구사항 정의', start: 0, width: 15, status: 'done' },
    { name: 'DB 설계', start: 10, width: 20, status: 'done' },
    { name: '백엔드 API 개발', start: 25, width: 40, status: 'active' },
    { name: '프론트엔드 UI 구축', start: 30, width: 35, status: 'active' },
    { name: '통합 테스트', start: 60, width: 25, status: 'pending' },
    { name: '인프라 배포', start: 80, width: 15, status: 'pending' },
  ];

  const months = ['10월', '11월', '12월', '1월'];

  return (
    <div className="p-8 h-full flex flex-col gap-6 overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">전체 일정 보기</h2>
          <p className="text-slate-500">프로젝트 타임라인 및 간트 차트</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button className="p-1.5 hover:bg-white rounded shadow-sm transition-all"><ChevronLeft size={16} /></button>
            <span className="px-4 py-1.5 text-xs font-bold text-slate-600">2023 - 2024</span>
            <button className="p-1.5 hover:bg-white rounded shadow-sm transition-all"><ChevronRight size={16} /></button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md">
            <Calendar size={16} /> 일정 추가
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 overflow-auto relative">
        {/* Timeline Header */}
        <div className="sticky top-0 z-20 flex bg-white border-b border-slate-200 min-w-[800px]">
          <div className="w-48 p-4 font-bold text-xs text-slate-400 uppercase tracking-widest bg-slate-50/50 sticky left-0 z-30 border-r border-slate-200">Task Name</div>
          <div className="flex-1 flex">
            {months.map(m => (
              <div key={m} className="flex-1 p-4 text-center text-xs font-bold text-slate-500 border-r border-slate-100 last:border-0">{m}</div>
            ))}
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="min-w-[800px] pb-8">
          {schedule.map((task, i) => (
            <div key={i} className="flex border-b border-slate-100 group hover:bg-white transition-colors">
              {/* Name column */}
              <div className="w-48 p-4 text-sm font-semibold text-slate-700 bg-slate-50/30 group-hover:bg-indigo-50/30 sticky left-0 z-10 border-r border-slate-200 truncate">
                {task.name}
              </div>
              
              {/* Timeline column */}
              <div className="flex-1 relative h-14">
                {/* Horizontal Guide Lines */}
                <div className="absolute inset-0 flex">
                  {[1, 2, 3].map(g => <div key={g} className="flex-1 border-r border-slate-200/50 last:border-0"></div>)}
                </div>

                {/* Task Bar */}
                <div 
                  className={`absolute top-3 h-8 rounded-lg shadow-sm flex items-center px-3 transition-all cursor-pointer group-hover:shadow-md ${
                    task.status === 'done' ? 'bg-green-500' : 
                    task.status === 'active' ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                  style={{ 
                    left: `${task.start}%`, 
                    width: `${task.width}%` 
                  }}
                >
                  <span className={`text-[10px] font-bold truncate ${task.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>
                    {task.status === 'active' ? '진행중' : task.status === 'done' ? '완료' : '대기'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Current Day Line */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)] z-10" style={{ left: 'calc(48px + 45%)' }}>
            <div className="absolute top-0 -left-1 w-2.5 h-2.5 bg-red-400 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 text-xs font-medium text-slate-400 justify-center">
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> 완료됨</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-indigo-600 rounded-sm"></div> 진행중</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-200 rounded-sm"></div> 대기중</span>
      </div>
    </div>
  );
};

export default Timeline;
