import * as React from "react";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import { visuallyHidden } from "@mui/utils";
import { Avatar, InputAdornment, Stack, TextField } from "@mui/material";
import { nFormatter } from "../utils/function";
import { useState } from "react";

const TableComp = ({ headCells, rows }) => {
  const [searchTerm, setSearchTerm] = useState("");
  // const [resRows, setResRows] = useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("price");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const resRows = rows.filter((row) => {
    return (
      row.stocksymbols.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.stockname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  function descendingComparator(a, b, orderBy) {
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
      console.log({ event, property });
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
                minWidth: "150px",
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
              {/* {headCell.id === "stocksymbols" && (
                <TextField
                  label="Stock"
                  variant="outlined"
                  size="small"
                  onChange={(ev) => setSearchTerm(ev.target.value)}
                  value={searchTerm}
                />
              )} */}
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleChangeDense = (event) => {
  //   setDense(event.target.checked);
  // };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Box my={2}>
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
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={resRows.length}
            />
            <TableBody>
              {stableSort(resRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.symbol}
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
                              sx={{ whiteSpace: "nowrap" }}
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
                        {(row.stockchgpercent * 100).toFixed(2)}%
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
                      <TableCell align="right">{row.stocksector}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={resRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </Box>
  );
};

export default TableComp;
