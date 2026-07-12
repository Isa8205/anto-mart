use std::fs::OpenOptions;
use std::io::{Result, Write};

const WIDTH: usize = 48;

fn center(text: &str) -> String {
    format!("{:^width$}", text, width = WIDTH)
}

fn separator() -> String {
    "-".repeat(WIDTH)
}

fn item_line(name: &str, qty: u32, total: f64) -> String {
    format!("{:<32}{:>4}{:>12.2}", name, qty, total)
}

fn total_line(label: &str, value: f64) -> String {
    format!("{:<36}{:>12.2}", label, value)
}

fn main() -> Result<()> {
    let mut printer = OpenOptions::new()
        .write(true)
        .open("/dev/usb/lp0")?;

    // ESC @ Initialize printer
    printer.write_all(b"\x1B\x40")?;

    // Center alignment
    printer.write_all(b"\x1B\x61\x01")?;

    // Center alignment
    printer.write_all(b"\x1B\x61\x01")?;

    // Double width + height
    

    // Double width + height
    printer.write_all(b"\x1D\x21\x11")?;

    // Bold ON
    printer.write_all(b"\x1B\x45\x01")?;
    printer.write_all(b"KIBET MART\n")?;

    // Normal size
    printer.write_all(b"\x1D\x21\x00")?;

    // Bold OFF
    printer.write_all(b"\x1B\x45\x00")?;

    printer.write_all(format!("{}\n", center("Moi Avenue, Nairobi CBD")).as_bytes())?;
    printer.write_all(format!("{}\n", center("Nairobi, Kenya")).as_bytes())?;
    printer.write_all(format!("{}\n", center("Tel: +254 700 123 456")).as_bytes())?;
    printer.write_all(format!("{}\n", center("PIN: P051234567X")).as_bytes())?;
    printer.write_all(b"\n")?;

    // Left alignment
    printer.write_all(b"\x1B\x61\x00")?;

    printer.write_all(format!("{}\n", separator()).as_bytes())?;
    printer.write_all(b"Receipt #: 000123\n")?;
    printer.write_all(b"Date: 2026-05-27 10:45\n")?;
    printer.write_all(b"Cashier: Admin\n")?;
    printer.write_all(format!("{}\n", separator()).as_bytes())?;

    printer.write_all(
        format!("{:<32}{:>4}{:>12}\n", "Item", "Qty", "Total").as_bytes(),
    )?;

    printer.write_all(format!("{}\n", separator()).as_bytes())?;

    printer.write_all(item_line("Milk 500ml", 2, 240.00).as_bytes())?;
    printer.write_all(b"\n")?;

    printer.write_all(item_line("Bread White", 1, 120.00).as_bytes())?;
    printer.write_all(b"\n")?;

    printer.write_all(item_line("Sugar 1kg", 1, 180.00).as_bytes())?;
    printer.write_all(b"\n")?;

    printer.write_all(item_line("Cooking Oil 1L", 1, 350.00).as_bytes())?;
    printer.write_all(b"\n")?;

    printer.write_all(item_line("Soda 500ml", 3, 180.00).as_bytes())?;
    printer.write_all(b"\n")?;

    printer.write_all(format!("{}\n", separator()).as_bytes())?;

    printer.write_all(total_line("Subtotal", 1070.00).as_bytes())?;
    printer.write_all(b"\n")?;

    printer.write_all(total_line("VAT (16%)", 147.59).as_bytes())?;
    printer.write_all(b"\n")?;

    printer.write_all(format!("{}\n", separator()).as_bytes())?;

    // Bold total
    printer.write_all(b"\x1B\x45\x01")?;
    printer.write_all(total_line("GRAND TOTAL", 1070.00).as_bytes())?;
    printer.write_all(b"\n")?;
    printer.write_all(b"\x1B\x45\x00")?;

    printer.write_all(format!("{}\n", separator()).as_bytes())?;

    printer.write_all(total_line("Paid (Cash)", 1100.00).as_bytes())?;
    printer.write_all(b"\n")?;

    printer.write_all(total_line("Change", 30.00).as_bytes())?;
    printer.write_all(b"\n\n")?;

    // Center thank-you section
    printer.write_all(b"\x1B\x61\x01")?;

    printer.write_all(format!("{}\n", center("Thank you for shopping!")).as_bytes())?;
    printer.write_all(format!("{}\n", center("Returns within 7 days")).as_bytes())?;

    // Feed a few lines
    printer.write_all(b"\n\n\n\n")?;

    // GS V 0 - Full cut (if cutter exists)
    printer.write_all(b"\x1D\x56\x00")?;

    printer.flush()?;

    Ok(())
}