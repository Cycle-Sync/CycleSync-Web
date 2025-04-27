import numpy as np
import pandas as pd
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()

# Configuration
num_users = 1000
cycles_per_user = 12  # 1 year of data
min_start_date = datetime(2020, 1, 1)
max_start_date = datetime(2023, 12, 31)

# Full symptom list with defaults
symptom_template = {
    # Physical (0-5)
    'cramps': 0,
    'bloating': 0,
    'tender_breasts': 0,
    'headache': 0,
    'acne': 0,
    'vaginal_burning': 0,
    'vaginal_dryness': 0,
    'vaginal_itchiness': 0,
    'spotting': 0,
    'dry_skin': 0,
    
    # Emotional (0-5)
    'anxious': 0,
    'happy': 0,
    'angry': 0,
    'apathetic': 0,
    'brain_fog': 0,
    'calm': 0,
    'confident': 0,
    'confused': 0,
    'content': 0,
    'depressed': 0,
    'irritable': 0,
    'lack_of_concentration': 0,
    'memory_loss': 0,
    'mood_swings': 0,
    'positive': 0,
    'relaxed': 0,
    'sad': 0,
    'stressed': 0,
    
    # Cervical Mucus (categorical)
    'cervical_mucus': 'none',  # none/sticky/watery/egg-white/creamy/atypical
    
    # Vitality (0-5)
    'energy': 0,
    'sleep_quality': 0,
    'libido': 0
}

phase_characteristics = {
    'menstrual': {
        'symptoms': {
            'cramps': (3, 5),
            'energy': (1, 3),
            'spotting': (2, 4),
            'bloating': (1, 3)
        },
        'duration': (3, 6)
    },
    'follicular': {
        'symptoms': {
            'energy': (3, 5),
            'happy': (3, 5),
            'libido': (2, 4)
        },
        'duration': (10, 16)  # Derived from cycle length
    },
    'ovulation': {
        'symptoms': {
            'cervical_mucus': [('egg-white', 0.7), ('watery', 0.3)],
            'libido': (4, 5),
            'energy': (4, 5)
        },
        'duration': 1
    },
    'luteal': {
        'symptoms': {
            'bloating': (3, 5),
            'mood_swings': (3, 5),
            'tender_breasts': (2, 5),
            'cervical_mucus': [('creamy', 0.6), ('sticky', 0.3), ('none', 0.1)]
        },
        'duration': 14
    }
}

def generate_user_cycles(user_id):
    start_date = fake.date_between_dates(min_start_date, max_start_date)
    start_date = datetime.combine(start_date, datetime.min.time())
    
    data = []
    base_cycle = random.randint(25, 31)
    
    for _ in range(cycles_per_user):
        cycle_length = base_cycle + random.randint(-2, 2)
        cycle_length = max(23, min(35, cycle_length))
        
        # Calculate phase durations
        menstrual_days = random.randint(*phase_characteristics['menstrual']['duration'])
        luteal_days = phase_characteristics['luteal']['duration']
        follicular_days = cycle_length - luteal_days - menstrual_days - 1  # -1 for ovulation day
        
        phase_sequence = []
        phase_sequence.extend(['menstrual'] * menstrual_days)
        phase_sequence.extend(['follicular'] * follicular_days)
        phase_sequence.append('ovulation')
        phase_sequence.extend(['luteal'] * (luteal_days - 1))
        
        current_date = start_date
        
        for day, phase in enumerate(phase_sequence, 1):
            daily_data = symptom_template.copy()
            daily_data.update({
                'user_id': user_id,
                'date': current_date,
                'day_in_cycle': day,
                'phase': phase,
                'cycle_length': cycle_length,
                'menstrual_days': menstrual_days
            })
            
            # Phase-specific symptoms
            characteristics = phase_characteristics[phase]['symptoms']
            
            # Numerical symptoms
            for symptom in ['cramps', 'bloating', 'energy', 'libido', 'happy']:
                if symptom in characteristics:
                    daily_data[symptom] = np.clip(
                        np.random.randint(*characteristics[symptom]) + random.randint(-1, 1),
                        0, 5
                    )
            
            # Cervical mucus
            if 'cervical_mucus' in characteristics:
                mucus_types, probs = zip(*characteristics['cervical_mucus'])
                daily_data['cervical_mucus'] = np.random.choice(mucus_types, p=probs)
            
            # Add random baseline noise (10% of max value)
            for symptom in ['anxious', 'stress', 'calm']:
                daily_data[symptom] = np.clip(random.randint(0, 2), 0, 5)
            
            data.append(daily_data)
            current_date += timedelta(days=1)
        
        start_date = current_date
    
    return data

# Generate full dataset
all_data = []
for _ in range(num_users):
    user_id = fake.uuid4()
    all_data.extend(generate_user_cycles(user_id))

df = pd.DataFrame(all_data)

# Verify no missing values
assert df.isnull().sum().sum() == 0, "Missing values detected!"

# Save dataset
df.to_csv('full_menstrual_dataset.csv', index=False)
print(f"Generated {len(df)} complete records\n"
      f"Columns: {df.columns.tolist()}")