import React from "react";
import { useQuery } from "react-query";
import { Table } from "antd";
import { ReactQueryDevtools } from "react-query/devtools";

export default ({ children }) => {
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "available",
    },
    {
      title: "Edit",
      dataIndex: "edit",
      key: "edit",
    },
  ];
  const { isLoading, error, data, isFetching } = useQuery("booksData", () =>
    fetch("/api/books").then((res) => res.json())
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  const createReport = () => {
    const dataString =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(data));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataString);
    dlAnchor.setAttribute("download", "report" + ".json");
    document.body.appendChild(dlAnchor); // required for firefox
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div>
      <Table
        dataSource={data.map((book) => {
          return {
            ...book,
            available: book.available ? "True" : "False",
            edit: <a href={`/book/${book.slug}`}>Edit</a>,
          };
        })}
        columns={columns}
      ></Table>
      <button onClick={createReport}>Download Report</button>
      <ReactQueryDevtools initialIsOpen />
    </div>
  );
};
