from pydantic import BaseModel, ConfigDict


class PackageItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    package_item_id: int
    package_id: int
    purchase_allocation_id: int
    quantity: int


class PackageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    package_id: int
    package_no: str
    status: str


class PackageDetailOut(PackageOut):
    items: list[PackageItemOut] = []
