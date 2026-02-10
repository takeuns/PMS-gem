
import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, Radio } from 'lucide-react';

const PythonBackend: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const pythonCode = `from datetime import date, datetime, timedelta
from typing import List, Dict, Optional
from pydantic import BaseModel
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks

app = FastAPI(title="Project Management API with Real-time Notifications")

# --- WebSocket Manager ---

class ConnectionManager:
    def __init__(self):
        # user_id: active_websocket_connection
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)

    async def broadcast(self, message: dict):
        for connection in self.active_connections.values():
            await connection.send_json(message)

manager = ConnectionManager()

# --- Models ---

class NotificationEvent(BaseModel):
    user_id: str
    type: str # 'assignment', 'comment', 'deadline'
    message: str

# --- Real-time Endpoints ---

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            # 유지 관리를 위한 대기 (Keep-alive)
            data = await websocket.receive_text()
            # 클라이언트로부터 수신된 에코 처리 등
    except WebSocketDisconnect:
        manager.disconnect(user_id)

# --- Business Logic Triggers ---

async def trigger_notification(event: NotificationEvent):
    """특정 상황 발생 시 WebSocket을 통해 알림 푸시"""
    payload = {
        "id": datetime.now().strftime("%Y%m%d%H%M%S"),
        "type": event.type,
        "message": event.message,
        "timestamp": "방금 전",
        "isRead": False
    }
    await manager.send_personal_message(payload, event.user_id)

@app.post("/tasks/{task_id}/assign")
async def assign_task(task_id: str, assignee_id: str):
    # 1. DB 업데이트 로직 (생략)
    # 2. 실시간 알림 전송
    await trigger_notification(NotificationEvent(
        user_id=assignee_id,
        type="assignment",
        message=f"새로운 업무(ID: {task_id})의 담당자로 지정되었습니다."
    ))
    return {"status": "ok"}

@app.post("/tasks/{task_id}/comments")
async def create_comment(task_id: str, author_name: str, assignee_id: str):
    # 1. DB 저장 로직 (생략)
    # 2. 담당자에게 알림 전송 (작성자가 담당자가 아닐 경우)
    await trigger_notification(NotificationEvent(
        user_id=assignee_id,
        type="comment",
        message=f"{author_name}님이 담당 업무에 새로운 댓글을 남겼습니다."
    ))
    return {"status": "ok"}

# --- Background Task (Deadline Check) ---

def check_deadlines_job():
    """스케줄러에 의해 주기적으로 호출되는 가상의 함수"""
    # 1. 마감 기한이 1일 남은 업무 조회
    # 2. 각 담당자에게 알림 전송
    # for task in tasks_near_deadline:
    #     await trigger_notification(...)
    pass
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="bg-slate-800 p-4 flex justify-between items-center text-white border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Terminal size={18} className="text-indigo-400" />
          <h2 className="font-semibold text-sm">main.py (WebSocket & Notifications)</h2>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-md transition-all text-xs font-medium shadow-lg"
        >
          {copied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
          {copied ? '복사 완료!' : '코드 복사하기'}
        </button>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="p-6">
            <div className="mb-4 bg-indigo-900/30 border border-indigo-500/30 p-4 rounded-xl text-indigo-200 text-xs leading-relaxed">
                <p className="font-bold mb-1 flex items-center gap-2 text-indigo-400">
                    <Radio size={14} className="animate-pulse" /> WebSocket Implementation
                </p>
                이 코드는 <b>WebSocket</b>을 통해 클라이언트와 지속적인 연결을 유지하며, 
                담당자 지정, 댓글 등록, 마감 기한 임박 시 <b>실시간 푸시 알림</b>을 전송합니다.
            </div>
            <pre className="font-mono text-sm text-indigo-300 leading-relaxed whitespace-pre">
            {pythonCode}
            </pre>
        </div>
      </div>
    </div>
  );
};

export default PythonBackend;
