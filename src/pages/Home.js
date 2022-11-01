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
      label: "อัตราส่วนราคาต่อกำไร",
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
