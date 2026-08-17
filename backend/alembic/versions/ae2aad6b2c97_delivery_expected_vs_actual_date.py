"""delivery expected vs actual date

Revision ID: ae2aad6b2c97
Revises: 7ea896322a6e
Create Date: 2026-08-17 19:38:14.824471

delivery_date used to be set the moment a delivery was created, which really
meant "today," not "when it arrived" - there was no way to schedule a target
date without it being treated as already fulfilled. This splits that into
expected_delivery_date (the target, set on scheduling) and delivery_date
(nullable, only set once the delivery is confirmed), mirroring how Shipment
already separates expected_arrival from the actual arrival.
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "ae2aad6b2c97"
down_revision: str | Sequence[str] | None = "7ea896322a6e"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "deliveries", sa.Column("expected_delivery_date", sa.Date(), nullable=True)
    )
    op.alter_column("deliveries", "delivery_date", nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column("deliveries", "delivery_date", nullable=False)
    op.drop_column("deliveries", "expected_delivery_date")
