from fastapi import WebSocket, WebSocketDisconnect
from typing import List
import json
import asyncio
from services.environment import env_service

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        # Send initial data immediately upon connection
        current_data = env_service.get_current_data()
        if current_data:
            await self.send_personal_message(json.dumps({"type": "ENV_UPDATE", "payload": current_data}), websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except Exception:
            pass

    async def broadcast(self, message: str):
        for connection in list(self.active_connections):
            try:
                await connection.send_text(message)
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()

async def live_data_broadcaster():
    """Background task to fetch live data and broadcast it to connected websockets."""
    while True:
        # Fetch data every 60 seconds (rate limits permitting)
        new_data = await env_service.fetch_live_data()
        if new_data:
            await manager.broadcast(json.dumps({
                "type": "ENV_UPDATE",
                "payload": new_data
            }))
        await asyncio.sleep(60)
