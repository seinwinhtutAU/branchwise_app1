erDiagram

    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : ordered

    FACTORY ||--o{ PURCHASE : receives
    PURCHASE ||--|{ PURCHASE_ITEM : contains
    PRODUCT ||--o{ PURCHASE_ITEM : purchased

    ORDER_ITEM ||--o{ PURCHASE_ALLOCATION : fulfilled_by
    PURCHASE_ITEM ||--o{ PURCHASE_ALLOCATION : fulfills


    PURCHASE ||--o{ PACKAGE : creates
    PACKAGE ||--|{ PACKAGE_ITEM : contains
    PRODUCT ||--o{ PACKAGE_ITEM : contains


    %% LOGISTICS
    SHIPMENT ||--|{ SHIPMENT_PACKAGE : contains
    PACKAGE ||--o{ SHIPMENT_PACKAGE : included_in

    SHIPMENT ||--|{ TRANSPORTATION_LEG : has


    %% RECEIVING
    SHIPMENT ||--o| RECEIVING : arrives
    RECEIVING ||--|{ RECEIVING_ITEM : contains
    PRODUCT ||--o{ RECEIVING_ITEM : received


    %% INVENTORY
    WAREHOUSE ||--o{ INVENTORY : stores
    PRODUCT ||--o{ INVENTORY : stocked

    RECEIVING_ITEM }o--|| INVENTORY : adds_to

    ORDER_ITEM ||--o{ STOCK_ALLOCATION : allocated
    INVENTORY ||--o{ STOCK_ALLOCATION : from


    %% DELIVERY
    ORDER ||--o{ DELIVERY : delivered
    DELIVERY ||--|{ DELIVERY_ITEM : contains
    PRODUCT ||--o{ DELIVERY_ITEM : delivered


    CUSTOMER {
        bigint customer_id PK
        string name
        string phone
        string address
    }

    ORDER {
        bigint order_id PK
        string order_no UK
        bigint customer_id FK
        date order_date
        string source
        string status
        decimal total_amount
    }

    ORDER_ITEM {
        bigint order_item_id PK
        bigint order_id FK
        bigint product_id FK
        int quantity
        decimal price
    }

    PRODUCT {
        bigint product_id PK
        string product_code UK
        string name
        string color
        string size
    }

    FACTORY {
        bigint factory_id PK
        string name
        string phone
    }

    PURCHASE {
        bigint purchase_id PK
        string purchase_no UK
        bigint factory_id FK
        date purchase_date
        string status
    }

    PURCHASE_ITEM {
        bigint purchase_item_id PK
        bigint purchase_id FK
        bigint product_id FK
        int quantity
        decimal buying_price
    }

    PURCHASE_ALLOCATION {
        bigint allocation_id PK
        bigint purchase_item_id FK
        bigint order_item_id FK
        int quantity
    }

    PACKAGE {
        bigint package_id PK
        string package_no UK
        bigint purchase_id FK
        string status
    }

    PACKAGE_ITEM {
        bigint package_item_id PK
        bigint package_id FK
        bigint product_id FK
        int quantity
    }

    SHIPMENT {
        bigint shipment_id PK
        string shipment_no UK
        date shipment_date
        date expected_arrival
        string status
    }

    SHIPMENT_PACKAGE {
        bigint shipment_package_id PK
        bigint shipment_id FK
        bigint package_id FK
    }

    TRANSPORTATION_LEG {
        bigint leg_id PK
        bigint shipment_id FK
        string from_location
        string to_location
        string carrier
        string vehicle_no
        date departure_date
        date arrival_date
        decimal transport_cost
        string status
    }

    RECEIVING {
        bigint receiving_id PK
        bigint shipment_id FK
        bigint warehouse_id FK
        date received_date
        string status
    }

    RECEIVING_ITEM {
        bigint receiving_item_id PK
        bigint receiving_id FK
        bigint product_id FK
        int quantity_expected
        int quantity_received
    }

    WAREHOUSE {
        bigint warehouse_id PK
        string name
    }

    INVENTORY {
        bigint inventory_id PK
        bigint warehouse_id FK
        bigint product_id FK
        int quantity
        int reserved_quantity
    }

    STOCK_ALLOCATION {
        bigint allocation_id PK
        bigint order_item_id FK
        bigint inventory_id FK
        int quantity
    }

    DELIVERY {
        bigint delivery_id PK
        bigint order_id FK
        date delivery_date
        string status
    }

    DELIVERY_ITEM {
        bigint delivery_item_id PK
        bigint delivery_id FK
        bigint product_id FK
        int quantity
    }
