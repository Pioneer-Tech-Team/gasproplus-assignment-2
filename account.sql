-- Drop views 
DROP VIEW IF EXISTS account_hierarchy;
DROP VIEW IF EXISTS visual_account_hierarchy;

-- Create the account_hierarchy view to display hierarchy of accounts with concatenated ID paths
CREATE VIEW account_hierarchy AS
WITH RECURSIVE account_tree AS (
    -- Base case: Select root accounts (those without parent)
    SELECT 
        id,
        parent_id,
        is_group,
        name,
        LPAD(CAST(id AS TEXT), 10, '0') AS full_path,  -- Pad with zeros to the left, 10 characters wide
        1 AS depth  -- Initialize depth for tracking level
    FROM account
    WHERE parent_id IS NULL

    UNION ALL

    -- Recursive case: Join accounts with their parent account to build the hierarchy
    SELECT 
        acc.id,
        acc.parent_id,
        acc.is_group,
        acc.name,
        CONCAT(at.full_path, LPAD(CAST(acc.id AS TEXT), 10, '0')) AS full_path,  -- Concatenate padded IDs for hierarchical path
        at.depth + 1 AS depth
    FROM account acc
    INNER JOIN account_tree at ON acc.parent_id = at.id
)
SELECT
    id,
    parent_id,
    is_group,
    name,
    full_path,  -- This column shows the hierarchy of IDs
    depth
FROM account_tree
ORDER BY full_path;  -- Orders by hierarchical path


-- Create the visual_account_hierarchy view to display account names in a visual indented hierarchy
CREATE VIEW visual_account_hierarchy AS
WITH RECURSIVE account_tree AS (
    -- Base case: Select root accounts (those without parent)
    SELECT 
        id,
        parent_id,
        is_group,
        name,
        CAST(name AS TEXT) AS visual_name,  -- Start with the account name
        1 AS depth  -- Initialize depth for indentation
    FROM account
    WHERE parent_id IS NULL

    UNION ALL

    -- Recursive case: Join accounts with their parent account
    SELECT 
        acc.id,
        acc.parent_id,
        acc.is_group,
        acc.name,
        CONCAT(
            REPEAT('    ', at.depth),  -- Add indentation based on depth
            CASE WHEN acc.is_group THEN '+ ' ELSE '- ' END,
            acc.name
        ) AS visual_name,
        at.depth + 1 AS depth
    FROM account acc
    INNER JOIN account_tree at ON acc.parent_id = at.id
)
SELECT
    id,
    parent_id,
    is_group,
    visual_name  -- Display visual hierarchy with indentation
FROM account_tree
ORDER BY visual_name;  -- Orders by visual name (for visual hierarchy)
