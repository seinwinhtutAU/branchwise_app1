from fastapi import HTTPException, status
from supabase_auth.types import User

from app.core.supabase_client import get_supabase_client


def get_user_from_token(access_token: str) -> User:
    """Validate a Supabase-issued access token and return the associated user.

    Delegates verification to Supabase's Auth server rather than decoding the
    JWT locally, so it stays correct regardless of the project's signing key
    rotation or algorithm.
    """
    try:
        response = get_supabase_client().auth.get_user(access_token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from exc

    if response is None or response.user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    return response.user
