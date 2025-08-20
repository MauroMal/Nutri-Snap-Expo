![Logo](/assets/images/NutriSnapLogo-2.png)
# NutriSnap

NutriSnap is a mobile nutrition tracking app built with Expo, React Native, TypeScript, and Supabase. Users can snap a picture of their meal, detect the food, fetch nutritional data, and log it to track daily and weekly macro intake.

<p>
  <img src="/assets/images/Welcome.jpeg" width="120"/>
  <img src="/assets/images/SearchView.jpeg" width="120"/>
  <img src="/assets/images/CameraScreen.jpeg" width="120"/>
  <img src="/assets/images/ImageView.jpeg" width="120"/>
  <img src="/assets/images/PastaDetected.jpeg" width="120"/>
  <img src="/assets/images/CookiesDetected.jpeg" width="120"/>
  <img src="/assets/images/FoodLog.jpeg" width="120"/>
</p>

## Features

- Image-based food recognition using a YOLOv5 Flask API written in Python  
- Nutrition search via the USDA API with macros per 100g  
- Donut charts and weekly bar charts for calorie and macro tracking  
- User authentication using Supabase (email and Google)  
- Custom nutrition thresholds editable from the Profile screen  
- Secure data storage with Supabase and row-level security  
- Visual feedback with nutrient color coding based on limits  

## Tech Stack

- Frontend: Expo, React Native, TypeScript, NativeWind  
- Backend: Supabase (PostgreSQL, RLS, Auth)  
- Machine Learning: Python, Flask, YOLOv5  
- Visualization: react-native-gifted-charts  

## Python Usage

- A Flask server built with Python handles image uploads  
- The server runs a YOLOv5 model trained on food-specific datasets  
- Detected food labels are returned to the app for logging  
- Nutrition data is matched using the USDA API after detection  
- The backend can be extended with additional Python scripts for preprocessing, model retraining, or analytics  

### Python Libraries Used

- `flask`: to create the API server  
- `torch`: to load and run the YOLOv5 model  
- `Pillow`: to handle and preprocess images  
- `werkzeug`: used under the hood by Flask for request and file handling  

## Supabase Tables

### auth.users (default)
Used for authentication, automatically managed by Supabase.

### profiles
Stores user profile data and default nutrient limits.

id (uuid, primary key, references auth.users.id)  
full_name (text)  
calories_limit (integer)  
protein_limit (integer)  
carbs_limit (integer)  
fat_limit (integer)  
sugar_limit (integer)  
created_at (timestamp with time zone, default now())  

### food_log
Stores individual food entries per user.

log_id (uuid, primary key)  
user_id (uuid, foreign key to profiles.id)  
food_name (text)  
calories (integer)  
protein (integer)  
carbs (integer)  
fat (integer)  
sugar (integer)  
log_date (timestamp with time zone, default now())  

## Project Structure

- /app: Main screen logic and routing  
- /components: UI components (FoodLogItem, DonutChart, AddFood, etc.)  
- /context: Supabase AuthProvider  
- /lib: Supabase client instance  
- /flask-backend: Python code and Flask server for food detection 

## Setup

### Prerequisites

- Node.js and Yarn  
- Python 3.8+  
- Expo Go mobile app  
- Supabase account with tables configured  
- ffmpeg (optional for Flask if image processing needs it)  

### Frontend Installation

1. Clone the repo:  
   git clone https://github.com/yourusername/NutriSnap.git  
   cd NutriSnap  

2. Install dependencies:  
   yarn install  

3. Configure environment variables in `.env` or `app.config.js`:  
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url  
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key  

4. Start the Expo app:  
   yarn ios  
   or  
   yarn android  

### Backend (Flask API)

1. Navigate to the Flask backend folder:  
   cd flask-backend  

2. Create a virtual environment:  
   python -m venv venv  
   source venv/bin/activate  

3. Install dependencies:  
   pip install -r requirements.txt  

4. Run the Flask server:  
   python app.py  

## YOLOv5 Detection Details

The `data.yml` file used for training the model looks like this:

train: ../data/train/images  
val: ../data/valid/images  
test: ../data/test/images  

nc: 211  
names: ['Apple', 'Apple Pie', 'Avocado', ..., 'water_spinach']  

This configuration defines:
- Paths to training, validation, and test image directories.
- `nc`: the number of food classes (211).
- `names`: the list of class labels used in training.

## Flask API (app.py)

The `app.py` Flask server exposes a `/detect` endpoint. Key behavior:

- Accepts an uploaded image
- Loads the YOLOv5 model from `runs/best.pt`
- Runs inference using PyTorch
- Filters detections with confidence > 0.10
- Returns detected food class names as JSON

### YOLOv5 Model Functionality

- YOLOv5 single-stage object detection model by Ultralytics.
- It returns bounding box coordinates, confidence values, and predicted class names.
- This project uses a custom-trained YOLOv5 model trained on 211 food categories using a labeled dataset.
- When a user uploads an image, the model runs inference to identify food items in the image.
- The results are filtered by a confidence threshold (0.30), and class names (e.g., `Pizza`, `Burger`, `Sushi`) are returned.
- These names are used in the React Native frontend to fetch matching nutrition data from the USDA API and allow users to log them to Supabase.

## Contact

Created by Mauro Malekshamran  
GitHub: [@MauroMal](https://github.com/MauroMal) 