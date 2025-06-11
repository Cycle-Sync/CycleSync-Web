#celery

from celery import Celery
import os
from django.conf import settings
from celery.schedules import crontab
from django.utils import timezone
from datetime import timedelta
from celery.signals import setup_logging
from celery.utils.log import get_task_logger
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from core.models import User
from django.db.models import Q
from django_celery_beat.models import PeriodicTask, IntervalSchedule






os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mensetrack.settings')
app = Celery('mensetrack')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()        
app.conf.beat_schedule = {
    'send_reminder_emails': {
        'task': 'core.tasks.send_reminder_emails',
        'schedule': crontab(hour=8, minute=0),  # Every day at 8 AM
    },
}
@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}') 
@setup_logging.connect
def setup_celery_logging(**kwargs):
    logger = get_task_logger(__name__)
    logger.info('Celery logging is set up.')
@app.task
def send_reminder_emails():
    logger = get_task_logger(__name__)
    logger.info('Starting to send reminder emails.')
    
    # Get users who have not logged in for 30 days
    thirty_days_ago = timezone.now() - timedelta(days=30)
    inactive_users = User.objects.filter(last_login__lt=thirty_days_ago, is_active=True)

    for user in inactive_users:
        subject = 'We Miss You at Mensetrack!'
        html_message = render_to_string('emails/reminder_email.html', {'user': user})
        plain_message = strip_tags(html_message)
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = user.email

        try:
            send_mail(subject, plain_message, from_email, [to_email], html_message=html_message)
            logger.info(f'Reminder email sent to {user.email}.')
        except Exception as e:
            logger.error(f'Error sending email to {user.email}: {e}')
    
    logger.info('Finished sending reminder emails.')
# Ensure the Celery app is loaded when Django starts
@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # This function is called after the Celery app is configured
    # You can set up periodic tasks here if needed
    logger = get_task_logger(__name__)
    logger.info('Celery app is configured and ready.')
    
    # Example of creating a periodic task programmatically
    schedule, created = IntervalSchedule.objects.get_or_create(
        every=1,
        period=IntervalSchedule.DAYS,
    )
    
    PeriodicTask.objects.get_or_create(
        interval=schedule,
        name='Send reminder emails every day',
        task='core.tasks.send_reminder_emails',
    )
# This ensures that the Celery app is ready to handle tasks and periodic tasks
# when Django starts.   
# This is useful for setting up periodic tasks or other configurations
# that need to be done after the Celery app is configured.  
# Ensure the Celery app is ready to handle tasks and periodic tasks
# when Django starts. This is useful for setting up periodic tasks or other
# configurations that need to be done after the Celery app is configured.
# This is useful for setting up periodic tasks or other configurations  
# that need to be done after the Celery app is configured.
# This ensures that the Celery app is ready to handle tasks and periodic tasks
SSSSSSS