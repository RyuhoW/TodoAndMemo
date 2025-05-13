import sys
import json
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta

class TaskOptimizer:
    def __init__(self):
        self.task_history = []
        self.rest_days = []
        
    def add_daily_data(self, date, completed_tasks, is_rest_day):
        self.task_history.append({
            'date': date,
            'completed_tasks': completed_tasks,
            'is_rest_day': is_rest_day
        })
    
    def analyze_rest_pattern(self):
        if not self.task_history:
            return None
            
        rest_days = [day for day in self.task_history if day['is_rest_day']]
        if len(rest_days) < 2:
            return None
            
        dates = [datetime.strptime(day['date'], '%Y-%m-%d') for day in rest_days]
        rest_intervals = np.diff([(date - datetime(1970, 1, 1)).days for date in dates])
        
        if len(rest_intervals) < 2:
            return None
            
        kmeans = KMeans(n_clusters=min(2, len(rest_intervals)))
        intervals = rest_intervals.reshape(-1, 1)
        kmeans.fit(intervals)
        
        optimal_interval = int(np.median(kmeans.cluster_centers_))
        return optimal_interval
    
    def predict_optimal_tasks(self):
        if not self.task_history:
            return None
            
        work_days = [day for day in self.task_history if not day['is_rest_day']]
        if not work_days:
            return None
            
        completed_tasks = [day['completed_tasks'] for day in work_days]
        
        X = np.array(range(len(completed_tasks))).reshape(-1, 1)
        y = np.array(completed_tasks)
        
        model = LinearRegression()
        model.fit(X, y)
        
        max_tasks = max(completed_tasks)
        predicted = model.predict([[len(completed_tasks)]])[0]
        optimal_tasks = max(0, min(predicted, max_tasks * 1.5))
        
        return round(optimal_tasks)
    
    def get_recommendations(self):
        rest_interval = self.analyze_rest_pattern()
        optimal_tasks = self.predict_optimal_tasks()
        
        return {
            'rest_interval': rest_interval,
            'optimal_tasks': optimal_tasks,
            'total_days': len(self.task_history),
            'work_days': len([day for day in self.task_history if not day['is_rest_day']]),
            'rest_days': len([day for day in self.task_history if day['is_rest_day']])
        }

def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No data provided'}))
        return
        
    try:
        data = json.loads(sys.argv[1])
        optimizer = TaskOptimizer()
        
        for day in data:
            optimizer.add_daily_data(
                day['date'],
                day['completed_tasks'],
                day['is_rest_day']
            )
        
        recommendations = optimizer.get_recommendations()
        print(json.dumps(recommendations))
        
    except Exception as e:
        print(json.dumps({'error': str(e)}))

if __name__ == '__main__':
    main() 