import { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import api from "../../../api/axios";
import { useTranslation } from "react-i18next";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function Reports() {
    const { t: translate } = useTranslation();
    const [chartData, setChartData] = useState(null);
    const currentYear = new Date().getFullYear();
    const [categoryData, setCategoryData] = useState(null);
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState("ALL");
    
const [insights, setInsights] = useState({
  topCategory: null,
  bestMonth: null,
  worstMonth: null,
});


useEffect(() => {
  const loadReport = async () => {
    const [tripsRes, expensesRes] = await Promise.all([
      api.get("trips/"),
      api.get("expenses/"),
    ]);

    const monthly = {};



// Top Expense Category
let topCategory = null;
let maxExpense = 0;
const categoryTotals = {};
Object.entries(categoryTotals).forEach(([category, amount]) => {
  if (amount > maxExpense) {
    maxExpense = amount;
    topCategory = category;
  }
});

// Best & Worst Month by Profit
let bestMonth = null;
let worstMonth = null;
let bestProfit = -Infinity;
let worstProfit = Infinity;

Object.entries(monthly).forEach(([monthKey, data]) => {
  const profit = data.revenue - data.expenses;

  if (profit > bestProfit) {
    bestProfit = profit;
    bestMonth = monthKey;
  }

  if (profit < worstProfit) {
    worstProfit = profit;
    worstMonth = monthKey;
  }
});

setInsights({
  topCategory,
  bestMonth,
  worstMonth,
});
    // TRIPS → REVENUE
    tripsRes.data.forEach((t) => {
      const date = new Date(t.created_at);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");

      if (y !== year) return;
      if (month !== "ALL" && m !== month) return;

      const key = `${y}-${m}`;

      if (!monthly[key]) {
        monthly[key] = { revenue: 0, expenses: 0 };
      }

      monthly[key].revenue += t.revenue || 0;
    });

    // EXPENSES
    expensesRes.data.forEach((e) => {
      const date = new Date(e.created_at);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");

      if (y !== year) return;
      if (month !== "ALL" && m !== month) return;

      const key = `${y}-${m}`;

      if (!monthly[key]) {
        monthly[key] = { revenue: 0, expenses: 0 };
      }

      monthly[key].expenses += e.amount;
    });

    const labels = Object.keys(monthly).sort();
    // EXPENSE CATEGORY TOTALS


expensesRes.data.forEach((e) => {
  const date = new Date(e.created_at);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");

  if (y !== year) return;
  if (month !== "ALL" && m !== month) return;

  categoryTotals[e.category] =
    (categoryTotals[e.category] || 0) + e.amount;
});

// prepare pie chart data
setCategoryData({
  labels: Object.keys(categoryTotals),
  datasets: [
    {
      data: Object.values(categoryTotals),
      backgroundColor: [
        "#0d6efd",
        "#198754",
        "#ffc107",
        "#dc3545",
        "#6c757d",
        "#0dcaf0",
      ],
    },
  ],
});

    setChartData({
      labels,
      datasets: [
        {
          label: translate("revenue"),
          data: labels.map((k) => monthly[k].revenue),
          backgroundColor: "#0d6efd",
        },
        {
          label: translate("expenses"),
          data: labels.map((k) => monthly[k].expenses),
          backgroundColor: "#dc3545",
        },
        {
          label: translate("profit"),
          data: labels.map(
            (k) => monthly[k].revenue - monthly[k].expenses
          ),
          backgroundColor: "#198754",
        },
      ],
    });
  };

  loadReport();
}, [year, month]);


const exportCSV = () => {
  if (!chartData) return;

  let csv = "Month,Revenue,Expenses,Profit\n";

  chartData.labels.forEach((label, i) => {
    const revenue = chartData.datasets[0].data[i];
    const expenses = chartData.datasets[1].data[i];
    const profit = chartData.datasets[2].data[i];

    csv += `${label},${revenue},${expenses},${profit}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `financial-report-${year}-${month}.csv`;
  link.click();
};

  return (
    <>
      <Row className="mb-3 align-items-center">
  <Col>
    <h3>{translate("financial_reports")}</h3>
  </Col>
  <Col xs="auto">
    <button
      className="btn btn-outline-primary btn-sm"
      onClick={exportCSV}
      disabled={!chartData}
    >
      {translate("export_csv")}
    </button>
  </Col>
</Row>

    <Row className="mb-3">
  <Col xs={6} sm={3}>
    <label className="form-label">{translate("year")}</label>
    <select
      className="form-select"
      value={year}
      onChange={(e) => setYear(Number(e.target.value))}
    >
      {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  </Col>

  <Col xs={6} sm={3}>
    <label className="form-label">{translate("month")}</label>
    <select
      className="form-select"
      value={month}
      onChange={(e) => setMonth(e.target.value)}
    >
      <option value="ALL">{translate("all")}</option>
      {[
        "01","02","03","04","05","06",
        "07","08","09","10","11","12"
      ].map((m) => (
        <option key={m} value={m}>
          {translate(new Date(0, Number(m) - 1).toLocaleString(undefined, { month: "long" }))}
        </option>
      ))}
    </select>
  </Col>
</Row>

<Row className="mb-4">
  <Col xs={12} md={4}>
    <Card body>
      <small className="text-muted">{translate("top_expense_category")}</small>
      <h6>
        {insights.topCategory
          ? insights.topCategory
          : translate("no_data")}
      </h6>
    </Card>
  </Col>

  <Col xs={12} md={4}>
    <Card body>
      <small className="text-muted">{translate("best_month")}</small>
      <h6>
        {insights.bestMonth
          ? insights.bestMonth
          : "–"}
      </h6>
    </Card>
  </Col>

  <Col xs={12} md={4}>
    <Card body>
      <small className="text-muted">{translate("worst_month")}</small>
      <h6
        className={
          insights.worstMonth === insights.bestMonth
            ? ""
            : "text-danger"
        }
      >
        {insights.worstMonth
          ? insights.worstMonth
          : "–"}
      </h6>
    </Card>
  </Col>
</Row>

      <Row className="mb-4">
        <Col xs={12} lg={8}>
          <Card body className="mb-3">
            <h6>{translate("monthly_summary")}</h6>

            {chartData ? (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "bottom" },
                  },
                }}
              />
            ) : (
              <p className="text-muted">{translate("loading_report")}</p>
            )}
          </Card>
        </Col>
      {/* </Row>
      <Row className="mt-4"> */}
  <Col xs={12} lg={4}>
    <Card body className="mb-3">
      <h6>{translate("expense_breakdown")}</h6>

      {categoryData ? (
        <Pie
          data={categoryData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
            },
          }}
        />
      ) : (
        <p className="text-muted">{translate("no_expense_data")}</p>
      )}
    </Card>
  </Col>
</Row>
<Card body className="mt-4">
  <h6>{translate("monthly_breakdown")}</h6>

  <div className="table-responsive">
    <table className="table table-sm">
      <thead>
        <tr>
          <th>{translate("month")}</th>
          <th>{translate("revenue")}</th>
          <th>{translate("expenses")}</th>
          <th>{translate("profit")}</th>
        </tr>
      </thead>
      <tbody>
        {chartData?.labels.map((label, i) => (
          <tr key={label}>
            <td>{label}</td>
            <td>₹{chartData.datasets[0].data[i]}</td>
            <td>₹{chartData.datasets[1].data[i]}</td>
            <td
              className={
                chartData.datasets[2].data[i] >= 0
                  ? "text-success"
                  : "text-danger"
              }
            >
              ₹{chartData.datasets[2].data[i]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</Card>

    </>
  );
}
