"""package items reference purchase allocation

Revision ID: 62a21e7c92fe
Revises: ad7c5963f5c2
Create Date: 2026-08-17 17:29:53.540383

Packing follows the shipment/destination, not a single purchase order: one
purchase can be split across many packages, and one package can hold items
from several different purchases (and several different customer orders).

Previously `packages.purchase_id` pinned a whole package to one purchase,
and `package_items.product_id` didn't say which customer order a packed
quantity was set aside for. This moves the link down to the line-item level:
each package_item now points at a purchase_allocation (the record that
already ties a specific purchase_item to a specific order_item), so a
package's contents can be traced to both their source purchase and their
destination customer order, item by item.
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "62a21e7c92fe"
down_revision: str | Sequence[str] | None = "ad7c5963f5c2"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Postgres automatically drops a column's own FK constraint when the
    # column itself is dropped, so no separate drop_constraint call is needed.
    op.drop_column("packages", "purchase_id")

    op.drop_column("package_items", "product_id")
    op.add_column(
        "package_items", sa.Column("purchase_allocation_id", sa.BigInteger(), nullable=False)
    )
    op.create_foreign_key(
        None, "package_items", "purchase_allocations", ["purchase_allocation_id"], ["allocation_id"]
    )


def downgrade() -> None:
    op.drop_column("package_items", "purchase_allocation_id")
    op.add_column("package_items", sa.Column("product_id", sa.BigInteger(), nullable=False))
    op.create_foreign_key(None, "package_items", "products", ["product_id"], ["product_id"])

    op.add_column("packages", sa.Column("purchase_id", sa.BigInteger(), nullable=False))
    op.create_foreign_key(None, "packages", "purchases", ["purchase_id"], ["purchase_id"])
