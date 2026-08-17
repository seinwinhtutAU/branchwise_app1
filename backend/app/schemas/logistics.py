from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class TransportationLegOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    leg_id: int
    shipment_id: int
    from_location: str
    to_location: str
    carrier: str | None
    vehicle_no: str | None
    departure_date: date | None
    arrival_date: date | None
    transport_cost: Decimal | None
    status: str
    checked_by: str | None
    checked_date: date | None
    packages_expected: int | None
    packages_verified: int | None
    check_notes: str | None


class ShipmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    shipment_id: int
    shipment_no: str
    shipment_date: date
    expected_arrival: date | None
    status: str


class ShipmentDetailOut(ShipmentOut):
    legs: list[TransportationLegOut] = []
