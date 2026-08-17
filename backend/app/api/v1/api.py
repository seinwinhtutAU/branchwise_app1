from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    delivery,
    health,
    logistics,
    packaging,
    procurement,
    receiving,
    reference,
    sales,
    users,
    warehouse,
)

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(reference.router)
api_router.include_router(sales.router)
api_router.include_router(procurement.router)
api_router.include_router(packaging.router)
api_router.include_router(logistics.router)
api_router.include_router(receiving.router)
api_router.include_router(warehouse.router)
api_router.include_router(delivery.router)
