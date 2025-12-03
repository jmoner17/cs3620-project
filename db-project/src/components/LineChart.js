"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


// Register the necessary Chart.js components.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart({ labels, datasets, data }) {
  const chartData = {
    labels: labels, // e.g., time labels for hour/day/week
    datasets: datasets ? datasets : [
      {
        label: "Device Events",
        data: data, // arbitrary sample data
        fill: false,
        borderColor: "#0d73ad", //theme
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // allows the canvas to fill its container
    plugins: {
        title: {display: false },
        legend: { display: false},
    },
    scales: {
      y: {
            grid: {
                display: false,
                drawBorder: false,
                borderWidth: 0,
                borderColor: "transparent",
            },
            ticks: {
                display: false
            },
        beginAtZero: true,
      },
      x: {
        grid: {
            display: false
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
