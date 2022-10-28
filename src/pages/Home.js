import React, { useEffect, useState } from "react";
import TableComp from "../components/TableComp";
import axios from "axios";
import { Typography } from "@mui/material";

const Home = () => {
  const [rows, setRows] = useState([]);

  const getData = () => {
    const data = {
      filter: [
        {
          left: "market_cap_basic",
          operation: "nempty",
        },
        {
          left: "type",
          operation: "in_range",
          right: ["stock", "dr", "fund"],
        },
        {
          left: "subtype",
          operation: "in_range",
          right: [
            "common",
            "foreign-issuer",
            "",
            "etf",
            "etf,odd",
            "etf,otc",
            "etf,cfd",
          ],
        },
        {
          left: "is_primary",
          operation: "equal",
          right: true,
        },
      ],
      options: {
        lang: "th",
      },
      markets: ["thailand"],
      symbols: {
        query: {
          types: [],
        },
        tickers: [],
      },
      columns: [
        "logoid",
        "name",
        "close",
        "change",
        "change_abs",
        "Recommend.All",
        "volume",
        "Value.Traded",
        "market_cap_basic",
        "price_earnings_ttm",
        "earnings_per_share_basic_ttm",
        "number_of_employees",
        "sector",
        "description",
        "type",
        "subtype",
        "update_mode",
        "pricescale",
        "minmov",
        "fractional",
        "minmove2",
        "currency",
        "fundamental_currency_code",
      ],
      sort: {
        sortBy: "market_cap_basic",
        sortOrder: "desc",
      },
      price_conversion: {
        to_symbol: false,
      },
      range: [0, 150],
    };
    axios
      .post("https://scanner.tradingview.com/thailand/scan", data)
      .then((response) => {
        console.log(response.data);

        const list = response.data.data.map(({ d }) => {
          return {
            stock_name: d[0],
            symbol: d[1],
            price: d[2],
            changed_percentage: d[3],
            changed: d[4],
            techical_point: d[5],
            volume: d[6],
            trading_volume: d[7],
            market_cap: d[8],
            pe: d[9],
            eps12: d[10],
            employee: d[11],
            sector: d[12],
            stock_fullname: d[13],
          };
        });

        console.log({ list });

        setRows(list);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const headCells = [
    {
      id: "stock",
      numeric: false,
      disablePadding: false,
      label: "Stock",
    },
    {
      id: "price",
      numeric: true,
      disablePadding: false,
      label: "ราคา",
    },
    {
      id: "changedPercentage",
      numeric: true,
      disablePadding: false,
      label: "% เปลี่ยนแปลง",
    },
    {
      id: "change",
      numeric: true,
      disablePadding: false,
      label: "เปลี่ยนแปลง",
    },
    // {
    //   id: "technicalPoint",
    //   numeric: true,
    //   disablePadding: false,
    //   label: "คะแนนทางเทคนิค",
    // },
    {
      id: "volume",
      numeric: true,
      disablePadding: false,
      label: "ปริมาณ",
    },
    {
      id: "tradingVolume",
      numeric: true,
      disablePadding: false,
      label: "ปริมาณการซื้อขาย",
    },
    {
      id: "pe",
      numeric: true,
      disablePadding: false,
      label: "อัตราส่วนราคาต่่อกำไร",
    },
    {
      id: "eps",
      numeric: true,
      disablePadding: false,
      label: "กำไรต่อหุ้น 12 เดือนล่าสุด",
    },
    {
      id: "sector",
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
