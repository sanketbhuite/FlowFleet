import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Table, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function ExpenseList() {
  const { t: translate } = useTranslation();

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    api.get("expenses/").then((res) => setExpenses(res.data));
  }, []);

  return (
    <Card>
      <Card.Body>
        <h5>{translate("expenses")}</h5>

        <Table bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>{translate("trip")}</th>
              <th>{translate("category")}</th>
              <th>{translate("amount")}</th>
              <th>{translate("description")}</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e, i) => (
              <tr key={e.id}>
                <td>{i + 1}</td>
                <td>{e.trip}</td>
                <td>{e.category}</td>
                <td>₹{e.amount}</td>
                <td>{e.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}