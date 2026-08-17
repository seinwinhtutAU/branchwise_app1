from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import CurrentUser, DbSession
from app.schemas.logistics import ShipmentDetailOut, ShipmentOut
from app.services import logistics_service

router = APIRouter(prefix="/shipments", tags=["shipments"])


@router.get("", response_model=list[ShipmentOut])
def list_shipments(
    current_user: CurrentUser,
    db: DbSession,
    shipment_status: str | None = Query(None, alias="status"),
    q: str | None = None,
    skip: int = 0,
    limit: int = 50,
) -> list[ShipmentOut]:
    return logistics_service.list_shipments(db, shipment_status, q, skip, limit)


@router.get("/{shipment_id}", response_model=ShipmentDetailOut)
def get_shipment(shipment_id: int, current_user: CurrentUser, db: DbSession) -> ShipmentDetailOut:
    shipment = logistics_service.get_shipment(db, shipment_id)
    if not shipment:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Shipment not found")
    return shipment
