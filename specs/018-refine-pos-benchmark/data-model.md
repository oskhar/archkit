# Data Model: Monolith vs. Hybrid

## Monolith (Modular)
- **Database**: Single `archkit_monolith` MySQL instance.
- **Entities**:
  - `Product`: ID (PK), Name, Price, Description.
  - `Inventory`: ProductID (FK), Quantity, LastUpdated.
  - `SalesTransaction`: ID (PK), TotalAmount, Timestamp.
  - `SalesItem`: ID, TransactionID (FK), ProductID (FK), Quantity, Price.
- **Relationships**: Enforced via standard SQL Foreign Keys (FK).
- **Consistency**: Immediate ACID compliance within a single DB transaction.

## Hybrid (Microservices)
- **Databases**: Independent instances (or schemas) per service:
  - `archkit_product`
  - `archkit_inventory`
  - `archkit_sales`
- **Entities**:
  - **Product Service**: `Product` (Source of Truth).
  - **Inventory Service**: `Inventory` (References ProductID, owns Quantity).
  - **Sales Service**: `SalesTransaction`, `SalesItem`, and a **Product Cache** (Redundant data for local lookups).
- **Relationships**: Not enforced at DB level. Managed via logical links (ID references).
- **Consistency**: Eventual consistency. Synchronization via Kafka `product.created` and `sales.transaction-completed` events.

## Comparison Summary

| Feature | Monolith | Hybrid |
|---------|----------|--------|
| **Data Locality** | Centralized | Decentralized |
| **Integrity** | SQL Constraints | Application Logic / Events |
| **Redundancy** | Low | High (Product Cache) |
| **Complexity** | Low | High (Synchronization logic) |
