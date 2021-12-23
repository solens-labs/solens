import React, { useEffect, useState } from "react";
import "./style.css";
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
import { Line } from "react-chartjs-2";
import { lineColors } from "../../constants/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart(props) {
  const { chartTitle, dates, legend, dataset, color } = props;

  const options = {
    // responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "white",
          font: {
            size: 15,
            family: "main",
          },
        },
      },
      title: {
        display: true,
        color: "white",
        text: `${chartTitle}`,
        font: {
          size: 30,
          family: "main",
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: "white",
          font: {
            size: 15,
            family: "main",
          },
        },
        grid: {
          color: "rgb(53, 43, 87)",
          // borderColor: "rgb(53, 43, 87)",
        },
      },
      x: {
        ticks: {
          color: "white",
          font: {
            size: 15,
            family: "main",
          },
        },
        grid: {
          display: false,
          color: "rgb(53, 43, 87)",
        },
      },
    },
    tooltips: {
      callbacks: {
        label: (item) => `${item.yLabel} GB`,
      },
    },
  };

  const data = {
    labels: dates,
    datasets: dataset.map((set, i) => {
      const styledSet = {
        label: legend[i],
        data: set,
        fill: true,
        borderCapStyle: "round",
        borderJoinStyle: "mitter",
        borderColor: color || lineColors[i],
        backgroundColor: color || lineColors[i],
        pointBackgroundColor: color || lineColors[i],
        pointBorderColor: "#fff",
        pointRadius: 5,
        pointHitRadius: 30,
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        tension: 0.15,
      };

      return styledSet;
    }),
  };

  return (
    <article className="canvas_container">
      <Line options={options} data={data} />
    </article>
  );
}
