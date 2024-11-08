-- Drop the views if they already exist to avoid conflicts
DROP VIEW IF EXISTS account_hierarchy;
DROP VIEW IF EXISTS visual_account_hierarchy;

-- Create the account_hierarchy view to display hierarchy of accounts with concatenated account IDs
CREATE VIEW account_hierarchy AS
WITH RECURSIVE account_tree AS (
    -- Base case: Select root accounts (those without parent)
    SELECT 
        id,  -- Keep the original ID
        parent_id,
        is_group,
        name,
        CAST(id AS TEXT) AS acc_id,  -- Use the original ID without padding for root accounts
        1 AS depth  -- Initialize depth for tracking level
    FROM account
    WHERE parent_id IS NULL

    UNION ALL

    -- Recursive case: Join accounts with their parent account to build the hierarchy
    SELECT 
        acc.id,  -- Keep the original ID
        acc.parent_id,
        acc.is_group,
        acc.name,
        CONCAT(
            LPAD(CAST(at.id AS TEXT), 5, '0'),  -- Pad parent ID with zeros to make it 5 digits
            LPAD(CAST(acc.id AS TEXT), 5, '0')   -- Pad current ID with zeros to make it 5 digits
        ) AS acc_id,  -- Combine padded IDs
        at.depth + 1 AS depth
    FROM account acc
    INNER JOIN account_tree at ON acc.parent_id = at.id  -- Use at.id here
)
SELECT
    id,  -- Select account_id instead of id
    parent_id,
    is_group,
    name,
    acc_id,  -- This column shows the hierarchy of padded account IDs
    depth
FROM account_tree
ORDER BY acc_id;  -- Orders by hierarchical path


-- Create the visual_account_hierarchy view to display account names in a visual indented hierarchy
CREATE VIEW visual_account_hierarchy AS
WITH RECURSIVE account_tree AS (
    -- Base case: Select root accounts (those without parent)
    SELECT 
        id,  -- Keep the original ID
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
        acc.id,  -- Keep the original ID
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
    INNER JOIN account_tree at ON acc.parent_id = at.id  -- Use at.id here
)
SELECT
    id,  -- Select account_id instead of id
    parent_id,
    is_group,
    visual_name  -- Display visual hierarchy with indentation
FROM account_tree
ORDER BY visual_name;  -- Orders by visual name (for visual hierarchy)
