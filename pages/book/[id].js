import React from "react";
import { useRouter } from "next/router";
import BookForm from "../../components/BookForm";
import styled from "styled-components";
import { ReactQueryDevtools } from "react-query/devtools";
import { useQuery } from "react-query";
import App from "../../components/App";
import { Timeline } from "antd";
import { Button } from "antd";

const BookPage = () => {
  const router = useRouter();
  if (!router.query.id) return "Loading...";
  const { isLoading, error, data, isFetching } = useQuery("bookData", () =>
    fetch(`/api/books/${router.query.id}`).then((res) => res.json())
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  if (!data.title)
    return (
      <App>
        <h1>
          This Book Does Not Exist. <a href="/">Go Back</a>
        </h1>
      </App>
    );
  console.log(data);
  return (
    <App>
      <Style>
        <div className="container">
          <a href="/">&#8249; All Books</a>
          <h1>Edit {data.title}</h1>
          <BookForm action="update" initialValues={data} />
          <h3 style={{ marginBottom: "15px" }}>Updates: </h3>
          <Timeline>
            {data.versions &&
              data.versions.map((version) => {
                return <Timeline.Item>{version.summary}</Timeline.Item>;
              })}
          </Timeline>
        </div>
      </Style>
    </App>
  );
};

export default BookPage;

const Style = styled.div`
  padding: 50px 5%;
  display: flex;
  justify-content: center;
  .container {
    max-width: 900px;
    min-width: 50%;
  }
`;
