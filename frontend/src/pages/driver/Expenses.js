import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Card, Form, Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { EXPENSE_CATEGORIES } from "../../constants/expenseCategories";
import { useTranslation } from "react-i18next";

export default function Expenses() {
  const { t: translate } = useTranslation();

  const [expenses, setExpenses] = useState([]);
  const [tripId, setTripId] = useState(null);

  const [form, setForm] = useState({
    amount: "",
    category: "FUEL",
    description: "",
  });

  const fetchExpenses = async () => {
    try {
      const res = await api.get("expenses/");
      setExpenses(res.data);
    } catch {
      toast.error(translate("failed_load_expenses"));
    }
  };

  const fetchRunningTrip = async () => {
    const res = await api.get("trips/");
    const running = res.data.find((t) => t.status === "RUNNING");
    setTripId(running?.id || null);
  };

  useEffect(() => {
    fetchRunningTrip();
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addExpense = async () => {
    if (!tripId) {
      toast.error(translate("no_running_trip"));
      return;
    }

    if (!form.amount || !form.description) {
      toast.error(translate("all_fields_required"));
      return;
    }

    try {
      await api.post("expenses/", {
        trip: tripId,
        amount: Number(form.amount),
        category: form.category,
        description: form.description,
      });

      toast.success(translate("expense_added"));
      setForm({ amount: "", category: "FUEL", description: "" });
      fetchExpenses();
    } catch (err) {
      toast.error(
        err.response?.data?.detail || translate("cannot_add_expense")
      );
    }
  };

  return (
    <Card body>
      <h5>{translate("add_trip_expense")}</h5>

      <Form className="d-flex gap-2 mb-3">
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
              {c.label}
            </option>
          ))}
        </Form.Select>

        <Form.Control
          placeholder={translate("description")}
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <Button onClick={addExpense} style={{ backgroundColor: "#33c0b2" }}>
          {translate("add")}
        </Button>
      </Form>

      <Table bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>{translate("category")}</th>
            <th>{translate("description")}</th>
            <th>{translate("amount")}</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e, i) => (
            <tr key={e.id}>
              <td>{i + 1}</td>
              <td>{e.category}</td>
              <td>{e.description}</td>
              <td>₹{e.amount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}