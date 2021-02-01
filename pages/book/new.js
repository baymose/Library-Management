import React from "react";
import { useRouter } from "next/router";
import BookForm from "../../components/BookForm";
import styled from "styled-components";

const BookPage = () => {
  const router = useRouter();
  return (
    <Style>
      <div className="container">
        <a href="/">&#8249; All Books</a>
        <h1>Add a new book</h1>
        <BookForm action="new" />
      </div>
    </Style>
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
