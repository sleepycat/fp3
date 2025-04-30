CREATE TABLE seizures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    substance TEXT NOT NULL,
    amount TEXT NOT NULL,
    seized_on date NOT NULL,
    reported_on date NOT NULL
);
