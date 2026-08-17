from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import CurrentUser, DbSession
from app.schemas.receiving import ReceivingDetailOut, ReceivingOut
from app.services import receiving_service

router = APIRouter(prefix="/receiving", tags=["receiving"])


@router.get("", response_model=list[ReceivingOut])
def list_receivings(
    current_user: CurrentUser,
    db: DbSession,
    receiving_status: str | None = Query(None, alias="status"),
    warehouse_id: int | None = None,
    skip: int = 0,
    limit: int = 50,
) -> list[ReceivingOut]:
    return receiving_service.list_receivings(db, receiving_status, warehouse_id, skip, limit)


@router.get("/{receiving_id}", response_model=ReceivingDetailOut)
def get_receiving(
    receiving_id: int, current_user: CurrentUser, db: DbSession
) -> ReceivingDetailOut:
    receiving = receiving_service.get_receiving(db, receiving_id)
    if not receiving:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Receiving not found")
    return receiving
