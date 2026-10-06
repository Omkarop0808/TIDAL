import sqlite3
import json
from datetime import datetime
import os

class StoreService:
    def __init__(self, db_path="tidal_state.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Environment snapshots
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS env_snapshots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            data_json TEXT
        )
        ''')
        
        # Field reports (images/observations)
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS field_reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            composition TEXT,
            estimated_weight_kg REAL,
            category TEXT,
            matched_upcycler TEXT,
            item_count INTEGER,
            image_path TEXT
        )
        ''')
        
        # ML Model Runs
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS model_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            mae REAL,
            r2 REAL,
            samples INTEGER
        )
        ''')
        
        conn.commit()
        conn.close()

    def save_env_snapshot(self, data: dict):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO env_snapshots (data_json) VALUES (?)", (json.dumps(data),))
        conn.commit()
        conn.close()

    def save_field_report(self, ai_analysis: dict, matched_upcycler: str, image_path: str = ""):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
        INSERT INTO field_reports (composition, estimated_weight_kg, category, matched_upcycler, item_count, image_path)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            ai_analysis.get("composition", "Unknown"),
            float(ai_analysis.get("estimated_weight_kg", 0)),
            ai_analysis.get("category", "Unknown"),
            matched_upcycler,
            int(ai_analysis.get("item_count", 0)),
            image_path
        ))
        conn.commit()
        conn.close()
        
    def save_model_run(self, metrics: dict):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
        INSERT INTO model_runs (mae, r2, samples)
        VALUES (?, ?, ?)
        ''', (
            float(metrics.get("mae", 0)),
            float(metrics.get("r2", 0)),
            int(metrics.get("samples", 0))
        ))
        conn.commit()
        conn.close()

store_service = StoreService()
