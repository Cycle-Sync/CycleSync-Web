from tensorflow.keras.models import load_model, clone_model
import os
import numpy as np

# Load the pre-trained global model
def load_global_model():
    return load_model('models/global_lstm_model.h5')

# Load a user's model, or the global one if they don’t have one yet
def load_user_model(user_id):
    model_path = f'models/user_{user_id}.h5'
    if os.path.exists(model_path):
        return load_model(model_path)
    return load_global_model()

# Save a user’s model
def save_user_model(user_id, model):
    os.makedirs('models', exist_ok=True)
    model.save(f'models/user_{user_id}.h5')

# Prepare data sequences for LSTM training
def prepare_sequences(sequence, n_steps):
    X, y = [], []
    for i in range(len(sequence) - n_steps):
        seq_x = sequence[i:i+n_steps]
        seq_y = sequence[i+n_steps]
        X.append(seq_x)
        y.append(seq_y)
    return np.array(X), np.array(y)

# Update a user’s model with their cycle data
def update_user_model(user_id):
    from app import Cycle
    cycles = Cycle.query.filter_by(user_id=user_id).order_by(Cycle.start_date).all()
    start_dates = [c.start_date for c in cycles]
    if len(start_dates) < 2:
        return
    cycle_lengths = [(start_dates[i+1] - start_dates[i]).days for i in range(len(start_dates)-1)]
    n_steps = 3  # Number of past cycles to use for prediction
    if len(cycle_lengths) <= n_steps:
        return
    X, y = prepare_sequences(cycle_lengths, n_steps)
    if len(X) == 0:
        return
    model = load_user_model(user_id)
    model.fit(X.reshape(-1, n_steps, 1), y, epochs=50, verbose=0)
    save_user_model(user_id, model)