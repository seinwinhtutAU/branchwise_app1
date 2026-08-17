from fastapi import APIRouter

from app.api.deps import CurrentUser
from app.schemas.user import UserProfile

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserProfile)
def get_me(current_user: CurrentUser) -> UserProfile:
    return UserProfile(id=current_user.id, email=current_user.email)
