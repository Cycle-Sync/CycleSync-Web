# app.py
import streamlit as st
import pandas as pd
import numpy as np
import joblib
import tensorflow as tf
from datetime import datetime

# Load preprocessor and model
@st.cache_resource
def load_artifacts():
    preprocessor = joblib.load('preprocessor.pkl')
    model = tf.keras.models.load_model('menstrual_cycle_model.keras')
    return preprocessor, model

preprocessor, model = load_artifacts()

# Date processing functions
def process_dates(df):
    df['date'] = pd.to_datetime(df['date'])
    df['day_of_year'] = df['date'].dt.dayofyear
    df['month'] = df['date'].dt.month
    df['day_sin'] = np.sin(2 * np.pi * df['day_of_year']/365)
    df['day_cos'] = np.cos(2 * np.pi * df['day_of_year']/365)
    df['month_sin'] = np.sin(2 * np.pi * df['month']/12)
    df['month_cos'] = np.cos(2 * np.pi * df['month']/12)
    return df.drop(columns=['date'])

# Main app
st.title("Menstrual Cycle Prediction App")
st.write("Predict your next menstrual cycle start date")

with st.form("prediction_form"):
    # Date input
    current_date = st.date_input("Today's Date", datetime.today())
    
    # Phase and mucus type
    col1, col2 = st.columns(2)
    with col1:
        phase = st.selectbox("Current Phase", 
                           ["menstrual", "follicular", "ovulation", "luteal"])
    with col2:
        mucus_type = st.selectbox("Cervical Mucus Type",
                                ["none", "sticky", "watery", "egg-white", "creamy", "atypical"])
    
    # Physical symptoms
    st.subheader("Physical Symptoms (0-5)")
    cramps = st.slider("Cramps", 0, 5, 0)
    bloating = st.slider("Bloating", 0, 5, 0)
    breast_tenderness = st.slider("Breast Tenderness", 0, 5, 0)
    headache = st.slider("Headache", 0, 5, 0)
    
    # Emotional symptoms
    st.subheader("Emotional State (0-5)")
    mood = st.slider("Mood (0=low, 5=high)", 0, 5, 3)
    stress = st.slider("Stress Level", 0, 5, 0)
    energy = st.slider("Energy Level", 0, 5, 3)
    
    # Vitality metrics
    st.subheader("Vitality Metrics")
    sleep_quality = st.slider("Sleep Quality", 0, 5, 3)
    libido = st.slider("Libido", 0, 5, 2)
    
    submitted = st.form_submit_button("Predict Next Cycle")

if submitted:
    # Create input DataFrame
    input_data = pd.DataFrame([{
        'date': current_date,
        'phase': phase,
        'cervical_mucus': mucus_type,
        'cramps': cramps,
        'bloating': bloating,
        'tender_breasts': breast_tenderness,
        'headache': headache,
        'energy': energy,
        'mood_swings': mood,
        'stress': stress,
        'sleep_quality': sleep_quality,
        'libido': libido,
        # Add default values for other features
        'user_id': 0,  # Dummy value for preprocessing
        'cycle_length': 28  # Previous cycle length
    }])
    
    try:
        # Process dates and preprocess
        processed_data = process_dates(input_data)
        processed = preprocessor.transform(processed_data)
        
        # Make prediction (adjust based on your model's input shape)
        prediction = model.predict(np.array([processed]))[0][0]
        
        # Format output
        next_date = current_date + pd.DateOffset(days=int(prediction))
        st.success(f"Predicted next cycle start: **{next_date.strftime('%Y-%m-%d')}**")
        st.write(f"Predicted cycle length: {int(prediction)} days")
        
    except Exception as e:
        st.error(f"Prediction failed: {str(e)}")

# Add some explanations
st.markdown("""
**How to use:**
1. Fill in today's date
2. Select your current menstrual phase
3. Rate your physical symptoms (0 = none, 5 = severe)
4. Rate your emotional state and stress levels
5. Provide sleep quality and libido information
6. Click 'Predict Next Cycle'

**Note:** This prediction is based on patterns learned from historical data. 
Actual results may vary depending on individual circumstances.
""")