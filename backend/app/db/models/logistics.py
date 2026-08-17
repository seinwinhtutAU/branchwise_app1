from datetime import date
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, Date, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.db.models.packaging import Package
    from app.db.models.receiving import Receiving


class Shipment(Base):
    __tablename__ = "shipments"

    shipment_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    shipment_no: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    shipment_date: Mapped[date] = mapped_column(Date, nullable=False)
    expected_arrival: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String, nullable=False)

    package_links: Mapped[list["ShipmentPackage"]] = relationship(back_populates="shipment")
    legs: Mapped[list["TransportationLeg"]] = relationship(back_populates="shipment")
    receiving: Mapped["Receiving | None"] = relationship(back_populates="shipment", uselist=False)


class ShipmentPackage(Base):
    __tablename__ = "shipment_packages"

    shipment_package_id: Mapped[int] = mapped_column(
        BigInteger, primary_key=True, autoincrement=True
    )
    shipment_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("shipments.shipment_id"), nullable=False
    )
    package_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("packages.package_id"), nullable=False
    )

    shipment: Mapped["Shipment"] = relationship(back_populates="package_links")
    package: Mapped["Package"] = relationship(back_populates="shipment_links")


class TransportationLeg(Base):
    __tablename__ = "transportation_legs"

    leg_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    shipment_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("shipments.shipment_id"), nullable=False
    )
    from_location: Mapped[str] = mapped_column(String, nullable=False)
    to_location: Mapped[str] = mapped_column(String, nullable=False)
    carrier: Mapped[str | None] = mapped_column(String, nullable=True)
    vehicle_no: Mapped[str | None] = mapped_column(String, nullable=True)
    departure_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    arrival_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    transport_cost: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    status: Mapped[str] = mapped_column(String, nullable=False)

    shipment: Mapped["Shipment"] = relationship(back_populates="legs")
