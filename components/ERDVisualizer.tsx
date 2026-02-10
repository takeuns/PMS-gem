
import React from 'react';
import { User, Layers, CheckSquare, MessageCircle, ArrowRight, Bell } from 'lucide-react';

const ERDVisualizer: React.FC = () => {
  const tables = [
    {
      name: 'USERS',
      icon: <User className="text-blue-500" />,
      fields: ['id (PK)', 'email', 'pwd_hash', 'name', 'role', 'dates'],
      color: 'bg-blue-50 border-blue-200'
    },
    {
      name: 'PROJECTS',
      icon: <Layers className="text-indigo-500" />,
      fields: ['id (PK)', 'name', 'desc', 'start_date', 'end_date', 'created_by (FK)'],
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      name: 'TASKS',
      icon: <CheckSquare className="text-green-500" />,
      fields: ['id (PK)', 'project_id (FK)', 'assignee_id (FK)', 'name', 'status', 'priority', 'progress', 'attachments (JSONB)', 'weight'],
      color: 'bg-green-50 border-green-200'
    },
    {
      name: 'COMMENTS',
      icon: <MessageCircle className="text-purple-500" />,
      fields: ['id (PK)', 'task_id (FK)', 'author_id (FK)', 'content', 'dates'],
      color: 'bg-purple-50 border-purple-200'
    },
    {
      name: 'NOTIFICATIONS',
      icon: <Bell className="text-amber-500" />,
      fields: ['id (PK)', 'recipient_id (FK)', 'task_id (FK)', 'type', 'content', 'is_read', 'created_at'],
      color: 'bg-amber-50 border-amber-200'
    }
  ];

  const relations = [
    { from: 'USERS', to: 'PROJECTS', label: '1 : N (Creator)', desc: '사용자가 프로젝트를 생성합니다.' },
    { from: 'PROJECTS', to: 'TASKS', label: '1 : N', desc: '프로젝트는 여러 하위 업무를 가집니다.' },
    { from: 'USERS', to: 'TASKS', label: '1 : N (Assignee)', desc: '사용자가 업무 담당자로 지정됩니다.' },
    { from: 'TASKS', to: 'COMMENTS', label: '1 : N', desc: '업무별로 자유로운 의견 교환이 가능합니다.' }
  ];

  return (
    <div className="p-8 h-full overflow-auto bg-white">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">ERD Structure Overview (v3.1)</h2>
        <p className="text-slate-500">파일 첨부(JSONB) 기능이 통합된 최신 데이터 구조입니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tables.map((table) => (
            <div key={table.name} className={`p-4 rounded-xl border-2 shadow-sm ${table.color} flex flex-col gap-3 transition-transform hover:scale-[1.02]`}>
              <div className="flex items-center gap-2 border-b pb-2">
                {table.icon}
                <span className="font-bold text-slate-700">{table.name}</span>
              </div>
              <ul className="text-xs space-y-1.5 font-mono text-slate-600">
                {table.fields.map(field => (
                  <li key={field} className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <ArrowRight size={20} className="text-indigo-500" />
            File Storage Logic
          </h3>
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
            <p className="text-xs text-indigo-700 leading-relaxed">
              업무별 파일 첨부는 <code className="bg-indigo-100 px-1 rounded">JSONB</code> 타입을 사용하여 유연성을 확보했습니다. 
              파일의 원본 파일명, S3 경로(URL), 파일 크기, 업로드 시간 등의 메타데이터를 배열 형태로 저장하여 별도의 매핑 테이블 없이 빠른 조회가 가능합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERDVisualizer;
