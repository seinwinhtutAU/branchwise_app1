"""erd schema

Revision ID: ad7c5963f5c2
Revises: 6544740e1008
Create Date: 2026-08-17 03:58:46.759762

"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "ad7c5963f5c2"
down_revision: str | Sequence[str] | None = "6544740e1008"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "customers",
        sa.Column("customer_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("phone", sa.String(), nullable=True),
        sa.Column("address", sa.String(), nullable=True),
    )

    op.create_table(
        "products",
        sa.Column("product_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("product_code", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("color", sa.String(), nullable=True),
        sa.Column("size", sa.String(), nullable=True),
        sa.UniqueConstraint("product_code"),
    )

    op.create_table(
        "factories",
        sa.Column("factory_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("phone", sa.String(), nullable=True),
    )

    op.create_table(
        "warehouses",
        sa.Column("warehouse_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(), nullable=False),
    )

    op.create_table(
        "orders",
        sa.Column("order_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("order_no", sa.String(), nullable=False),
        sa.Column("customer_id", sa.BigInteger(), nullable=False),
        sa.Column("order_date", sa.Date(), nullable=False),
        sa.Column("source", sa.String(), nullable=True),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("total_amount", sa.Numeric(12, 2), nullable=False),
        sa.ForeignKeyConstraint(["customer_id"], ["customers.customer_id"]),
        sa.UniqueConstraint("order_no"),
    )

    op.create_table(
        "order_items",
        sa.Column("order_item_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("order_id", sa.BigInteger(), nullable=False),
        sa.Column("product_id", sa.BigInteger(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("price", sa.Numeric(12, 2), nullable=False),
        sa.ForeignKeyConstraint(["order_id"], ["orders.order_id"]),
        sa.ForeignKeyConstraint(["product_id"], ["products.product_id"]),
    )

    op.create_table(
        "purchases",
        sa.Column("purchase_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("purchase_no", sa.String(), nullable=False),
        sa.Column("factory_id", sa.BigInteger(), nullable=False),
        sa.Column("purchase_date", sa.Date(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["factory_id"], ["factories.factory_id"]),
        sa.UniqueConstraint("purchase_no"),
    )

    op.create_table(
        "purchase_items",
        sa.Column("purchase_item_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("purchase_id", sa.BigInteger(), nullable=False),
        sa.Column("product_id", sa.BigInteger(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("buying_price", sa.Numeric(12, 2), nullable=False),
        sa.ForeignKeyConstraint(["purchase_id"], ["purchases.purchase_id"]),
        sa.ForeignKeyConstraint(["product_id"], ["products.product_id"]),
    )

    op.create_table(
        "purchase_allocations",
        sa.Column("allocation_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("purchase_item_id", sa.BigInteger(), nullable=False),
        sa.Column("order_item_id", sa.BigInteger(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["purchase_item_id"], ["purchase_items.purchase_item_id"]),
        sa.ForeignKeyConstraint(["order_item_id"], ["order_items.order_item_id"]),
    )

    op.create_table(
        "packages",
        sa.Column("package_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("package_no", sa.String(), nullable=False),
        sa.Column("purchase_id", sa.BigInteger(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["purchase_id"], ["purchases.purchase_id"]),
        sa.UniqueConstraint("package_no"),
    )

    op.create_table(
        "package_items",
        sa.Column("package_item_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("package_id", sa.BigInteger(), nullable=False),
        sa.Column("product_id", sa.BigInteger(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["package_id"], ["packages.package_id"]),
        sa.ForeignKeyConstraint(["product_id"], ["products.product_id"]),
    )

    op.create_table(
        "shipments",
        sa.Column("shipment_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("shipment_no", sa.String(), nullable=False),
        sa.Column("shipment_date", sa.Date(), nullable=False),
        sa.Column("expected_arrival", sa.Date(), nullable=True),
        sa.Column("status", sa.String(), nullable=False),
        sa.UniqueConstraint("shipment_no"),
    )

    op.create_table(
        "shipment_packages",
        sa.Column("shipment_package_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("shipment_id", sa.BigInteger(), nullable=False),
        sa.Column("package_id", sa.BigInteger(), nullable=False),
        sa.ForeignKeyConstraint(["shipment_id"], ["shipments.shipment_id"]),
        sa.ForeignKeyConstraint(["package_id"], ["packages.package_id"]),
    )

    op.create_table(
        "transportation_legs",
        sa.Column("leg_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("shipment_id", sa.BigInteger(), nullable=False),
        sa.Column("from_location", sa.String(), nullable=False),
        sa.Column("to_location", sa.String(), nullable=False),
        sa.Column("carrier", sa.String(), nullable=True),
        sa.Column("vehicle_no", sa.String(), nullable=True),
        sa.Column("departure_date", sa.Date(), nullable=True),
        sa.Column("arrival_date", sa.Date(), nullable=True),
        sa.Column("transport_cost", sa.Numeric(12, 2), nullable=True),
        sa.Column("status", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["shipment_id"], ["shipments.shipment_id"]),
    )

    op.create_table(
        "receiving",
        sa.Column("receiving_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("shipment_id", sa.BigInteger(), nullable=False),
        sa.Column("warehouse_id", sa.BigInteger(), nullable=False),
        sa.Column("received_date", sa.Date(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["shipment_id"], ["shipments.shipment_id"]),
        sa.ForeignKeyConstraint(["warehouse_id"], ["warehouses.warehouse_id"]),
        sa.UniqueConstraint("shipment_id"),
    )

    op.create_table(
        "receiving_items",
        sa.Column("receiving_item_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("receiving_id", sa.BigInteger(), nullable=False),
        sa.Column("product_id", sa.BigInteger(), nullable=False),
        sa.Column("quantity_expected", sa.Integer(), nullable=False),
        sa.Column("quantity_received", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.ForeignKeyConstraint(["receiving_id"], ["receiving.receiving_id"]),
        sa.ForeignKeyConstraint(["product_id"], ["products.product_id"]),
    )

    op.create_table(
        "inventory",
        sa.Column("inventory_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("warehouse_id", sa.BigInteger(), nullable=False),
        sa.Column("product_id", sa.BigInteger(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("reserved_quantity", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.ForeignKeyConstraint(["warehouse_id"], ["warehouses.warehouse_id"]),
        sa.ForeignKeyConstraint(["product_id"], ["products.product_id"]),
    )

    op.create_table(
        "stock_allocations",
        sa.Column("allocation_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("order_item_id", sa.BigInteger(), nullable=False),
        sa.Column("inventory_id", sa.BigInteger(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["order_item_id"], ["order_items.order_item_id"]),
        sa.ForeignKeyConstraint(["inventory_id"], ["inventory.inventory_id"]),
    )

    op.create_table(
        "deliveries",
        sa.Column("delivery_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("order_id", sa.BigInteger(), nullable=False),
        sa.Column("delivery_date", sa.Date(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["order_id"], ["orders.order_id"]),
    )

    op.create_table(
        "delivery_items",
        sa.Column("delivery_item_id", sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column("delivery_id", sa.BigInteger(), nullable=False),
        sa.Column("product_id", sa.BigInteger(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["delivery_id"], ["deliveries.delivery_id"]),
        sa.ForeignKeyConstraint(["product_id"], ["products.product_id"]),
    )


def downgrade() -> None:
    op.drop_table("delivery_items")
    op.drop_table("deliveries")
    op.drop_table("stock_allocations")
    op.drop_table("inventory")
    op.drop_table("receiving_items")
    op.drop_table("receiving")
    op.drop_table("transportation_legs")
    op.drop_table("shipment_packages")
    op.drop_table("shipments")
    op.drop_table("package_items")
    op.drop_table("packages")
    op.drop_table("purchase_allocations")
    op.drop_table("purchase_items")
    op.drop_table("purchases")
    op.drop_table("order_items")
    op.drop_table("orders")
    op.drop_table("warehouses")
    op.drop_table("factories")
    op.drop_table("products")
    op.drop_table("customers")
