-- delete existing tables and types if they exist
DROP TABLE IF EXISTS voucher_detail CASCADE;
DROP TABLE IF EXISTS voucher CASCADE;
DROP TABLE IF EXISTS voucher_type CASCADE;
DROP TABLE IF EXISTS company CASCADE;
DROP TABLE IF EXISTS voucher_nos CASCADE;
DROP TYPE IF EXISTS relationship_enum CASCADE;

-- create enum type for 'relationship' column
CREATE TYPE relationship_enum AS ENUM ('one_to_one', 'one_to_many', 'many_to_one', 'many_to_many');

CREATE TABLE company (
    id INTEGER PRIMARY KEY,
    name VARCHAR(60) NOT NULL
);

CREATE TABLE voucher_type (
    id INTEGER PRIMARY KEY,
    short_form VARCHAR(4) UNIQUE NOT NULL,
    name VARCHAR(32) NOT NULL,
    dr_filter VARCHAR(1024),
    cr_filter VARCHAR(1024),
    relationship relationship_enum NOT NULL,
    many_dr BOOLEAN NOT NULL,
    many_cr BOOLEAN NOT NULL
);

CREATE TABLE voucher (
    id BIGINT PRIMARY KEY,
    voucher_no INTEGER UNIQUE NOT NULL,
    voucher_type_id INTEGER NOT NULL,
    voucher_date DATE NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    narration VARCHAR(255),
    FOREIGN KEY (voucher_type_id) REFERENCES voucher_type(id)
);

CREATE TABLE voucher_detail (
    id INTEGER PRIMARY KEY,
    voucher_id BIGINT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    drcr INTEGER CHECK (drcr IN (1, -1)),
    remark VARCHAR(30),
    FOREIGN KEY (voucher_id) REFERENCES voucher(id)
);

CREATE TABLE voucher_nos (
    series VARCHAR(12) PRIMARY KEY,
    last_no INTEGER NOT NULL
);

-- dummy data
INSERT INTO company (id, name) VALUES 
(1, 'ABC Corporation'),
(2, 'XYZ Ltd.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO voucher_type (id, short_form, name, dr_filter, cr_filter, relationship, many_dr, many_cr) VALUES
(1, 'CT', 'Contra voucher', 'Cash', 'Bank', 'one_to_one', TRUE, TRUE),
(2, 'RC', 'Receipt voucher', 'Bank', 'Cash', 'one_to_many', FALSE, TRUE),
(3, 'PY', 'Payment voucher', 'Bank', 'Vendor', 'one_to_many', TRUE, FALSE),
(4, 'SL', 'Sales voucher', 'Customer', 'Sales', 'one_to_many', FALSE, TRUE),
(5, 'PU', 'Purchase voucher', 'Purchases', 'Supplier', 'one_to_one', TRUE, TRUE),
(6, 'CN', 'Credit note voucher', 'Sales Return', 'Customer', 'many_to_one', FALSE, TRUE),
(7, 'DN', 'Debit note voucher', 'Purchase Return', 'Supplier', 'many_to_many', TRUE, TRUE),
(8, 'JV', 'Journal voucher', 'General', 'General', 'many_to_many', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO voucher (id, voucher_no, voucher_type_id, voucher_date, amount, narration) VALUES
(1001, 1, 1, '2024-11-01', 1000.00, 'Cash deposit to bank'),
(1002, 2, 2, '2024-11-02', 1500.00, 'Customer payment received'),
(1003, 3, 3, '2024-11-03', 500.00, 'Vendor payment made')
ON CONFLICT (id) DO NOTHING;

INSERT INTO voucher_detail (id, voucher_id, amount, drcr, remark) VALUES
(1, 1001, 1000.00, 1, 'Deposit'),
(2, 1002, 1500.00, -1, 'Payment received'),
(3, 1003, 500.00, 1, 'Cheque issued')
ON CONFLICT (id) DO NOTHING;

INSERT INTO voucher_nos (series, last_no) VALUES
('CT-2024', 1),
('RC-2024', 2),
('PY-2024', 3)
ON CONFLICT (series) DO NOTHING;

-- show data
SELECT 
    v.id AS voucher_id,
    vt.name AS voucher_type,
    v.voucher_date,
    v.amount,
    vd.amount AS detail_amount,
    vd.drcr,
    vd.remark
FROM 
    voucher v
JOIN 
    voucher_type vt ON v.voucher_type_id = vt.id
JOIN 
    voucher_detail vd ON v.id = vd.voucher_id;

