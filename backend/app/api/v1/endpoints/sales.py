from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import CurrentUser, DbSession
from app.schemas.sales import OrderDetailOut, OrderItemsUpdateRequest, OrderOut
from app.services import sales_service

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("", response_model=list[OrderOut])
def list_orders(
    current_user: CurrentUser,
    db: DbSession,
    order_status: str | None = Query(None, alias="status"),
    customer_id: int | None = None,
    q: str | None = None,
    skip: int = 0,
    limit: int = 50,
) -> list[OrderOut]:
    return sales_service.list_orders(db, order_status, customer_id, q, skip, limit)


@router.get("/{order_id}", response_model=OrderDetailOut)
def get_order(order_id: int, current_user: CurrentUser, db: DbSession) -> OrderDetailOut:
    order = sales_service.get_order(db, order_id)
    if not order:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Order not found")
    return order


@router.patch("/{order_id}/items", response_model=OrderDetailOut)
def update_order_items(
    order_id: int, payload: OrderItemsUpdateRequest, current_user: CurrentUser, db: DbSession
) -> OrderDetailOut:
    order = sales_service.update_order_items(db, order_id, payload.items)
    if not order:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Order not found")
    return order
