-- ────────────────────────────────────────────────────────────
--  1. Tổng quan doanh thu
-- ────────────────────────────────────────────────────────────
CREATE OR ALTER PROCEDURE rpt_revenue_summary
    @FromDate DATE,
    @ToDate   DATE
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        COALESCE(SUM(CASE
                         WHEN i.status = 'PAID'
                             THEN i.final_amount
                         ELSE 0
            END), 0) AS total_revenue,
        COUNT(DISTINCT o.id) AS total_orders,
        SUM(CASE
                WHEN o.status = 'DELIVERED'
                    THEN 1
                ELSE 0
            END) AS done_orders,
        SUM(CASE
                WHEN o.status = 'CANCELLED'
                    THEN 1
                ELSE 0
            END) AS cancelled_orders,
        COALESCE(AVG(CASE
                         WHEN i.status = 'PAID'
                             THEN i.final_amount
            END), 0) AS avg_order_value,
        COALESCE(SUM(CASE
                         WHEN o.payment_method = 'COD'
                             AND i.status = 'PAID'
                             THEN i.final_amount
                         ELSE 0
            END), 0) AS cod_revenue,
        COALESCE(SUM(CASE
                         WHEN o.payment_method = 'VNPAY'
                             AND i.status = 'PAID'
                             THEN i.final_amount
                         ELSE 0
            END), 0) AS vnpay_revenue
    FROM invoices i
             JOIN orders o ON o.id = i.order_id
    WHERE CAST(i.issue_date AS DATE)
              BETWEEN @FromDate AND @ToDate;
END;


-- ────────────────────────────────────────────────────────────
--  2. Doanh thu theo ngày
-- ────────────────────────────────────────────────────────────
CREATE OR ALTER PROCEDURE rpt_revenue_by_day
    @FromDate DATE,
    @ToDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    WITH DateRange AS (
        SELECT @FromDate AS dt
        UNION ALL
        SELECT DATEADD(DAY, 1, dt)
        FROM DateRange
        WHERE dt < @ToDate
    )
    SELECT
        FORMAT(d.dt, 'dd/MM') AS day,
        COALESCE(SUM(o.final_amount),0) AS revenue,
        COUNT(o.id) AS orders
    FROM DateRange d
             LEFT JOIN orders o
                       ON CAST(o.created_at AS DATE) = d.dt
                           AND o.status = 'DELIVERED'
    GROUP BY d.dt
    ORDER BY d.dt
    OPTION (MAXRECURSION 365);
END;



-- ────────────────────────────────────────────────────────────
--  3. Top sản phẩm bán chạy
-- ────────────────────────────────────────────────────────────
CREATE OR ALTER PROCEDURE rpt_top_products
    @FromDate DATE,
    @ToDate   DATE,
    @TopN     INT = 5
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP (@TopN)
        p.name                                  AS product_name,
        c.name                                  AS category,
        SUM(oi.quantity)                        AS sold,
        SUM(oi.quantity * oi.price_at_purchase) AS revenue
    FROM order_items oi
             JOIN product_variants pv ON pv.id = oi.variant_id
             JOIN products         p  ON p.id  = pv.product_id
             JOIN categories       c  ON c.id  = p.category_id
             JOIN orders           o  ON o.id  = oi.order_id
    WHERE o.status = 'DELIVERED'
      AND CAST(o.created_at AS DATE) BETWEEN @FromDate AND @ToDate
    GROUP BY p.id, p.name, c.name
    ORDER BY SUM(oi.quantity) DESC;
END;



EXEC rpt_revenue_summary @FromDate = '2026-05-11', @ToDate = '2026-05-11';
EXEC rpt_revenue_by_day  @FromDate = '2026-05-11', @ToDate = '2026-05-11';
EXEC rpt_top_products    @FromDate = '2026-05-11', @ToDate = '2026-05-11', @TopN = 5;

EXEC rpt_revenue_summary @FromDate = '2026-05-01', @ToDate = '2026-05-11';
EXEC rpt_revenue_by_day  @FromDate = '2026-05-01', @ToDate = '2026-05-11';
EXEC rpt_top_products    @FromDate = '2026-05-01', @ToDate = '2026-05-11', @TopN = 10;