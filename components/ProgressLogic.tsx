
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Calculator, Clock, AlertCircle, Plus, Trash2, Weight } from 'lucide-react';

interface TaskLogicData {
  id: string;
  name: string;
  weight: number;
  progress: number;
  duration: number;
}

const ProgressLogic: React.FC = () => {
  const [projectDaysElapsed, setProjectDaysElapsed] = useState(15);
  const [tasks, setTasks] = useState<TaskLogicData[]>([
    { id: '1', name: 'UI Design', weight: 1, progress: 80, duration: 20 },
    { id: '2', name: 'API Development', weight: 3, progress: 30, duration: 40 },
    { id: '3', name: 'Database Setup', weight: 2, progress: 100, duration: 10 },
  ]);

  const addTask = () => {
    const newId = (tasks.length + 1).toString();
    setTasks([...tasks, { id: newId, name: `New Task ${newId}`, weight: 1, progress: 0, duration: 30 }]);
  };

  const removeTask = (id: string) => {
    if (tasks.length <= 1) return;
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = (id: string, field: keyof TaskLogicData, value: string | number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const projectSummary = useMemo(() => {
    let totalWeight = 0;
    let weightedActualProgress = 0;
    let weightedExpectedProgress = 0;

    const taskResults = tasks.map(task => {
      const expected = Math.min(100, Math.round((projectDaysElapsed / task.duration) * 100));
      totalWeight += task.weight;
      weightedActualProgress += (task.progress * task.weight);
      weightedExpectedProgress += (expected * task.weight);

      const gap = task.progress - expected;
      let status = '정상';
      let color = 'text-green-600';
      if (gap < -15) { status = '위험'; color = 'text-red-600'; }
      else if (gap < 0) { status = '지연'; color = 'text-amber-600'; }

      return { ...task, expected, gap, status, color };
    });

    const totalActual = totalWeight > 0 ? Math.round(weightedActualProgress / totalWeight) : 0;
    const totalExpected = totalWeight > 0 ? Math.round(weightedExpectedProgress / totalWeight) : 0;
    const totalGap = totalActual - totalExpected;

    return { taskResults, totalActual, totalExpected, totalGap, totalWeight };
  }, [tasks, projectDaysElapsed]);

  const chartData = useMemo(() => {
    const data = projectSummary.taskResults.map(t => ({
      name: t.name,
      '실제 진행률': t.progress,
      '예상 진행률': t.expected,
    }));
    
    // Add Total to Chart
    data.push({
      name: '전체 요약 (Weighted)',
      '실제 진행률': projectSummary.totalActual,
      '예상 진행률': projectSummary.totalExpected,
    });
    
    return data;
  }, [projectSummary]);

  return (
    <div className="p-8 h-full overflow-auto bg-white flex flex-col gap-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">가중치 기반 진행률 관리 로직</h2>
          <p className="text-slate-500">개별 업무의 가중치(Weight)를 반영한 전체 프로젝트 진행률 시뮬레이션입니다.</p>
        </div>
        <div className="bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-lg text-center">
          <div className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">전체 가중치 합산 진행률</div>
          <div className="text-3xl font-black">{projectSummary.totalActual}%</div>
          <div className="text-xs mt-1">목표 대비: {projectSummary.totalGap >= 0 ? '+' : ''}{projectSummary.totalGap}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Task Editor */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calculator size={16} /> 업무별 가중치 및 실적 설정
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-500">프로젝트 경과:</span>
                  <input 
                    type="number" 
                    value={projectDaysElapsed} 
                    onChange={(e) => setProjectDaysElapsed(Number(e.target.value))}
                    className="w-12 text-center text-sm font-bold text-indigo-600 outline-none"
                  />
                  <span className="text-xs text-slate-400">일</span>
                </div>
                <button 
                  onClick={addTask}
                  className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {tasks.map((task) => {
                const result = projectSummary.taskResults.find(r => r.id === task.id);
                return (
                  <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 group">
                    <div className="flex justify-between items-center">
                      <input 
                        className="font-bold text-slate-700 outline-none border-b border-transparent focus:border-indigo-300 transition-colors"
                        value={task.name}
                        onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                      />
                      <button 
                        onClick={() => removeTask(task.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Weight size={10} /> 가중치 (Weight)
                        </label>
                        <input 
                          type="number"
                          min="1"
                          max="10"
                          value={task.weight}
                          onChange={(e) => updateTask(task.id, 'weight', Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 text-sm font-bold text-slate-600 outline-none focus:ring-1 focus:ring-indigo-500/20"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Clock size={10} /> 업무 기간 (Days)
                        </label>
                        <input 
                          type="number"
                          min="1"
                          value={task.duration}
                          onChange={(e) => updateTask(task.id, 'duration', Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 text-sm font-bold text-slate-600 outline-none focus:ring-1 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">실제 진행률</label>
                        <span className={`text-xs font-black ${result?.color}`}>{task.progress}% ({result?.status})</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={task.progress}
                        onChange={(e) => updateTask(task.id, 'progress', Number(e.target.value))}
                        className="w-full h-1.5 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Charts and Logic Description */}
        <div className="flex flex-col gap-6">
          <div className="h-[400px] bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col">
            <h3 className="text-sm font-bold text-slate-600 mb-4 flex items-center gap-2">
              <BarChart size={18} className="text-indigo-600" />
              업무별 진행 현황 (실제 vs 예상)
            </h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 600 }} />
                  <Bar dataKey="예상 진행률" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="실제 진행률" radius={[4, 4, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#4f46e5' : '#818cf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <Calculator size={18} />
                진행률 산출 공식
              </div>
              <div className="bg-white/50 p-3 rounded-xl font-mono text-[10px] text-indigo-700 leading-relaxed">
                Total Progress = <br/>
                &Sigma;(Task Progress * Task Weight) <br/>
                --------------------------- <br/>
                &Sigma;(Task Weights)
              </div>
              <p className="text-[10px] text-indigo-600 leading-relaxed italic">
                * 각 업무의 중요도(Weight)가 높을수록 전체 진행률에 미치는 영향력이 커집니다.
              </p>
            </div>

            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertCircle size={18} />
                상태 판별 기준
              </div>
              <ul className="text-[11px] text-amber-800 space-y-2">
                <li className="flex justify-between">
                  <span className="font-bold">정상 (Healthy)</span>
                  <span>Gap &ge; 0%</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-bold">지연 (Delayed)</span>
                  <span>Gap &gt; -15%</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-bold">위험 (Critical)</span>
                  <span>Gap &le; -15%</span>
                </li>
              </ul>
              <p className="text-[10px] text-amber-600 leading-relaxed border-t border-amber-200 pt-2">
                Gap = 실제 진행률 - 예상 진행률
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressLogic;
