# Data Model

No persistent application models are implemented in Phase 1. MongoDB connectivity is established as a foundation.

The planned models from `SPEC.md` are User/guest ownership, Mystery, Suspect subdocuments, Evidence subdocuments, canonical solution, Investigation Session, and Accusation Result. Canonical solution fields must be excluded from all public serializers before verdict reveal. Indexes and exact fields must follow the database design in `SPEC.md` when Phase 3 begins.
