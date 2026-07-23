use diesel::{backend::Backend, deserialize::{FromSql, FromSqlRow}, serialize::ToSql, sql_types::Text, sqlite::Sqlite};

#[derive(FromSqlRow, Debug)]
pub enum PaymentMethod {
    Cash,
    Mpesa,
}

impl ToSql<Text, diesel::sqlite::Sqlite> for PaymentMethod {
    fn to_sql<'b>(
        &'b self,
        out: &mut diesel::serialize::Output<'b, '_, diesel::sqlite::Sqlite>,
    ) -> diesel::serialize::Result {
        let s = match self {
            Self::Cash => "CASH",
            Self::Mpesa => "MPESA",
        };

        out.set_value(s.as_bytes());
        Ok(diesel::serialize::IsNull::No)
    }
}

impl FromSql<Text, diesel::sqlite::Sqlite> for PaymentMethod {
    fn from_sql(
        bytes: <diesel::sqlite::Sqlite as Backend>::RawValue<'_>,
    ) -> diesel::deserialize::Result<Self> {
        let s = <String as FromSql<Text, Sqlite>>::from_sql(bytes)?;
        match s.as_str() {
            "CASH" => Ok(Self::Cash),
            "MPESA" => Ok(Self::Mpesa),
            other => Err(format!("Unrecognized payment method: {}", other).into()),
        }
    }
}
