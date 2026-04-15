import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ChartRenderer = ({ type, data }) => {
  if (type === "donut") {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={80}
          >
            {data.map((entry, index) => (
              <Cell key={index} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return null;
};

export default ChartRenderer;