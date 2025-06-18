import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { SortIcon, SortUpIcon, SortDownIcon } from "./Icons"; // Pastikan ikon tersedia
import { Button, PageButton } from "./Button"; // Pastikan Button dan PageButton tersedia
import { useMemo, useState, useEffect } from "react";
import GlobalFilter from "./GlobalFilter"; // Pastikan GlobalFilter tersedia
import exportTemplate from "../../../pages/Posyandu/ExportTemplate"; // Pastikan ini ada
import { Col } from "antd";
import FormInputDataExcel from "../../form/FormInputDataExcel"; // Pastikan ini ada
import FormInputDataAnak from "../../form/FormInputDataAnak"; // Pastikan ini ada
import ReactSelect from "react-select";

// Komponen SelectColumnFilter
export function SelectColumnFilter({ column }) {
  const { filterOpt, filterValue, setFilter, preFilteredRows, id, render } =
    column;

  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  const opt =
    filterOpt ||
    options.map((option) => ({
      value: option,
      label: option,
    }));

  return (
    <label className="grid grid-cols-12 gap-x-2 items-center mt-4">
      <span className="text-gray-700 text-sm col-span-4">
        {render("Header")}:
      </span>
      <ReactSelect
        className="w-full h-full col-span-10 rounded-md text-sm border-gray-600 shadow focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-70"
        name={id}
        id={id}
        onChange={(e) => {
          setFilter(e.value || undefined);
        }}
        placeholder="All"
        defaultValue={{
          value: filterValue ? filterValue : "",
          label: filterValue ? filterValue : "All",
        }}
        options={[{ value: "", label: "All" }, ...opt]}
      />
    </label>
  );
}

// Komponen Table
function Table({
  columns,
  data,
  initialState = { pageIndex: 0, pageSize: 5 }, // Default pageSize kecil untuk memastikan pagination
  TableHooks = false,
  noSearch = false,
  ButtonCus = false,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    TableHooks
  );

  const { globalFilter, pageIndex, pageSize } = state;
  const { handleExport } = exportTemplate();
  const [isOpenModalInputExcel, setIsOpenModalInputExcel] = useState(false);
  const [isOpenModalInputDataAnak, setIsOpenModalInputDataAnak] =
    useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const dataTemplate = [
    {
      nama: "asdafa",
      panggilan: "sfa",
      tglLahir: "2001-11-31",
      alamat: "Lengkong",
      jk: "L",
      nama_ortu: "andi",
      tgl_ukur: "2022-2-29",
      berat: 12,
      tinggi: 91,
      lila: 25,
    },
    // Tambahkan data dummy untuk memastikan pagination
    ...Array.from({ length: 10 }, (_, i) => ({
      nama: `Nama ${i + 2}`,
      panggilan: `Panggilan ${i + 2}`,
      tglLahir: `2001-11-${i + 1}`,
      alamat: `Alamat ${i + 2}`,
      jk: i % 2 === 0 ? "L" : "P",
      nama_ortu: `Ortu ${i + 2}`,
      tgl_ukur: `2022-2-${i + 1}`,
      berat: 10 + i,
      tinggi: 90 + i,
      lila: 20 + i,
    })),
  ];

  // Debug log untuk memantau status pagination
  useEffect(() => {
    console.log("Table Debug:", {
      dataLength: data.length,
      pageSize,
      pageCount,
      pageIndex,
      pageOptions,
      canPreviousPage,
      canNextPage,
    });
  }, [
    data.length,
    pageSize,
    pageCount,
    pageIndex,
    pageOptions,
    canPreviousPage,
    canNextPage,
  ]);

  return (
    <>
      <div className="sm:flex flex-col sm:gap-x-10">
        {!noSearch && (
          <div className="flex items-center justify-between max-w-full">
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 justify-between">
          {headerGroups.map((headerGroup) =>
            headerGroup.headers.map((column) =>
              column.Filter ? (
                <div className="mt-2 sm:mt-0" key={column.id}>
                  {column.render("Filter")}
                </div>
              ) : null
            )
          )}
        </div>
      </div>
      {ButtonCus && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-4">
          <button
            className="button2"
            onClick={() => setIsOpenModalInputDataAnak(true)}
          >
            Tambah Anak
          </button>
          <button
            className="button2"
            onClick={() => handleExport(dataTemplate)}
          >
            Unduh Template Excel
          </button>
          <button
            className="button2"
            onClick={() => setIsOpenModalInputExcel(true)}
          >
            Masukkan Data Excel
          </button>
        </div>
      )}
      <div className="mt-4 flex flex-col">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 sm:rounded-full">
              <table
                {...getTableProps()}
                className="w-full divide-y divide-gray-200 border"
              >
                <thead style={{ background: "#ffb4b4", color: "white" }}>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers
                        .filter((col) => col.show !== false)
                        .map((column) => (
                          <th
                            scope="col"
                            className="group px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                          >
                            <div className="flex items-center justify-between">
                              {column.render("Header")}
                              <span>
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <SortDownIcon className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <SortUpIcon className="w-4 h-4 text-gray-400" />
                                  )
                                ) : (
                                  <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                                )}
                              </span>
                            </div>
                          </th>
                        ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-gray-200"
                >
                  {data?.length === 0 && (
                    <tr>
                      <td className="text-center py-4" colSpan={columns.length}>
                        Tidak ada data
                      </td>
                    </tr>
                  )}
                  {page.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        className={i % 2 === 0 ? "bg-gray-100" : ""}
                      >
                        {row.cells.map((cell) => {
                          if (cell.column.show === false) {
                            return null;
                          }
                          if (cell.column.id === "no") {
                            return (
                              <td
                                className="px-6 py-4 whitespace-nowrap"
                                key={i}
                              >
                                <div className="text-sm text-gray-900">
                                  {state.pageIndex * state.pageSize + i + 1}
                                </div>
                              </td>
                            );
                          }
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="px-4 py-2 whitespace-nowrap"
                              role="cell"
                            >
                              {cell.column.Cell?.name === "defaultRenderer" ? (
                                <div className="text-sm text-gray-700">
                                  {cell.render("Cell")} {cell.column?.postFix}
                                </div>
                              ) : (
                                cell.render("Cell")
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="py-3 flex items-center justify-end">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            icon={false}
          >
            Previous
          </Button>
          <Button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            icon={false}
          >
            Next
          </Button>
        </div>
        <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-x-2 items-baseline">
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{pageIndex + 1}</span> of{" "}
              <span className="font-medium">{pageOptions.length}</span>
            </span>
            <label>
              <span className="sr-only">Items Per Page</span>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <PageButton
              className="rounded-l-md"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">First</span>
              {/* Ganti dengan ikon ChevronDoubleLeftIcon jika tersedia */}
              <span>«</span>
            </PageButton>
            <PageButton
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Previous</span>
              {/* Ganti dengan ChevronLeftIcon jika tersedia */}
              <span>‹</span>
            </PageButton>
            {Array.from({ length: pageCount }, (_, index) => (
              <PageButton
                key={index}
                onClick={() => gotoPage(index)}
                className={`${
                  pageIndex === index
                    ? "bg-indigo-600 text-black"
                    : "bg-white text-gray-300"
                }`}
              >
                {index + 1}
              </PageButton>
            ))}
            <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
              <span className="sr-only">Next</span>
              {/* Ganti dengan ChevronRightIcon jika tersedia */}
              <span>›</span>
            </PageButton>
            <PageButton
              className="rounded-r-md"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              <span className="sr-only">Last</span>
              {/* Ganti dengan ChevronDoubleRightIcon jika tersedia */}
              <span>»</span>
            </PageButton>
          </nav>
        </div>
      </div>
      <Col sm="12" className="d-flex">
        <FormInputDataExcel
          isOpen={isOpenModalInputExcel}
          onCancel={() => setIsOpenModalInputExcel(false)}
          fetch={() => setRefreshKey((oldKey) => oldKey + 1)}
        />
      </Col>
      <Col sm="12" className="d-flex">
        <FormInputDataAnak
          isOpen={isOpenModalInputDataAnak}
          onCancel={() => setIsOpenModalInputDataAnak(false)}
          fetch={() => setRefreshKey((oldKey) => oldKey + 1)}
        />
      </Col>
    </>
  );
}

export default Table;
