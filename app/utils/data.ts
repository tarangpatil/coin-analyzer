import { CandleData } from "./types";

export const coinOptions = ["btcusdt", "bnbusdt", "dotusdt"];
export const intervalOptions = [1, 3, 5];

export function startSocket() {
  coinOptions.forEach((coin) => {
    intervalOptions.forEach((m) => {
      const socket = new WebSocket(
        `${process.env.SOCKET_HOST}/ws/${coin}@kline_${m}m`
      );
      socket.onerror = (err) => console.log(`${coin}${m}`, err);
      socket.onmessage = ({ data }) => {
        data = JSON.parse(data);
        const prevData = JSON.parse(
          localStorage.getItem(`${coin}${m}`) || "[]"
        );
        if (prevData.length === 0) {
          const newData = [
            {
              x: JSON.parse(data.k.t),
              h: JSON.parse(data.k.h),
              l: JSON.parse(data.k.l),
              o: JSON.parse(data.k.o),
              c: JSON.parse(data.k.c),
            },
          ];
          localStorage.setItem(`${coin}${m}`, JSON.stringify(newData));
        } else {
          if (prevData[prevData.length - 1].x < JSON.parse(data.k.t)) {
            const newData = [
              ...prevData,
              {
                x: JSON.parse(data.k.t),
                h: JSON.parse(data.k.h),
                l: JSON.parse(data.k.l),
                o: JSON.parse(data.k.o),
                c: JSON.parse(data.k.c),
              },
            ];
            localStorage.setItem(`${coin}${m}`, JSON.stringify(newData));
          }
        }
      };
    });
  });
}
