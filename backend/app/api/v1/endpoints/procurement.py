from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import CurrentUser, DbSession
from app.schemas.procurement import PurchaseDetailOut, PurchaseOut
from app.services import procurement_service

router = APIRouter(prefix="/purchases", tags=["purchases"])


@router.get("", response_model=list[PurchaseOut])
def list_purchases(
    current_user: CurrentUser,
    db: DbSession,
    purchase_status: str | None = Query(None, alias="status"),
    factory_id: int | None = None,
    q: str | None = None,
    skip: int = 0,
    limit: int = 50,
) -> list[PurchaseOut]:
    return procurement_service.list_purchases(db, purchase_status, factory_id, q, skip, limit)


@router.get("/{purchase_id}", response_model=PurchaseDetailOut)
def get_purchase(purchase_id: int, current_user: CurrentUser, db: DbSession) -> PurchaseDetailOut:
    purchase = procurement_service.get_purchase(db, purchase_id)
    if not purchase:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Purchase not found")
    return purchase
