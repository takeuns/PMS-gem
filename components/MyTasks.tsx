
import React, { useState, useRef } from 'react';
import { 
  Share2, 
  User, 
  Clock, 
  CheckCircle, 
  Save, 
  MessageSquare, 
  Send, 
  Trash2, 
  Edit3, 
  X, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Paperclip,
  Download,
  PlusCircle,
  FileCode,
  Image as ImageIcon
} from 'lucide-react';
import { Attachment } from '../types';

interface Comment {
  id: string;
  taskId: string;
  author: string;
  content: string;
  timestamp: string;
  isEditing?: boolean;
}

interface TaskItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'pending' | 'active' | 'done';
  attachments: Attachment[];
}

const MyTasks: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([
    { 
      id: '1', 
      name: '로그인 API 고도화', 
      startDate: '2023-11-01', 
      endDate: '2023-11-15', 
      progress: 45, 
      status: 'active',
      attachments: [
        { id: 'a1', name: 'API_Specs_v1.pdf', url: '#', size: '1.2MB', type: 'application/pdf', uploadedAt: '2023-11-02' }
      ]
    },
    { 
      id: '2', 
      name: 'DB 인덱스 최적화', 
      startDate: '2023-11-10', 
      endDate: '2023-11-20', 
      progress: 10, 
      status: 'active',
      attachments: []
    },
    { 
      id: '3', 
      name: 'QA 버그 수정 (UI)', 
      startDate: '2023-10-25', 
      endDate: '2023-11-05', 
      progress: 100, 
      status: 'done',
      attachments: [
        { id: 'a2', name: 'error_screenshot.png', url: '#', size: '450KB', type: 'image/png', uploadedAt: '2023-10-31' }
      ]
    },
  ]);

  const [comments, setComments] = useState<Record<string, Comment[]>>({
    '1': [
      { id: 'c1', taskId: '1', author: '이관리 (Admin)', content: 'OAuth2.0 연동 부분 보안 검토 부탁드립니다.', timestamp: '2023-11-02 14:20' },
    ],
    '2': [],
    '3': []
  });

  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'comments' | 'attachments'>('comments');
  const [newComment, setNewComment] = useState<string>('');
  const [notified, setNotified] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const handleProgressChange = (id: string, value: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, progress: value, status: value === 100 ? 'done' : 'active' } : t));
  };

  const handleShare = (taskName: string) => {
    setNotified(`'${taskName}' 상태가 팀원들에게 공유되었습니다.`);
    setTimeout(() => setNotified(null), 3000);
  };

  const toggleExpanded = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    setActiveTab('comments');
  };

  const addComment = (taskId: string) => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      taskId,
      author: '김개발 (Developer)',
      content: newComment,
      timestamp: new Date().toLocaleString('ko-KR', { hour12: false }).replace(/\./g, '-').slice(0, -3),
    };
    setComments(prev => ({
      ...prev,
      [taskId]: [...(prev[taskId] || []), comment]
    }));
    setNewComment('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    const file = e.target.files?.[0];
    if (!file || !taskId) return;

    const newAttachment: Attachment = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: '#',
      size: (file.size / 1024 / 1024).toFixed(2) + 'MB',
      type: file.type,
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, attachments: [...t.attachments, newAttachment] } : t));
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    setNotified(`'${file.name}' 파일이 업로드되었습니다.`);
    setTimeout(() => setNotified(null), 3000);
  };

  const deleteAttachment = (taskId: string, attachmentId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, attachments: t.attachments.filter(a => a.id !== attachmentId) } : t));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <ImageIcon size={18} className="text-blue-500" />;
    if (type.includes('pdf')) return <FileText size={18} className="text-red-500" />;
    if (type.includes('zip') || type.includes('compressed')) return <Paperclip size={18} className="text-amber-500" />;
    return <FileCode size={18} className="text-slate-500" />;
  };

  return (
    <div className="p-8 h-full overflow-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">내 업무 관리</h2>
          <p className="text-slate-500">할당된 업무 정보와 첨부파일, 협업 이력을 확인합니다.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-slate-600 text-sm font-medium">
          <User size={16} /> 김개발 (Developer)
        </div>
      </div>

      {notified && (
        <div className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 z-[100] fixed top-24 right-8">
          <CheckCircle size={20} />
          <span className="font-medium text-sm">{notified}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 pb-10">
        {tasks.map(task => (
          <div key={task.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:border-indigo-200 transition-all flex flex-col">
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-800 text-lg">{task.name}</h3>
                  {task.progress === 100 && <CheckCircle size={18} className="text-green-500" />}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><Clock size={14} /> {task.startDate} ~ {task.endDate}</span>
                  <span className={`px-2 py-0.5 rounded-full uppercase ${task.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {task.status}
                  </span>
                  <span className="flex items-center gap-1"><Paperclip size={14} /> {task.attachments.length} files</span>
                </div>
              </div>

              <div className="w-full md:w-64 space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>진행률</span>
                  <span className="text-indigo-600">{task.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={task.progress}
                  onChange={(e) => handleProgressChange(task.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleShare(task.name)}
                  className="p-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl transition-all"
                  title="Share status"
                >
                  <Share2 size={18} />
                </button>
                <button 
                  onClick={() => toggleExpanded(task.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    expandedTaskId === task.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Details
                  {expandedTaskId === task.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            </div>

            {expandedTaskId === task.id && (
              <div className="bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                {/* Tabs */}
                <div className="flex px-6 border-b border-slate-200">
                  <button 
                    onClick={() => setActiveTab('comments')}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'comments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                  >
                    Comments ({comments[task.id]?.length || 0})
                  </button>
                  <button 
                    onClick={() => setActiveTab('attachments')}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'attachments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                  >
                    Attachments ({task.attachments.length})
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === 'comments' ? (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {comments[task.id]?.length > 0 ? (
                          comments[task.id].map(comment => (
                            <div key={comment.id} className="flex gap-4 group">
                              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 font-bold text-xs uppercase">
                                {comment.author.charAt(0)}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-700">{comment.author}</span>
                                    <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-slate-600 bg-white p-3 rounded-xl rounded-tl-none border border-slate-200 inline-block max-w-2xl">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-slate-400 text-sm italic">No comments yet.</div>
                        )}
                      </div>
                      <div className="flex gap-4 items-start pt-4 border-t border-slate-200">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 p-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none shadow-sm"
                          rows={2}
                        />
                        <button
                          onClick={() => addComment(task.id)}
                          disabled={!newComment.trim()}
                          className={`p-3 rounded-xl transition-all ${newComment.trim() ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300'}`}
                        >
                          <Send size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Shared Files</h4>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                        >
                          <PlusCircle size={14} /> Upload File
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, task.id)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {task.attachments.length > 0 ? (
                          task.attachments.map(att => (
                            <div key={att.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between group hover:border-indigo-300 transition-all shadow-sm">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                                  {getFileIcon(att.type)}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm font-bold text-slate-700 truncate">{att.name}</span>
                                  <span className="text-[10px] text-slate-400">{att.size} • {att.uploadedAt}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-slate-400 hover:text-indigo-600" title="Download">
                                  <Download size={16} />
                                </button>
                                <button 
                                  onClick={() => deleteAttachment(task.id, att.id)}
                                  className="p-2 text-slate-400 hover:text-red-500" 
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 py-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                            <Paperclip size={32} strokeWidth={1} className="mb-2" />
                            <p className="text-xs font-medium uppercase tracking-widest">No attachments found</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTasks;
