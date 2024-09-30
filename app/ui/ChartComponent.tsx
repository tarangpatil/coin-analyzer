import React, { useEffect, useRef } from "react";
import { createChart, CandlestickData as ChartData } from "lightweight-charts";
import { CandleData } from "@/app/utils/types"; // Adjust the import based on your structure

interface Props {
  coin: string;
  data: CandleData[];
}

const CandlestickChart: React.FC<Props> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: chartRef.current.clientHeight,
      timeScale: { timeVisible: true, secondsVisible: false },
    });

    chart.timeScale().setVisibleLogicalRange({ from: 0, to: 50 });
    chart.timeScale().scrollToRealTime();

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#4caf50",
      downColor: "#f44336",
      borderUpColor: "#4caf50",
      borderDownColor: "#f44336",
      wickUpColor: "#4caf50",
      wickDownColor: "#f44336",
    });

    // Convert data to the format expected by lightweight-charts
    const chartData: ChartData[] = data.map((item) => ({
      time: new Date(item.x).toUTCString(),
      open: item.o,
      high: item.h,
      low: item.l,
      close: item.c,
    }));

    candlestickSeries.setData(chartData);

    return () => chart.remove();
  }, [data]);

  return (
    <div
      ref={chartRef}
      style={{ position: "relative", width: "100%", height: "400px" }}
    ></div>
  );
};

export default CandlestickChart;
