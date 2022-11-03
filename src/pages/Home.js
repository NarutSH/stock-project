import React, { useEffect, useState } from "react";
import TableComp from "../components/TableComp";
import { Typography } from "@mui/material";
import { getScanStock } from "../api/stockApi";

const Home = () => {
  const [rows, setRows] = useState([]);

  const getData = () => {
    getScanStock()
      .then((res) => {
        setRows(res);
      })
      .catch((err) => {
        console.log(err);
      });
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
