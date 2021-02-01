import Head from "next/head";
import App from "../components/App";
import BooksTable from "../components/BooksTable";
import styled from "styled-components";
import { Button } from "antd";

export default function Home() {
  return (
    <App>
      <Style>
        <Head>
          <title>Library Management System</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div class="table-container">
          <h1>All Books</h1>
          <a href="/book/new">
            <Button style={{ marginBottom: "15px" }}>New Book</Button>
          </a>
          <BooksTable />
        </div>
      </Style>
    </App>
  );
}

const Style = styled.div`
  padding-top: 40px;
  .table-container {
    max-width: 800px;
    margin: 0 auto;
  }
`;
