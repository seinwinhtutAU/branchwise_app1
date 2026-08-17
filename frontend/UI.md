# Desktop Operations App — UI/UX Redesign

You are a senior product designer and frontend engineer.

Redesign the UI of this application into a **professional desktop-first operations management system**.

The product manages the complete wholesale fulfillment lifecycle:

**Customer Order → Purchasing → Packages → Shipment → Transportation Legs → Receiving → Inventory → Delivery**

The existing database/ERD already defines the business domain. Your job is to create the best possible user experience around it.

---

## 1. Design Philosophy

Use this combination as the primary design direction:

> **Odoo's business workflow + Shopify's clarity + Linear's interaction quality**

Do NOT copy any of these products directly.

Instead:

### From Odoo

Take:

- Clear business modules
- Strong relationships between business documents
- Workflow-oriented navigation
- Operational visibility
- ERP-style data organization

### From Shopify Admin

Take:

- Clean tables
- Excellent filtering
- Search-first interactions
- Clear detail pages
- Expandable rows
- Simple status indicators
- Easy editing
- Strong information hierarchy

### From Linear

Take:

- Fast interactions
- Keyboard-friendly UX
- Minimal visual noise
- Smooth transitions
- Command/search patterns
- Inline editing
- Excellent spacing and typography
- Dense information without feeling cluttered

The result should feel like a **modern professional operations platform**, not a generic CRUD admin dashboard.

---

# 2. Core UX Principle

The application should help users answer:

> **"What is happening with my order right now?"**

without requiring them to manually navigate through multiple modules.

The system should make relationships visible.

For example:

```text
Customer Order
      ↓
Order Items
      ↓
Purchase
      ↓
Package
      ↓
Shipment
      ↓
Transportation Legs
      ↓
Receiving
      ↓
Inventory
      ↓
Delivery
```

A user should be able to follow this entire flow from one place.

---

# 3. Main Navigation

Create a clean desktop sidebar.

Recommended structure:

```text
WORKSPACE

Dashboard

ORDERS
  Orders
  Customers

PROCUREMENT
  Purchases
  Factories
  Packages

LOGISTICS
  Shipments
  Transportation

INVENTORY
  Receiving
  Inventory
  Warehouses

FULFILLMENT
  Deliveries

CATALOG
  Products

ANALYTICS
  Reports

SYSTEM
  Settings
```

Do not blindly follow this structure if you discover a better information architecture.

The navigation should reflect **how users work**, not how database tables are structured.

---

# 4. Dashboard

The dashboard should be an **operations cockpit**, not a collection of meaningless charts.

Prioritize actionable information.

Example:

```text
Good morning

Operations Overview

┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Open Orders  │ To Purchase  │ In Transit   │ To Receive   │
│     128      │      24      │      17      │      9       │
└──────────────┴──────────────┴──────────────┴──────────────┘

Orders Requiring Attention

SO-1024   Partially fulfilled
SO-1031   Waiting for purchase
SO-1042   Shipment delayed
SO-1048   Ready for delivery

Shipment Activity

Shipment     Route              Status
SH-001       Thailand → Myanmar  In Transit
SH-002       Factory → Warehouse  Delayed
```

Focus on:

- What needs attention
- What is delayed
- What is waiting
- What is currently moving
- What is ready for the next step

Avoid excessive charts.

---

# 5. List Pages

Every major entity should have a consistent list experience.

For example:

```text
Orders

[ Search orders... ]

[Status ▼] [Customer ▼] [Date ▼] [More Filters]

────────────────────────────────────────────────────────

Order       Customer       Items    Status        Date
SO-1024     ABC Trading    5        In Transit    Aug 16
SO-1025     XYZ Shop      12        Partial       Aug 16
SO-1026     John Trading   3        Delivered     Aug 15
```

Requirements:

- Fast search
- Useful filters
- Sortable columns
- Pagination
- Bulk selection where useful
- Column customization where useful
- Clear status badges
- Row hover states
- Click row → detail
- Inline editing where appropriate
- Expandable rows where one-to-many data would otherwise make the table unusable

Do not put too much information into one row.

---

# 6. Important: One-to-Many Data

An Order can contain many Order Items.

Do NOT try to display all products in a single flat row.

Instead use an expandable row:

```text
SO-1024 | ABC Trading | 5 products | Partial | Aug 16
   ↓
   ┌─────────────────────────────────────────────┐
   │ Product        Ordered   Purchased Delivered │
   │ Product A       100        100        60     │
   │ Product B        50         30         0     │
   │ Product C        20         20        20     │
   └─────────────────────────────────────────────┘
```

Apply the same principle to:

- Order → Order Items
- Purchase → Purchase Items
- Package → Package Items
- Shipment → Packages
- Receiving → Receiving Items
- Delivery → Delivery Items

Use expandable sections, drawers, tabs, or nested tables where appropriate.

---

# 7. Order Detail Page

The Order detail page is one of the most important screens.

It should not simply be a CRUD form.

Design it as an **order workspace**.

Example structure:

```text
← Orders

SO-1024
ABC Trading
Partially Fulfilled

[ Edit ] [ Add Purchase ] [ Create Delivery ] [ More ]

────────────────────────────────────────────

Order Progress

Ordered
   ↓
Purchased
   ↓
Packed
   ↓
Shipped
   ↓
Received
   ↓
Delivered

────────────────────────────────────────────

Order Items

Product        Ordered    Purchased    Delivered
Product A      100        100          60
Product B       50         30            0
Product C       20         20           20

────────────────────────────────────────────

Fulfillment

Purchase #PO-001
      ↓
Package #PK-001
      ↓
Shipment #SH-001
      ↓
Receiving #RC-001
      ↓
Delivery #DL-001
```

The user should immediately understand:

- What was ordered
- What has been purchased
- What has been packaged
- What has shipped
- What has arrived
- What is in inventory
- What has been delivered
- What remains outstanding

---

# 8. Shipment Experience

Shipment should be treated as a major operational object.

Create a shipment detail page with:

### Header

```text
SH-001

Thailand → Myanmar

In Transit

Expected arrival:
Aug 20, 2026
```

### Shipment contents

Show packages included in the shipment.

### Transportation timeline

Make transportation legs visually understandable:

```text
Bangkok Warehouse
      │
      │ Truck
      │ Aug 17
      ↓
Mae Sot
      │
      │ Truck
      │ Aug 18
      ↓
Yangon Warehouse
      │
      ↓
Arrived
```

Each transportation leg should show:

- From
- To
- Carrier
- Vehicle
- Departure
- Arrival
- Cost
- Status

The user should be able to see the entire journey without opening every leg individually.

---

# 9. Inventory Experience

Inventory should be operational rather than just a database table.

Show:

```text
Product       Warehouse       Available    Reserved
Product A     Bangkok         120          30
Product A     Yangon           80          20
Product B     Bangkok           50          10
```

Make it easy to understand:

**Available = Quantity - Reserved**

Show warnings for:

- Low stock
- Reserved stock
- Incoming stock
- Stock allocated to orders

Where useful, show:

```text
Available
+ Incoming
- Reserved
= Expected Available
```

---

# 10. Status Design

Create a consistent status system across the application.

Statuses should be:

- Easy to recognize
- Consistent
- Visually subtle
- Never dependent only on color

Use text + icon where useful.

Avoid huge colorful badges everywhere.

Status should communicate operational meaning.

Example:

```text
Draft
Pending
Processing
Partially Fulfilled
In Transit
Received
Delivered
Cancelled
Delayed
```

Do not invent unnecessary statuses.

---

# 11. Editing Experience

Avoid forcing users into large forms whenever possible.

Prefer:

- Inline editing
- Editable table rows
- Side drawers
- Modal dialogs for small actions
- Full pages for complex workflows

For example:

```text
Order Item

Product     Quantity     Price
Product A   [100]        [120.00]
Product B   [50 ]        [150.00]

                         [Save]
```

Users should be able to edit an existing row without losing context.

---

# 12. Create Workflow

Creating business documents should feel simple.

For example:

```text
Create Purchase

Factory
[ Select factory ]

Items
┌─────────────────────────────────────┐
│ Product     Quantity     Price      │
│ Product A   100          20.00      │
│ Product B    50          30.00      │
└─────────────────────────────────────┘

[ + Add Product ]

                    [Cancel] [Create Purchase]
```

Do not create unnecessarily complicated multi-step wizards.

Only use a wizard when the workflow genuinely requires multiple stages.

---

# 13. Search

Create a strong global search.

Users should be able to search:

- Order number
- Customer
- Product
- Purchase number
- Package number
- Shipment number
- Warehouse
- Factory

The search should allow quick navigation.

Example:

```text
Search...

Orders
  SO-1024   ABC Trading

Shipments
  SH-001    Thailand → Myanmar

Products
  PROD-001  Blue Shirt
```

Keyboard shortcut:

```text
⌘ K
```

or the appropriate shortcut for the platform.

---

# 14. Visual Design

Use a professional blue-based design system.

Recommended direction:

- Primary: modern blue
- Background: very light neutral gray
- Cards: white
- Text: dark navy/charcoal
- Borders: subtle
- Success/warning/error colors used sparingly

The UI should feel:

**Clean + calm + professional + trustworthy**

Avoid:

- Excessive gradients
- Excessive shadows
- Huge cards
- Oversized typography
- Excessive rounded corners
- Too many colors
- Dashboard decoration without functional purpose

---

# 15. Typography

Prioritize readability.

Use a modern UI font such as:

- Inter
- Geist
- DM Sans

Use clear hierarchy:

```text
Page title
Section title
Body
Secondary information
Metadata
```

Do not make everything large.

This is a data-heavy desktop application.

Information density matters.

---

# 16. Desktop First

This is primarily a **desktop operations application**.

Optimize for:

- 1280px+
- 1440px
- 1920px

Use the available horizontal space intelligently.

Do not simply stretch everything.

Tables should take advantage of desktop width.

Side panels and drawers should preserve context.

---

# 17. Responsive Behavior

Although desktop is the priority, the application should remain usable on smaller screens.

For tablet/mobile:

- Convert sidebar into navigation drawer
- Convert large tables into cards or horizontally scrollable tables
- Move secondary information into drawers
- Keep primary actions accessible

Do not attempt to squeeze the desktop layout onto mobile.

---

# 18. Interaction Quality

The application should feel fast.

Implement:

- Optimistic UI where safe
- Loading skeletons
- Proper empty states
- Proper error states
- Toast notifications
- Hover states
- Keyboard navigation
- Focus states
- Smooth but subtle transitions
- Confirmation only for destructive actions

Avoid unnecessary animations.

Every interaction should feel intentional.

---

# 19. Empty States

Do not show blank screens.

Example:

```text
No shipments yet

Shipments will appear here when packages are assigned
to a shipment.

[ Create Shipment ]
```

Empty states should explain:

1. What is missing
2. Why it matters
3. What the user can do next

---

# 20. Loading States

Never make the application look frozen.

Use:

- Skeleton tables
- Skeleton detail sections
- Button loading states
- Progressive loading where appropriate

Avoid full-screen spinners unless absolutely necessary.

---

# 21. Error Handling

Errors should be understandable.

Bad:

```text
500 Internal Server Error
```

Better:

```text
Unable to create shipment

The shipment could not be saved.
Please try again.

[ Try Again ]
```

Preserve user-entered data whenever possible.

---

# 22. Database Relationships Should Become UX

The ERD is not just a backend structure.

Turn relationships into useful navigation.

For example:

```text
Customer
   ↓
Orders
   ↓
Order Items
   ↓
Purchases
   ↓
Packages
   ↓
Shipments
   ↓
Receiving
   ↓
Inventory
   ↓
Deliveries
```

Users should be able to click between related records.

Example:

```text
Purchase #PO-001

Related Orders
┌───────────────────────────────┐
│ SO-1024   ABC Trading         │
│ SO-1031   XYZ Shop            │
└───────────────────────────────┘

Packages
┌───────────────────────────────┐
│ PK-001    20 items            │
│ PK-002    35 items            │
└───────────────────────────────┘
```

---

# 23. Important Product Decision

Do NOT organize the UI around database tables.

The database contains:

```text
CUSTOMER
ORDER
ORDER_ITEM
PRODUCT
FACTORY
PURCHASE
PURCHASE_ITEM
PACKAGE
PACKAGE_ITEM
SHIPMENT
SHIPMENT_PACKAGE
TRANSPORTATION_LEG
RECEIVING
RECEIVING_ITEM
WAREHOUSE
INVENTORY
STOCK_ALLOCATION
DELIVERY
DELIVERY_ITEM
```

But the user does not think:

> "I need to open the ORDER_ITEM table."

They think:

> "I need to see which products in this order have arrived."

Design around **user tasks and workflows**, not entities.

---

# 24. Reusable Design System

Create reusable components for:

- DataTable
- SearchBar
- FilterBar
- StatusBadge
- EntityLink
- DetailHeader
- Section
- ExpandableRow
- SideDrawer
- Modal
- Timeline
- ActivityFeed
- EmptyState
- LoadingState
- ErrorState
- ConfirmDialog
- InlineEditor
- QuantityInput
- ProductSelector
- CustomerSelector
- FactorySelector
- WarehouseSelector

Do not implement the same UI pattern differently on every page.

---

# 25. Performance

The application may contain large datasets.

Design for performance from the beginning.

Use:

- Server-side pagination
- Server-side filtering
- Debounced search
- Lazy loading
- Virtualized tables when appropriate
- Avoid loading unnecessary relationships
- Avoid huge API responses
- Cache stable reference data
- Keep detail pages modular

The UI should remain responsive even with thousands of orders, products, or inventory records.

---

# 26. What I Want You To Do

First, inspect the existing application and understand:

1. Current routes
2. Current components
3. Current data model
4. Current API structure
5. Existing design system
6. Existing reusable components
7. Current UX problems

Then redesign the application systematically.

Do NOT blindly rewrite everything.

Preserve working business logic unless there is a clear reason to change it.

Prioritize the most important user workflows first:

1. Dashboard
2. Orders
3. Order Detail
4. Purchases
5. Packages
6. Shipments
7. Transportation Legs
8. Receiving
9. Inventory
10. Deliveries

---

# 27. Quality Bar

Before considering the redesign complete, ask:

### Can a user quickly answer:

- What orders need attention?
- Which orders are partially fulfilled?
- What still needs to be purchased?
- Which shipments are currently in transit?
- Where is a shipment right now?
- What has arrived?
- What inventory is available?
- Which orders are ready for delivery?
- What is delayed?

If the UI cannot answer these questions quickly, improve the design.

---

# Final Direction

Build a UI that feels like:

> **Odoo's operational depth**
>
> - **Shopify Admin's simplicity**
>
> - **Linear's speed and interaction quality**

But make it a **coherent product of its own**.

Do not make it look like a template.

Do not create a generic admin dashboard.

Do not create one CRUD page per database table.

Design a **real operations workspace** where the entire order-to-delivery lifecycle is visible, connected, and easy to operate.

Use your own product-design judgment to improve anything that makes the workflow clearer, faster, or easier to understand.
