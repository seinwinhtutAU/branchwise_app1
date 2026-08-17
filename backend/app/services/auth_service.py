from fastapi import HTTPException, status

from app.core.supabase_client import get_supabase_client
from app.schemas.auth import AuthResponse, SignInRequest, SignUpRequest


def sign_up(payload: SignUpRequest) -> AuthResponse:
    client = get_supabase_client()
    result = client.auth.sign_up({"email": payload.email, "password": payload.password})

    if result.session is None:
        # Email confirmation is required before a session is issued.
        raise HTTPException(
            status_code=status.HTTP_202_ACCEPTED,
            detail="Sign-up successful, please confirm your email before signing in.",
        )

    return AuthResponse(
        access_token=result.session.access_token,
        refresh_token=result.session.refresh_token,
    )


def sign_in(payload: SignInRequest) -> AuthResponse:
    client = get_supabase_client()
    try:
        result = client.auth.sign_in_with_password(
            {"email": payload.email, "password": payload.password}
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        ) from exc

    return AuthResponse(
        access_token=result.session.access_token,
        refresh_token=result.session.refresh_token,
    )
