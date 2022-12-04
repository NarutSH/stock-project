import * as React from "react";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import InfiniteScroll from "react-infinite-scroll-component";

import { visuallyHidden } from "@mui/utils";
import { Avatar, InputAdornment, Stack, TextField } from "@mui/material";
import { nFormatter } from "../utils/function";
import { useState, useEffect } from "react";

const TableComp = ({ headCells, rows }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("price");
  const [selected, setSelected] = useState([]);
  const [dense] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limitItems = 30;

  useEffect(() => {
    function descendingComparator(a, b, orderBy) {
      console.log({ a, b, orderBy });

      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    }

    function getComparator(order, orderBy) {
      return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const resRows = rows.filter((row) => {
      return (
        row?.stocksymbols?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        row?.stockname?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    });

    const resRowSort = stableSort(resRows, getComparator(order, orderBy));

    setItems(resRowSort.slice(0, limitItems));
  }, [rows, searchTerm, order, orderBy]);

  const fetchMoreData = () => {
    if (items.length >= rows.length) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      const restItems = rows.slice(0, items.length + limitItems);

      setItems(restItems);
    }, 500);
  };

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;

    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{
                minWidth: "100px",

                fontSize: "1rem",
                border: "1px solid rgb(240,242,247)",
              }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}

                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <Box sx={{ width: "100%" }}>
      <Box my={1}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          onChange={(ev) => setSearchTerm(ev.target.value)}
          value={searchTerm}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer sx={{ maxHeight: "80vh", overflowY: "hidden" }}>
          <Table
            stickyHeader
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <InfiniteScroll
              dataLength={items.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              height={"80vh"}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>No more</b>
                </p>
              }
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />

              <TableBody>
                {items.map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <Box display="flex" alignItems="center" p={1}>
                          <Avatar src={row.stocklogourl} alt={row.stockname} />
                          <Stack ml={2}>
                            <Typography variant="body1">
                              {row.stocksymbols}
                            </Typography>
                            <Typography
                              variant="caption"
                              className="limit-line-1"
                              sx={{ width: "200px" }}
                            >
                              {row.stockname}
                            </Typography>
                          </Stack>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {+row.stockprice}{" "}
                        <Typography variant="caption" color="gray">
                          THB
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: row.stockchgpercent < 0 ? "red" : "green",
                        }}
                      >
                        {row.stockchgpercent}%
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: row.stockchg < 0 ? "red" : "green",
                        }}
                      >
                        {row.stockchg}{" "}
                        <Typography variant="caption" color="gray">
                          THB
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {nFormatter(row.stockvol)}
                      </TableCell>
                      <TableCell align="right">
                        {nFormatter(row.stockvolprice)}{" "}
                        <Typography variant="caption" color="gray">
                          THB
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{row.stockpe ?? "-"}</TableCell>
                      <TableCell align="right">
                        {row.stockeps}{" "}
                        <Typography variant="caption" color="gray">
                          THB
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{row?.freefloat}%</TableCell>
                      <TableCell align="right">{row?.yield / 100}%</TableCell>
                      <TableCell align="center">
                        {row?.ath ? (
                          <Typography color="green">Yes</Typography>
                        ) : (
                          <Typography color="red">No</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {row?.growth ? (
                          <Typography color="green">Yes</Typography>
                        ) : (
                          <Typography color="red">No</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {row?.turnAround ? (
                          <Typography color="green">Yes</Typography>
                        ) : (
                          <Typography color="red">No</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">{row.stocksector}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </InfiniteScroll>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TableComp;
