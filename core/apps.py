from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'
    def ready(self):
        # Import signals to ensure they are registered
        import core.signals
        # Import custom exception handler
        from core.exceptions import custom_exception_handler
        # Register the custom exception handler with Django REST Framework
        from rest_framework.views import exception_handler
        exception_handler.custom_exception_handler = custom_exception_handler
        # Ensure the custom exception handler is used
        from rest_framework.settings import api_settings
        api_settings.EXCEPTION_HANDLER = 'core.exceptions.custom_exception_handler'
        