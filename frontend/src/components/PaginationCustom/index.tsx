import { useEffect, useState } from "react";
import { Pagination } from "antd";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "../../utilities/constant";
const PaginationCustom = (props: any) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>();
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    setTotalPage(props.total);
    setCurrentPage(props.current);
    setPageSize(props.size);
  }, [props.current, props.total, props.size]);

  const handleTableChange = (page: number, size: number) => {
    props.handleTableChange(page, size);
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
    handleTableChange(current, size);
  };

  return (
    <div
      style={{
        alignItems: "end",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
      }}
    >
      <Pagination
        size="small"
        style={{ marginTop: "16px" }}
        total={totalPage}
        showTotal={(total) => `Total ${total} items`}
        showSizeChanger
        showQuickJumper
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onChange={(page, size) => {
          handleTableChange(page, size);
        }}
        onShowSizeChange={(current, size) => {
          handlePageSizeChange(current, size);
        }}
        current={currentPage}
      />
    </div>
  );
};

export default PaginationCustom;
