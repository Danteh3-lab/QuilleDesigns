-- Appointments for small jobs (booking system) and enquiries for larger jobs (contact form).
CREATE TABLE IF NOT EXISTS appointments (
 id TEXT PRIMARY KEY,
 service TEXT NOT NULL CHECK(service IN ('logo','poster','business-card')),
 slot_date TEXT NOT NULL CHECK(slot_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
 slot_time TEXT NOT NULL CHECK(slot_time GLOB '[0-9][0-9]:[0-9][0-9]'),
 name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
 contact_method TEXT NOT NULL CHECK(contact_method IN ('phone','whatsapp','video')),
 notes TEXT NOT NULL, language TEXT NOT NULL CHECK(language IN ('nl','en')),
 status TEXT NOT NULL CHECK(status IN ('booked','cancelled')),
 created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS appointment_slot_booked ON appointments(slot_date,slot_time) WHERE status='booked';
CREATE INDEX IF NOT EXISTS appointment_schedule ON appointments(slot_date,slot_time,status);
CREATE INDEX IF NOT EXISTS appointment_email ON appointments(email,status,slot_date);
CREATE TABLE IF NOT EXISTS closed_days (day TEXT PRIMARY KEY CHECK(day GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'), created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS inquiries (
 id TEXT PRIMARY KEY,
 services TEXT NOT NULL,
 name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, company TEXT NOT NULL,
 message TEXT NOT NULL, language TEXT NOT NULL CHECK(language IN ('nl','en')),
 status TEXT NOT NULL CHECK(status IN ('new','handled')),
 created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS inquiry_inbox ON inquiries(status,created_at);
CREATE INDEX IF NOT EXISTS inquiry_email ON inquiries(email,created_at);
