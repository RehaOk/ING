export const getEmployeeListToDisplay = (
  employeeList,
  currentPage,
  itemsPerPage
) => {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return employeeList.slice(start, end);
};
