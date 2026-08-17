from fastapi import APIRouter

from app.schemas.auth import AuthResponse, SignInRequest, SignUpRequest
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/sign-up", response_model=AuthResponse)
def sign_up(payload: SignUpRequest) -> AuthResponse:
    return auth_service.sign_up(payload)


@router.post("/sign-in", response_model=AuthResponse)
def sign_in(payload: SignInRequest) -> AuthResponse:
    return auth_service.sign_in(payload)
