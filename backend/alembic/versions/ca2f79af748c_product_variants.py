"""product variants

Revision ID: ca2f79af748c
Revises: 543cd46fe4a6
Create Date: 2026-08-17 20:36:10.460064

Product.color/size assumed one product_code = one sellable item, but
multiple colors can share a single product_code - so color (and a men/
lady/child group) move to a new product_variants table, which becomes what
order_items, purchase_items, receiving_items, inventory, and delivery_items
actually reference. size is dropped outright, not tracked at all.

Every existing product gets exactly one variant carrying its old color (best
guess at migration time, since there was no group before); the five
dependent tables are repointed from product_id to that variant's variant_id.
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "ca2f79af748c"
down_revision: str | Sequence[str] | None = "543cd46fe4a6"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

DEPENDENT_TABLES = [
    "order_items",
    "purchase_items",
    "receiving_items",
    "inventory",
    "delivery_items",
]


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "product_variants",
        sa.Column("variant_id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("product_id", sa.BigInteger(), nullable=False),
        sa.Column("color", sa.String(), nullable=True),
        sa.Column("group_name", sa.String(), nullable=True),
        sa.ForeignKeyConstraint(["product_id"], ["products.product_id"]),
        sa.PrimaryKeyConstraint("variant_id"),
    )

    # One variant per existing product, carrying over its old color.
    op.execute(
        "INSERT INTO product_variants (product_id, color, group_name) "
        "SELECT product_id, color, NULL FROM products"
    )

    for table in DEPENDENT_TABLES:
        op.add_column(table, sa.Column("variant_id", sa.BigInteger(), nullable=True))
        op.execute(
            f"UPDATE {table} t SET variant_id = pv.variant_id "
            f"FROM product_variants pv WHERE pv.product_id = t.product_id"
        )
        op.alter_column(table, "variant_id", nullable=False)
        op.create_foreign_key(
            None, table, "product_variants", ["variant_id"], ["variant_id"]
        )
        op.drop_column(table, "product_id")

    op.drop_column("products", "color")
    op.drop_column("products", "size")


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column("products", sa.Column("color", sa.String(), nullable=True))
    op.add_column("products", sa.Column("size", sa.String(), nullable=True))
    op.execute(
        "UPDATE products p SET color = pv.color "
        "FROM product_variants pv WHERE pv.product_id = p.product_id"
    )

    for table in DEPENDENT_TABLES:
        op.add_column(table, sa.Column("product_id", sa.BigInteger(), nullable=True))
        op.execute(
            f"UPDATE {table} t SET product_id = pv.product_id "
            f"FROM product_variants pv WHERE pv.variant_id = t.variant_id"
        )
        op.alter_column(table, "product_id", nullable=False)
        op.create_foreign_key(None, table, "products", ["product_id"], ["product_id"])
        op.drop_column(table, "variant_id")

    op.drop_table("product_variants")
