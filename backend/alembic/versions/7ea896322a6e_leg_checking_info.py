"""leg checking info

Revision ID: 7ea896322a6e
Revises: 62a21e7c92fe
Create Date: 2026-08-17 19:21:14.566451

Shipments are treated as a straight line (one leg follows the next, no
mid-route branching), so checkpoint verification is recorded per leg
instead of introducing a separate receiving-style entity for transit
stops. `Receiving` stays reserved for arrivals at a real warehouse.
"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "7ea896322a6e"
down_revision: str | Sequence[str] | None = "62a21e7c92fe"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("transportation_legs", sa.Column("checked_by", sa.String(), nullable=True))
    op.add_column("transportation_legs", sa.Column("checked_date", sa.Date(), nullable=True))
    op.add_column(
        "transportation_legs", sa.Column("packages_expected", sa.Integer(), nullable=True)
    )
    op.add_column(
        "transportation_legs", sa.Column("packages_verified", sa.Integer(), nullable=True)
    )
    op.add_column("transportation_legs", sa.Column("check_notes", sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("transportation_legs", "check_notes")
    op.drop_column("transportation_legs", "packages_verified")
    op.drop_column("transportation_legs", "packages_expected")
    op.drop_column("transportation_legs", "checked_date")
    op.drop_column("transportation_legs", "checked_by")
