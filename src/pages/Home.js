import React, { useEffect, useState } from "react";
import TableComp from "../components/TableComp";
import { Typography } from "@mui/material";
import { getFreefloat, getScanStock, getStockRevenue } from "../api/stockApi";

const Home = () => {
  const [rows, setRows] = useState([]);

  const getData = async () => {
    try {
      const thisYear = new Date().getFullYear() + 543;

      const scanStock = await getScanStock();
      const freefloat = await getFreefloat();
      const stockRev = await getStockRevenue();

      const newRows = scanStock.map((item) => {
        const mapFreefloat = freefloat.find(
          (el) =>
            el.stocksymbols.toLowerCase() === item.stocksymbols.toLowerCase()
        );

        const mapStockRev = stockRev.find((el) => el.id === item.id);

        if (!mapStockRev) {
          console.log({ item, mapStockRev });
        }

        const asArray = Object.entries(mapStockRev)
          ?.map((item) => {
            return {
              period: item[0],
              rev: item[1],
            };
          })
          ?.filter((el) => el.period.startsWith("q"));

        const revThisYear = asArray.filter(
          (el) => +el.period.slice(-4) === thisYear
        );

        const revThisQ = revThisYear[revThisYear.length - 1];

        const compareRev = asArray
          .slice(0, -1)
          .map((el) => +revThisQ.rev > +el.rev);

        const revPrevYear = asArray
          .filter((el) => +el.period.slice(-4) === thisYear - 1)
          .reduce((a, b) => +a.rev + +b.rev, 0);

        // column 2

        let forecastRev = 0;

        if (revThisYear.length === 1) {
          forecastRev = +revThisYear[0] * 4;
        } else if (revThisYear.length === 2) {
          forecastRev = (+revThisYear[0] + +revThisYear[1]) * 2;
        } else if (revThisYear.length === 3) {
          forecastRev =
            +revThisYear[0] +
            +revThisYear[1] +
            +revThisYear[2] +
            (+revThisYear[0] + +revThisYear[1] + +revThisYear[2] / 3);
        } else {
          forecastRev =
            +revThisYear[0] +
            +revThisYear[1] +
            +revThisYear[2] +
            +revThisYear[3];
        }

        return {
          ...item,
          freefloat: mapFreefloat?.percentfreefloat,
          yield: +mapFreefloat?.stockytdpercentchange * 100,
          rev: mapStockRev,

          ath: compareRev.indexOf(false) === -1 ? true : false,
          growth: forecastRev / revPrevYear - 1 > 0.3 ? true : false,
          turnAround: forecastRev > 0 && revPrevYear < 0 ? true : false,
        };
      });

      setRows(newRows);
    } catch (err) {
      console.log(err);
    }
  };

  const headCells = [
    {
      id: "stocksymbols",
      numeric: false,
      disablePadding: false,
      label: "Stock",
    },
    {
      id: "stockprice",
      numeric: true,
      disablePadding: false,
      label: "ราคา",
    },
    {
      id: "stockchgpercent",
      numeric: true,
      disablePadding: false,
      label: "% เปลี่ยนแปลง",
    },
    {
      id: "stockchg",
      numeric: true,
      disablePadding: false,
      label: "เปลี่ยนแปลง",
    },

    {
      id: "stockvol",
      numeric: true,
      disablePadding: false,
      label: "ปริมาณ",
    },
    {
      id: "stockvolprice",
      numeric: true,
      disablePadding: false,
      label: "ปริมาณการซื้อขาย",
    },
    {
      id: "stockpe",
      numeric: true,
      disablePadding: false,
      label: "อัตราส่วนราคาต่อกำไร",
    },
    {
      id: "stockeps",
      numeric: true,
      disablePadding: false,
      label: "กำไรต่อหุ้น 12 เดือนล่าสุด",
    },
    {
      id: "freefloat",
      numeric: true,
      disablePadding: false,
      label: "Free float",
    },
    {
      id: "yield",
      numeric: true,
      disablePadding: false,
      label: "Yield",
    },
    {
      id: "ath",
      numeric: false,
      disablePadding: false,
      label: "All Time High",
    },
    {
      id: "morethan30",
      numeric: false,
      disablePadding: false,
      label: "รายได้มากกว่า 30%",
    },
    {
      id: "turnaround",
      numeric: false,
      disablePadding: false,
      label: "Turn around",
    },
    {
      id: "stocksector",
      numeric: false,
      disablePadding: false,
      label: "ภาคอุตสาหกรรม",
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Typography variant="h3">Stock Project</Typography>
      <TableComp headCells={headCells} rows={rows} />
    </div>
  );
};

export default Home;
