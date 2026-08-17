from fastapi import APIRouter

from app.api.deps import CurrentUser, DbSession
from app.schemas.warehouse import InventoryOut
from app.services import warehouse_service

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.get("", response_model=list[InventoryOut])
def list_inventory(
    current_user: CurrentUser,
    db: DbSession,
    warehouse_id: int | None = None,
    variant_id: int | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[InventoryOut]:
    return warehouse_service.list_inventory(db, warehouse_id, variant_id, skip, limit)
