SELECT
    sm.id AS move_id,
    sm.date AS move_date,
    sm.product_id,
    pt.name AS product_name,
    sm.location_id,
    src.name AS source_location,
    sm.location_dest_id,
    dest.name AS dest_location,
    CASE
        WHEN sm.location_dest_id = 8 THEN -sm.product_uom_qty  -- Outflow from Stock
        WHEN sm.location_id = 8 THEN sm.product_uom_qty        -- Inflow to Stock
        ELSE 0
    END AS quantity,
    sm.state
FROM stock_move sm
JOIN product_product pp ON sm.product_id = pp.id
JOIN product_template pt ON pp.product_tmpl_id = pt.id
LEFT JOIN stock_location src ON sm.location_id = src.id
LEFT JOIN stock_location dest ON sm.location_dest_id = dest.id
WHERE sm.state = 'done'
  AND (sm.location_id = 8 OR sm.location_dest_id = 8)
ORDER BY sm.date;