# User-Centered Operations Management UI

Redesign this desktop application as a **real-world wholesale operations system**.

The most important requirement is:

> **Design for how people actually work, not how the database is structured.**

The database contains internal IDs, order numbers, purchase numbers, package numbers, shipment numbers, etc.

These are useful for the system, but **they should NOT be the primary way users interact with the application.**

Users should primarily work with:

- Customer names
- Product names
- Product variants
- Quantities
- Factory names
- Warehouse names
- Locations
- Shipment routes
- Delivery status
- Arrival status
- Dates
- Operational actions

Internal IDs and reference numbers can still exist as **secondary metadata** when necessary.

---

# 1. Core Design Philosophy

Build the UI around:

> **What does the user need to know or do?**

NOT:

> **What database record does the user need to open?**

The design direction remains:

**Odoo's business workflow + Shopify's clarity + Linear's interaction quality**

But make the product much more **human and operational**.

It should feel like a tool used by real warehouse, purchasing, logistics, and sales staff.

---

# 2. Stop Making Internal Numbers the Main UI

Avoid screens like:

```text
Order
SO-1024
Customer
ABC Trading
Status
Pending
```

Instead:

```text
ABC Trading

12 products · 320 units

Needs purchasing

Ordered Aug 16
```

The internal order number can appear subtly:

```text
Reference: SO-1024
```

but it should NOT dominate the interface.

The same applies to:

- Purchase number
- Package number
- Shipment number
- Receiving number
- Delivery number

These are references, not the user's primary mental model.

---

# 3. Orders Page

The main Orders page should answer:

> **What orders do I need to work on?**

Instead of:

```text
Order No | Customer | Status | Date
```

use:

```text
Customer          Products        Quantity      Progress       Action
──────────────────────────────────────────────────────────────────────

ABC Trading        8 products      240 units      🟡 Purchasing
                  Blue Shirt
                  Black Pants

XYZ Shop           4 products       80 units      🔵 In Transit

Mingalar Store     12 products     320 units      🟢 Ready
```

Each row should provide useful context.

For example:

```text
ABC Trading
8 products · 240 units

2 products still need purchasing
1 shipment in transit

[View Order]
```

---

# 4. Order Detail Should Be Customer + Product First

When opening an order, the first thing users should see is:

```text
ABC Trading

8 products · 240 units
Order placed Aug 16

────────────────────────────────────

ORDER PROGRESS

Ordered
   ✓
Purchasing
   ✓
Packing
   ✓
Shipping
   ●
Arrived
   ○
Ready for customer
   ○
Delivered
   ○
```

Then:

```text
Products

Product             Ordered    Purchased    In Transit    Ready
──────────────────────────────────────────────────────────────
Blue Shirt             100        100           100          0
Black Pants             50         30            30          0
Red Shirt               90         90             0          0
```

This immediately tells the operator what is happening.

---

# 5. Use Natural Business Language

Avoid technical language such as:

```text
Purchase Allocation
Stock Allocation
Shipment Package
Receiving Item
```

These are database concepts.

The UI should translate them into business language.

For example:

| Database Concept    | UI Language              |
| ------------------- | ------------------------ |
| Purchase Allocation | Purchased for this order |
| Stock Allocation    | Reserved from warehouse  |
| Shipment Package    | Package in shipment      |
| Receiving Item      | Items received           |
| Transportation Leg  | Journey / Route          |
| Inventory           | Available stock          |
| Incoming Quantity   | On the way               |
| Reserved Quantity   | Reserved for orders      |

The database can remain technical.

The UI should not.

---

# 6. Dashboard

The dashboard should answer:

> **"What should I do today?"**

Not:

> "How many database records exist?"

Use operational sections such as:

```text
Good morning

Today's Operations

──────────────────────────────────────────────

Needs Attention

12 orders need purchasing
  → Review

4 shipments arriving today
  → Check arrivals

3 deliveries ready
  → Prepare delivery

2 shipments delayed
  → Investigate


──────────────────────────────────────────────

Orders

24    Need purchasing
18    Being prepared
12    In transit
8     Arrived
5     Ready for customer
```

Make every number clickable.

---

# 7. Use Actions, Not Just Information

Every important screen should answer:

> **What can I do next?**

For example:

```text
ABC Trading

2 products still need purchasing

[Purchase Missing Items]
```

Shipment:

```text
Shipment arriving in Yangon today

12 packages
4 customers affected

[Confirm Arrival]
```

Warehouse:

```text
25 orders can now be prepared

[View Orders]
```

The application should guide users through the workflow.

---

# 8. Purchasing

The purchasing screen should NOT primarily be a list of purchase documents.

Users think:

> "What do I need to buy?"

So make the main screen:

```text
Purchasing

Needs Purchasing

Product              Customer        Quantity      Suggested Factory
────────────────────────────────────────────────────────────────────
Blue Shirt           ABC Trading       100          Factory A
Black Pants          XYZ Shop           50          Factory B
Red Shirt            Mingalar Store     80          Factory A
```

Allow users to select multiple requirements and create a purchase.

Example:

```text
Selected: 3 items

Factory
[ Factory A ▼ ]

Products
Blue Shirt        100
Red Shirt          80
Green Shirt        50

[Create Purchase]
```

The purchase reference should be secondary.

---

# 9. Factory View

A factory page should answer:

> **What are we buying from this factory?**

Example:

```text
Factory A

12 active products
5 open purchases
340 units expected

────────────────────────────────────

Products We Buy

Blue Shirt       500 units
Red Shirt        200 units
Black Pants      120 units
```

Then:

```text
Outstanding

Blue Shirt
100 units
For ABC Trading

Red Shirt
80 units
For Mingalar Store
```

---

# 10. Shipment UI

Do not make the user search by shipment number.

Make shipment discovery based on:

**Route + location + status + date.**

Example:

```text
Shipments

────────────────────────────────────────────

Thailand → Yangon

🟢 Arriving today

12 packages
8 customers
320 units

[View Shipment]


Thailand → Mandalay

🔵 In transit

8 packages
190 units

[View Shipment]
```

This is much more meaningful than:

```text
SH-001
SH-002
SH-003
```

---

# 11. Shipment Detail

Make the route the primary visual element.

```text
Thailand → Yangon

Arriving today

────────────────────────────────────

Journey

Thailand Warehouse
       ✓
       │
       │ Truck
       ↓
Border
       ✓
       │
       │ Truck
       ↓
Yangon
       ●
```

Then:

```text
What's inside?

12 packages
320 units
8 customers
```

And:

```text
Customers affected

ABC Trading       100 units
XYZ Shop           80 units
Mingalar Store     50 units
...
```

This is much more useful operationally.

---

# 12. Important: Shipment Splitting

The system must support the real-world situation where packages are separated or redirected during transportation.

Example:

```text
Thailand
   ↓
Border
   ↓
Yangon
   ├── ABC Trading → Yangon
   ├── XYZ Shop → Yangon
   └── Mandalay packages
           ↓
        Mandalay
```

The UI should make this understandable.

Do not force users to think about database relationships.

Show:

```text
Arrived in Yangon

8 packages
6 customers

────────────────────────────

Ready for collection

ABC Trading
3 packages · 80 units

XYZ Shop
2 packages · 50 units


Continuing to Mandalay

3 packages
190 units

[View Mandalay Packages]
```

---

# 13. Receiving

Receiving should answer:

> **"What just arrived, and where should it go?"**

Example:

```text
Arrival Today

From Thailand

320 units arriving

────────────────────────────────────

Expected

Blue Shirt       100
Black Pants       80
Red Shirt         90
Green Shirt       50

────────────────────────────────────

Receiving

Blue Shirt        100 ✓
Black Pants        80 ✓
Red Shirt          85 ⚠ 5 missing
Green Shirt        50 ✓

[Confirm Receiving]
```

Do not force the warehouse worker to understand shipment IDs or receiving IDs.

---

# 14. Inventory

Inventory should be organized around:

**Product + Variant + Warehouse**

Example:

```text
Inventory

Product             Warehouse       Available    Reserved    Incoming
────────────────────────────────────────────────────────────────────
Blue Shirt / Red    Yangon              80          20          100
Blue Shirt / Blue   Yangon              40          10           50
Black Pants / M     Bangkok             120          30            0
```

Clicking a product should show:

```text
Blue Shirt

Red · Size M

Yangon Warehouse

Available: 80
Reserved: 20
Incoming: 100

────────────────────────────

Reserved for

ABC Trading       20
XYZ Shop          10

────────────────────────────

Incoming

From Thailand
100 units
Expected Aug 20
```

This is far more useful than showing `inventory_id`.

---

# 15. Delivery

Delivery should focus on:

> **Who is receiving what, and is it ready?**

Example:

```text
Ready for Customer

ABC Trading

3 products
80 units

Arrived in Yangon
Aug 17

────────────────────────────

Blue Shirt        50
Black Pants       20
Red Shirt         10

[Prepare Delivery]
[Mark as Delivered]
```

If customers collect goods themselves, use language such as:

```text
Ready for collection
```

rather than automatically assuming:

```text
Delivered
```

The workflow should distinguish between:

- Arrived at customer's city
- Ready for collection
- Out for delivery
- Collected
- Delivered

Choose terminology that matches the actual business process.

---

# 16. Customer Page

Customer should be a useful operational workspace.

Example:

```text
ABC Trading

Phone
Address

────────────────────────────────────

Current Orders

8 products
240 units

2 shipments in transit
1 shipment ready for collection

────────────────────────────────────

Recent Orders

Aug 16
8 products
In transit

Aug 10
5 products
Completed
```

Users should not need to remember order numbers.

---

# 17. Product Page

Product should show the entire supply situation.

Example:

```text
Blue Shirt

Variants
Red · M
Red · L
Blue · M
Blue · L

────────────────────────────────────

Demand

120 units ordered

────────────────────────────────────

Supply

80 units in warehouse
100 units incoming
40 units being purchased

────────────────────────────────────

Available to Fulfill

80 units
```

This allows purchasing staff to understand supply and demand immediately.

---

# 18. Search

Global search should support natural business searches.

Examples:

```text
"ABC Trading"

"Blue Shirt"

"orders waiting for purchase"

"shipments arriving today"

"orders ready for collection"

"products low in stock"
```

Where possible, support intelligent filtering.

The user should not have to know internal reference numbers.

Reference numbers can still be searched when someone has one.

---

# 19. Filters Should Use Business Concepts

Instead of:

```text
Status
Created Date
Updated Date
```

provide useful operational filters:

```text
Needs purchasing
Partially purchased
Waiting for shipment
In transit
Arriving today
Arrived
Ready for collection
Delivered
Delayed
```

For inventory:

```text
Low stock
Reserved
Incoming
Available
```

For purchasing:

```text
Needs purchase
Partially purchased
Waiting from factory
Ready to receive
```

---

# 20. Detail Pages Should Be Workspaces

Do NOT create pages that look like:

```text
Order ID: 123
Customer ID: 456
Status: 2
Created At: ...
Updated At: ...
```

Instead create human-readable workspaces.

Every detail page should have:

### Header

Who/what is this?

### Current status

What is happening now?

### Progress

How far has it gone?

### Items

What products/quantities are involved?

### Related records

What else is connected?

### Timeline

What happened?

### Next actions

What should the user do?

---

# 21. Internal IDs

Internal identifiers still exist.

But display them as secondary information.

Example:

```text
ABC Trading
8 products · 240 units
In Transit

Reference: SO-1024
```

Not:

```text
SO-1024
ABC Trading
```

Users can copy/reference the number when needed, but it should not dominate the UI.

---

# 22. Tables Should Be Human-Readable

Avoid:

```text
order_id
customer_id
variant_id
purchase_id
shipment_id
warehouse_id
```

Show:

```text
Customer
Product
Factory
Shipment
Warehouse
```

Never expose database terminology unless the user is an administrator/debugging the system.

---

# 23. Relationships Should Be Human-Readable

Instead of:

```text
Order
 ↓
Purchase Allocation
 ↓
Purchase Item
```

show:

```text
ABC Trading ordered 100 Blue Shirts

Purchased:
100 units from Factory A

Packed:
100 units

In transit:
100 units

Arrived:
0 units

Remaining:
100 units
```

This is what the user actually needs.

---

# 24. The Main Mental Model

The application should revolve around these questions:

### Sales

**What did the customer order?**

### Purchasing

**What do we need to buy?**

### Factory

**What is the factory supplying?**

### Packing

**What has been packed?**

### Logistics

**Where is the shipment now?**

### Receiving

**What has arrived?**

### Inventory

**What do we have?**

### Fulfillment

**What can we give the customer now?**

### Delivery

**What has the customer received?**

If a screen does not help answer one of these questions, reconsider whether it belongs in the main workflow.

---

# 25. Final Design Goal

Create a system where a new employee can sit down and understand it without learning the database.

They should be able to look at the dashboard and understand:

> "These 12 orders need purchasing."

Then:

> "ABC Trading needs 100 Blue Shirts."

Then:

> "Factory A can supply them."

Then:

> "Those items are currently in the Thailand → Yangon shipment."

Then:

> "They arrived in Yangon."

Then:

> "ABC Trading can collect them."

That entire journey should feel natural.

The user should **never need to understand the ERD to use the application.**

The ERD is the foundation.

**The workflow is the product.**

Build the UI around the workflow.
