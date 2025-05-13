import React, { useEffect, useState } from 'react';

interface TaskRecommendations {
  rest_interval: number | null;
  optimal_tasks: number | null;
  total_days: number;
  work_days: number;
  rest_days: number;
}

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke(channel: string, ...args: any[]): Promise<any>;
      };
    };
  }
}

const TaskRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<TaskRecommendations | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // タスクデータを取得してPythonスクリプトに送信
      const taskData = await window.electron.ipcRenderer.invoke('get-task-data');
      const result = await window.electron.ipcRenderer.invoke('get-task-recommendations', taskData);
      
      setRecommendations(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '推奨事項の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (loading) {
    return <div>分析中...</div>;
  }

  if (error) {
    return <div className="error">エラー: {error}</div>;
  }

  if (!recommendations) {
    return <div>データが不足しています。より多くのタスクデータを入力してください。</div>;
  }

  return (
    <div className="task-recommendations">
      <h2>タスク最適化の推奨事項</h2>
      
      <div className="recommendation-card">
        <h3>最適な休息間隔</h3>
        {recommendations.rest_interval ? (
          <p>{recommendations.rest_interval}日おきに休息日を設けることをお勧めします</p>
        ) : (
          <p>休息日のパターンを分析するには、より多くのデータが必要です</p>
        )}
      </div>

      <div className="recommendation-card">
        <h3>1日あたりの最適なタスク数</h3>
        {recommendations.optimal_tasks ? (
          <p>1日あたり{recommendations.optimal_tasks}個のタスクを完了することをお勧めします</p>
        ) : (
          <p>最適なタスク数を分析するには、より多くのデータが必要です</p>
        )}
      </div>

      <div className="stats">
        <p>分析期間: {recommendations.total_days}日</p>
        <p>稼働日: {recommendations.work_days}日</p>
        <p>休息日: {recommendations.rest_days}日</p>
      </div>

      <button onClick={fetchRecommendations} className="refresh-button">
        分析を更新
      </button>
    </div>
  );
};

export default TaskRecommendations; 