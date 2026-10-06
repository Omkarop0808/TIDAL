import cv2
import numpy as np
from ultralytics import YOLO
from google import genai
from google.genai import types
import os
import json
import base64
from groq import Groq

class VisionService:
    def __init__(self):
        # We load a small YOLOv8/11 model. YOLOv8n is fast.
        self.model = YOLO('yolov8n.pt') 

    def apply_clahe(self, image: np.ndarray) -> np.ndarray:
        """
        Apply Contrast Limited Adaptive Histogram Equalization (CLAHE)
        to improve low-visibility underwater/marine images.
        """
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl, a, b))
        return cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)

    def detect_debris(self, image_path: str):
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Image not found")
            
        enhanced_img = self.apply_clahe(img)
        results = self.model(enhanced_img)[0]
        
        boxes = []
        for box in results.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            label = results.names[cls_id]
            
            if label in ['bottle', 'cup', 'frisbee', 'backpack', 'umbrella']:
                label = f"Debris ({label})"
                
            boxes.append({
                "label": label,
                "confidence": conf,
                "box_2d": [int(y1), int(x1), int(y2), int(x2)]
            })
            
        return {
            "item_count": len(boxes),
            "bounding_boxes": boxes,
            "enhanced_image_used": True
        }

    def analyze_material_gemini(self, image_path: str):
        """
        Use Gemini 2.5 Flash for material analysis. Fallback to Groq Llama-3.2-Vision on failure/load.
        """
        prompt = '''
        Analyze this image of marine debris. 
        Provide a JSON response with exactly these keys:
        - "composition": string describing the main materials.
        - "category": one of ["Highly Recyclable", "Upcyclable", "Residual/Mixed"].
        - "matched_upcycler": name of an organization that processes this.
        - "estimated_weight_kg": integer estimate of weight.
        Ensure output is strictly JSON.
        '''

        # Try Gemini First
        try:
            client = genai.Client()
            genai_file = client.files.upload(file=image_path)
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=[genai_file, prompt],
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            client.files.delete(name=genai_file.name)
            return response.text
        except Exception as gemini_err:
            print(f"Gemini failed, falling back to Groq: {gemini_err}")
            
            # Fallback to Groq
            try:
                groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
                with open(image_path, "rb") as image_file:
                    base64_image = base64.b64encode(image_file.read()).decode('utf-8')
                    
                completion = groq_client.chat.completions.create(
                    model="llama-3.2-11b-vision-preview",
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": prompt},
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": f"data:image/jpeg;base64,{base64_image}",
                                    }
                                }
                            ]
                        }
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.1
                )
                return completion.choices[0].message.content
            except Exception as groq_err:
                print(f"Groq fallback also failed: {groq_err}")
                raise

vision_service = VisionService()
