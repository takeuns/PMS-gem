
import React, { useState, useMemo } from 'react';
import { Clock, User, CheckCircle2, MoreHorizontal, GripVertical, Filter, X, Calendar, Search, AlertCircle } from 'lucide-react';
import { Language } from '../App';

type TaskStatus = 'todo' | 'inprogress' | 'review' | 'done';
type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

interface KanbanTask {
  id: string;
  title: string;
  assignee: string;
  avatar: string;
  deadline: string;
  progress: number;
  status: TaskStatus;
  priority: TaskPriority;
}

const INITIAL_TASKS: KanbanTask[] = [
  { id: 'k1', title: '사용자 인증 모듈 아키텍처 설계', assignee: '김철수', avatar: 'https://ui-avatars.com/api/?name=Chulsu+Kim&background=random', deadline: '2023-11-20', progress: 30, status: 'inprogress', priority: 'HIGH' },
  { id: 'k2', title: 'DB 마이그레이션 스크립트 작성', assignee: '이영희', avatar: 'https://ui-avatars.com/api/?name=Younghee+Lee&background=random', deadline: '2023-11-15', progress: 0, status: 'todo', priority: 'MEDIUM' },
  { id: 'k3', title: '메인 대시보드 UI 컴포넌트 개발', assignee: '박지민', avatar: 'https://ui-avatars.com/api/?name=Jimin+Park&background=random', deadline: '2023-11-18', progress: 85, status: 'review', priority: 'MEDIUM' },
  { id: 'k4', title: 'API 문서 자동화 설정 (Swagger)', assignee: '최민서', avatar: 'https://ui-avatars.com/api/?name=Minseo+Choi&background=random', deadline: '2023-11-10', progress: 100, status: 'done', priority: 'LOW' },
  { id: 'k5', title: '단위 테스트 시나리오 작성', assignee: '김철수', avatar: 'https://ui-avatars.com/api/?name=Chulsu+Kim&background=random', deadline: '2023-11-25', progress: 10, status: 'todo', priority: 'HIGH' },
];

const kanbanTranslations = {
  ko: { todo: '할 일', inprog: '진행 중', review: '검토 중', done: '완료', add: '+ 새 업무 추가', filter: '필터', assignee: '담당자', all: '전체', deadline: '마감일', clear: '초기화', search: '검색...', priority: '중요도', high: '높음', medium: '보통', low: '낮음' },
  en: { todo: 'To-do', inprog: 'In Progress', review: 'Review', done: 'Done', add: '+ Add New Task', filter: 'Filter', assignee: 'Assignee', all: 'All', deadline: 'Deadline', clear: 'Clear', search: 'Search...', priority: 'Priority', high: 'High', medium: 'Medium', low: 'Low' },
  zh: { todo: '待办', inprog: '进行中', review: '审核中', done: '已完成', add: '+ 添加新任务', filter: '过滤', assignee: '负责人', all: '全部', deadline: '截止日期', clear: '清除', search: '搜索...', priority: '优先级', high: '高', medium: '中', low: '低' },
  th: { todo: 'ที่ต้องทำ', inprog: 'กำลังทำ', review: 'ตรวจสอบ', done: 'เสร็จสิ้น', add: '+ เพิ่มงานใหม่', filter: 'กรอง', assignee: 'ผู้รับผิดชอบ', all: 'ทั้งหมด', deadline: 'กำหนดการ', clear: 'ล้างค่า', search: 'ค้นหา...', priority: 'ความสำคัญ', high: 'สูง', medium: 'กลาง', low: 'ต่ำ' },
  lo: { todo: 'ທີ່ຕ້ອງເຮັດ', inprog: 'ກຳລັງເຮັດ', review: 'ກວດສອບ', done: 'ສຳເລັດ', add: '+ ເພີ່ມວຽກໃໝ່', filter: 'ການກັ່ນຕອງ', assignee: 'ຜູ້ຮັບຜິດຊອບ', all: 'ທັງໝົດ', deadline: 'ກຳນົດສົ່ງ', clear: 'ລ້າງ', search: 'ຄົ້ນຫາ...', priority: 'ຄວາມສຳຄັນ', high: 'ສູງ', medium: 'ກາງ', low: 'ຕ່ຳ' }
};

interface Props {
  lang: Language;
}

const KanbanBoard: React.FC<Props> = ({ lang }) => {
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  
  // Filtering states
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus[]>(['todo', 'inprogress', 'review', 'done']);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const kt = kanbanTranslations[lang];

  const uniqueAssignees = useMemo(() => {
    const set = new Set(INITIAL_TASKS.map(t => t.assignee));
    return Array.from(set);
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchAssignee = assigneeFilter === 'all' || task.assignee === assigneeFilter;
      const matchPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchStatus = statusFilter.includes(task.status);
      const matchSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
      
      const taskDate = new Date(task.deadline);
      const matchDate = (!startDate || taskDate >= new Date(startDate)) && 
                        (!endDate || taskDate <= new Date(endDate));

      return matchAssignee && matchPriority && matchStatus && matchSearch && matchDate;
    });
  }, [tasks, assigneeFilter, priorityFilter, statusFilter, startDate, endDate, searchQuery]);

  const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'todo', label: kt.todo, color: 'bg-slate-100 text-slate-700' },
    { id: 'inprogress', label: kt.inprog, color: 'bg-indigo-50 text-indigo-700' },
    { id: 'review', label: kt.review, color: 'bg-amber-50 text-amber-700' },
    { id: 'done', label: kt.done, color: 'bg-green-50 text-green-700' },
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggingTaskId(taskId);
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status, progress: status === 'done' ? 100 : t.progress } : t));
    setDraggingTaskId(null);
  };

  const clearFilters = () => {
    setAssigneeFilter('all');
    setPriorityFilter('all');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    setStatusFilter(['todo', 'inprogress', 'review', 'done']);
  };

  const toggleStatusFilter = (status: TaskStatus) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  const priorityColors = {
    HIGH: 'text-red-600 bg-red-50',
    MEDIUM: 'text-amber-600 bg-amber-50',
    LOW: 'text-green-600 bg-green-50'
  };

  return (
    <div className="p-8 flex flex-col h-full bg-slate-50/50 overflow-hidden">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{kt.todo} {kt.inprog} {kt.review} {kt.done}</h2>
          <p className="text-xs text-slate-500 mt-1">{filteredTasks.length} tasks matching current filters</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
              showFilters ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
            }`}
          >
            <Filter size={16} /> {kt.filter}
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-all">
            {kt.add}
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      {showFilters && (
        <div className="mb-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <Search size={12} /> {kt.search}
              </label>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={kt.search}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            {/* Assignee Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <User size={12} /> {kt.assignee}
              </label>
              <select 
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none"
              >
                <option value="all">{kt.all}</option>
                {uniqueAssignees.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <AlertCircle size={12} /> {kt.priority}
              </label>
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none"
              >
                <option value="all">{kt.all}</option>
                <option value="HIGH">{kt.high}</option>
                <option value="MEDIUM">{kt.medium}</option>
                <option value="LOW">{kt.low}</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2 md:col-span-2 lg:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                <Calendar size={12} /> {kt.deadline}
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
                <span className="text-slate-300">~</span>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
                <button 
                  onClick={clearFilters}
                  className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 border border-slate-200 rounded-lg"
                  title={kt.clear}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Status Visibility Toggles */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
            {COLUMNS.map(col => (
              <button
                key={col.id}
                onClick={() => toggleStatusFilter(col.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  statusFilter.includes(col.id) 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {col.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Board Columns */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
        {COLUMNS.filter(c => statusFilter.includes(c.id)).map(column => (
          <div 
            key={column.id} 
            className="flex-1 min-w-[300px] flex flex-col bg-slate-200/40 rounded-2xl border border-slate-200/60"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className={`p-4 rounded-t-2xl flex justify-between items-center border-b border-slate-200/80 ${column.color}`}>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">{column.label}</h3>
                <span className="bg-white/40 px-2 py-0.5 rounded-full text-[10px] font-black">
                  {filteredTasks.filter(t => t.status === column.id).length}
                </span>
              </div>
              <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={16} /></button>
            </div>
            <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[100px]">
              {filteredTasks.filter(t => t.status === column.id).map(task => (
                <div 
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-all group ${draggingTaskId === task.id ? 'opacity-40' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col gap-1.5">
                      <span className={`w-fit px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${priorityColors[task.priority]}`}>
                        {kt[task.priority.toLowerCase() as keyof typeof kt]}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                    </div>
                    <GripVertical size={14} className="text-slate-200 group-hover:text-slate-400 shrink-0" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <img src={task.avatar} alt={task.assignee} className="w-5 h-5 rounded-full" />
                    <span className="text-[10px] font-medium text-slate-500">{task.assignee}</span>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock size={12} />
                      {task.deadline}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${task.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} 
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{task.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredTasks.filter(t => t.status === column.id).length === 0 && (
                <div className="h-20 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs italic">
                  Empty
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
