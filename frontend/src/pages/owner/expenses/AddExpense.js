import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { EXPENSE_CATEGORIES } from "../../../constants/expenseCategories";
import { useTranslation } from "react-i18next";

export default function AddExpense() {
  const { t: translate } = useTranslation();

  const [trucks, setTrucks] = useState([]);
  const [trips, setTrips] = useState([]);

  const [form, setForm] = useState({
    amount: "",
    category: "MISC",
    description: "",
    truck: "",
    trip: "",
  });

  useEffect(() => {
    api.get("trucks/").then((r) => setTrucks(r.data));
    api.get("trips/").then((r) => setTrips(r.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addExpense = async () => {
    if (!form.amount || !form.description) {
      toast.error(translate("amount_description_required"));
      return;
    }

    try {
      await api.post("expenses/", {
        amount: Number(form.amount),
        category: form.category,
        description: form.description,
        truck: form.truck || null,
        trip: form.trip || null,
      });

      toast.success(translate("expense_added"));
      setForm({
        amount: "",
        category: "MISC",
        description: "",
        truck: "",
        trip: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.detail || translate("failed_add_expense")
      );
    }
  };

  return (
    <Card body className="mt-4">
      <h5>{translate("add_expense_owner")}</h5>

      <Form className="d-flex flex-column gap-2">
        <Form.Control
          type="number"
          placeholder={translate("amount")}
          name="amount"
          value={form.amount}
          onChange={handleChange}
        />

        <Form.Select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          {EXPENSE_CATEGORIES.map((c) => (
  <option key={c.value} value={c.value}>
    {translate(c.label)}
  </option>
))}
        </Form.Select>

        <Form.Control
          placeholder={translate("description")}
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <Form.Select
          name="truck"
          value={form.truck}
          onChange={handleChange}
        >
          <option value="">
            {translate("optional_select_truck")}
          </option>
          {trucks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.truck_number}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          name="trip"
          value={form.trip}
          onChange={handleChange}
        >
          <option value="">
            {translate("optional_select_trip")}
          </option>
          {trips.map((t) => (
            <option key={t.id} value={t.id}>
              {t.start_location} → {t.destination}
            </option>
          ))}
        </Form.Select>

        <Button onClick={addExpense}>
          {translate("add_expense")}
        </Button>
      </Form>
    </Card>
  );
}