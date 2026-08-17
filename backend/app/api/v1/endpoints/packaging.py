from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import CurrentUser, DbSession
from app.schemas.packaging import PackageDetailOut, PackageOut
from app.services import packaging_service

router = APIRouter(prefix="/packages", tags=["packages"])


@router.get("", response_model=list[PackageOut])
def list_packages(
    current_user: CurrentUser,
    db: DbSession,
    package_status: str | None = Query(None, alias="status"),
    q: str | None = None,
    skip: int = 0,
    limit: int = 50,
) -> list[PackageOut]:
    return packaging_service.list_packages(db, package_status, q, skip, limit)


@router.get("/{package_id}", response_model=PackageDetailOut)
def get_package(package_id: int, current_user: CurrentUser, db: DbSession) -> PackageDetailOut:
    package = packaging_service.get_package(db, package_id)
    if not package:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Package not found")
    return package
