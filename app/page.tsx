"use client";
import { useEffect, useState } from "react";
import ChartComponent from "./ui/ChartComponent";
import { coinOptions, intervalOptions, startSocket } from "./utils/data";
import { CandleData } from "./utils/types";

export default function Home() {
  const [coin, setCoin] = useState<string | null>("btcusdt");
  const [data, setData] = useState<CandleData[]>([]);
  const [candleInterval, setCandleInterval] = useState<number>(
    intervalOptions[0]
  );
  // console.log("DATTA", data);

  useEffect(() => {
    startSocket();
  });

  useEffect(() => {
    if (coin) {
      const intervalId = setInterval(() => {
        console.log(localStorage.getItem(`${coin}${candleInterval}`));
        setData(
          JSON.parse(localStorage.getItem(`${coin}${candleInterval}`) || "[]")
        );
      }, 2000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [coin, candleInterval]);
  return (
    <main className="flex h-[80vh]">
      <section className="h-full w-1/5 flex-col flex items-center py-20">
        <label htmlFor="coin" className="w-1/2">
          Select a coin:
        </label>
        <select
          name="coin"
          id="coin"
          value={coin || ""}
          onChange={(e) => setCoin(e.target.value)}
          className="px-4 py-2 rounded"
        >
          <option value="" disabled>
            --SELECT--
          </option>
          {coinOptions.map((icoin, idx) => (
            <option value={icoin} key={idx}>
              {icoin.toUpperCase().replace("USDT", "")}
            </option>
          ))}
        </select>
        <p className="block mt-20 w-1/2">Select interval:</p>
        <div className="flex flex-col items-start justify-start w-1/2">
          {intervalOptions.map((int) => (
            <label key={int}>
              <input
                type="radio"
                value={int}
                name="interval"
                defaultChecked={candleInterval === int}
                onChange={() => setCandleInterval(int)}
              />{" "}
              {int} minute
            </label>
          ))}
        </div>
      </section>
      <section className="h-full w-4/5 flex items-start py-20">
        {coin ? (
          <ChartComponent coin={coin} data={data} />
        ) : (
          "Select a coin to see chart"
        )}
      </section>
    </main>
  );
}
