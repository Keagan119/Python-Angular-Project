from sqlalchemy.orm import Session
from sqlalchemy import func
import models.models as models

def category_breakdown(db: Session):
    results = (
        db.query(
            models.Expense.category,
            func.sum(models.Expense.amount).label("total")
        )
        .group_by(models.Expense.category)
        .all()
    )

    return [
        {"category": r[0], "total": r[1]}
        for r in results
    ]
