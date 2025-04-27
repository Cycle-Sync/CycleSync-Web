import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.losses import MeanSquaredError
from django.conf import settings
from .models import Cycle

# Default loss and optimizer settings
DEFAULT_LOSS = MeanSquaredError()
DEFAULT_OPTIMIZER = 'adam'

def load_global_model():
    """
    Load the global LSTM model without compiling, then compile it with MSE loss and default optimizer.
    """
    model_path = os.path.join(settings.BASE_DIR, 'models', 'global_lstm_model.h5')
    try:
        model = load_model(model_path, compile=False)
        model.compile(optimizer=DEFAULT_OPTIMIZER, loss=DEFAULT_LOSS)
        return model
    except Exception as e:
        raise Exception(f"Failed to load global model: {e}")


def load_user_model(user_id):
    """
    Load a user-specific model if it exists; otherwise fall back to the global model.
    Always compiles the model with default settings.
    """
    model_path = os.path.join(settings.BASE_DIR, 'models', f'user_{user_id}.h5')
    if os.path.exists(model_path):
        model = load_model(model_path, compile=False)
        model.compile(optimizer=DEFAULT_OPTIMIZER, loss=DEFAULT_LOSS)
        return model
    return load_global_model()


def save_user_model(user_id, model):
    """
    Save a trained model for a specific user.
    """
    models_dir = os.path.join(settings.BASE_DIR, 'models')
    os.makedirs(models_dir, exist_ok=True)
    model_path = os.path.join(models_dir, f'user_{user_id}.h5')
    model.save(model_path)


def prepare_sequences(sequence, n_steps):
    """
    Transform a list of values into input/output sequences for time series prediction.
    """
    X, y = [], []
    for i in range(len(sequence) - n_steps):
        X.append(sequence[i:i + n_steps])
        y.append(sequence[i + n_steps])
    return np.array(X), np.array(y)


def update_user_model(user_id):
    """
    Retrain the user model on their historical cycle lengths.
    """
    cycles = Cycle.objects.filter(user_id=user_id).order_by('start_date')
    dates = [c.start_date for c in cycles]
    if len(dates) < 2:
        return

    cycle_lengths = [(dates[i+1] - dates[i]).days for i in range(len(dates) - 1)]
    n_steps = 3
    if len(cycle_lengths) <= n_steps:
        return

    X, y = prepare_sequences(cycle_lengths, n_steps)
    if X.size == 0:
        return

    model = load_user_model(user_id)
    X_in = X.reshape((-1, n_steps, 1))
    model.fit(X_in, y, epochs=50, verbose=0)
    save_user_model(user_id, model)


def predict_next_cycle(user_id, cycle_lengths, last_start_date, n_steps=3):
    """
    Predict the next cycle start date given past cycle lengths and the last date.
    Returns a datetime date or None if insufficient data.
    """
    if len(cycle_lengths) < n_steps:
        return None

    model = load_user_model(user_id)
    input_seq = np.array(cycle_lengths[-n_steps:]).reshape(1, n_steps, 1)
    predicted_length = model.predict(input_seq, verbose=0)[0][0]

    from datetime import timedelta
    return last_start_date + timedelta(days=int(predicted_length))
