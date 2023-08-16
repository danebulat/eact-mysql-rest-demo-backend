/* calculate pagination offset */
function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * listPerPage;
}

/* return empty array if no rows retrieved */
function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

/* exports */
export {
  getOffset,
  emptyOrRows,
};

