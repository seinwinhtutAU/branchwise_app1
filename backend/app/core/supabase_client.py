from functools import lru_cache

from supabase import Client, create_client

from app.core.config import get_settings


@lru_cache
def get_supabase_client() -> Client:
    """Client scoped with the anon key — respects Row Level Security. Use for
    any request made on behalf of an end user."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_anon_key)


@lru_cache
def get_supabase_admin_client() -> Client:
    """Client scoped with the service-role key — bypasses Row Level Security.
    Only use for trusted server-side operations (e.g. admin tasks, webhooks)."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_role_key)
