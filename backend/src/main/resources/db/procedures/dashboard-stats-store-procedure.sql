CREATE OR ALTER PROCEDURE sp_get_dashboard_stats
    @FromDate DATE,
    @ToDate DATE
AS
BEGIN
    SELECT
        (SELECT COALESCE(SUM(final_amount), 0)
         FROM invoices i
            WHERE status = 'PAID' AND CAST(issue_date AS DATE) BETWEEN @FromDate AND @ToDate) AS revenue,

        (SELECT COUNT(*) FROM orders o WHERE CAST(created_at AS DATE) BETWEEN  @FromDate AND @ToDate) as newOrders,

        (SELECT COUNT(*) FROM users u
                         WHERE role = 'CUSTOMER' AND
                               CAST(created_at AS DATE) BETWEEN @FromDate AND @ToDate) as newCustomers,

        (SELECT COUNT(*) FROM products p WHERE deleted = 0) as totalProducts;
END

exec sp_get_dashboard_stats @FromDate = '2026-05-11', @ToDate = '2026-05-11';