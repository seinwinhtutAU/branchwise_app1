from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import CurrentUser, DbSession
from app.schemas.delivery import DeliveryCreate, DeliveryDetailOut, DeliveryOut
from app.services import delivery_service

router = APIRouter(prefix="/deliveries", tags=["deliveries"])


@router.get("", response_model=list[DeliveryOut])
def list_deliveries(
    current_user: CurrentUser,
    db: DbSession,
    delivery_status: str | None = Query(None, alias="status"),
    order_id: int | None = None,
    skip: int = 0,
    limit: int = 50,
) -> list[DeliveryOut]:
    return delivery_service.list_deliveries(db, delivery_status, order_id, skip, limit)


@router.get("/{delivery_id}", response_model=DeliveryDetailOut)
def get_delivery(delivery_id: int, current_user: CurrentUser, db: DbSession) -> DeliveryDetailOut:
    delivery = delivery_service.get_delivery(db, delivery_id)
    if not delivery:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Delivery not found")
    return delivery


@router.post("", response_model=DeliveryDetailOut, status_code=status.HTTP_201_CREATED)
def create_delivery(
    payload: DeliveryCreate, current_user: CurrentUser, db: DbSession
) -> DeliveryDetailOut:
    return delivery_service.create_delivery(db, payload)


@router.post("/{delivery_id}/mark-delivered", response_model=DeliveryDetailOut)
def mark_delivered(delivery_id: int, current_user: CurrentUser, db: DbSession) -> DeliveryDetailOut:
    delivery = delivery_service.mark_delivered(db, delivery_id)
    if not delivery:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Delivery not found")
    return delivery
