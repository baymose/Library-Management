import React, { useState } from "react";
import { Switch, Form, Input, Button, Checkbox } from "antd";
const { TextArea } = Input;
import { useRouter } from "next/router";

const postData = async (action = "new", data = {}, slug = "") => {
  console.log("Posting Data");
  const methods = {
    new: "POST",
    update: "PATCH",
  };
  let url = "";
  let method = "";
  if (action == "new") {
    url = "/api/books";
    method = "POST";
  } else {
    url = `/api/books/${slug}`;
    method = "PATCH";
  }
  const response = await fetch(url, {
    method, // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  return response.json(); // parses JSON response into native JavaScript objects
};
const fields = [
  {
    label: "Title",
    name: "title",
    type: "text",
    rules: [{ required: true, message: "Title is required" }],
  },
  {
    label: "Author",
    name: "author",
    type: "text",
    rules: [{ required: true, message: "Author is required" }],
  },
  {
    label: "Description",
    name: "description",
    type: "textArea",
  },
  {
    label: "ISBN",
    name: "isbn",
    type: "number",
    rules: [{ required: true, message: "ISBN is required" }],
  },
  {
    label: "Available",
    name: "available",
    type: "switch",
  },
];

export default ({ initialValues = {}, action }) => {
  const router = useRouter();
  const deleteBook = async () => {
    window.confirm("Delete Book");
    const response = await fetch(`/api/books/${router.query.id}`, {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });

    router.push("/");
    return response.json();
  };
  const onFinish = async (values) => {
    console.log(values);
    const res = await postData(action, values, initialValues.slug);
    router.push(`${res.url}`);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    return;
  };
  const onSubmit = () => {
    router.reload();
    console.log(values);
    return;
  };

  return (
    <Form
      name="basic"
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout={"vertical"}
    >
      {fields.map((field) => {
        switch (field.type) {
          case "text":
            return (
              <Form.Item
                rules={field.rules || []}
                name={field.name}
                label={field.label}
              >
                <Input />
              </Form.Item>
            );
          case "textArea":
            return (
              <Form.Item
                rules={field.rules || []}
                name={field.name}
                label={field.label}
              >
                <TextArea rows={3} />
              </Form.Item>
            );
          case "number":
            return (
              <Form.Item
                rules={field.rules || []}
                name={field.name}
                label={field.label}
              >
                <Input />
              </Form.Item>
            );
          case "switch":
            return (
              <Form.Item name={field.name} label={field.label}>
                <Switch
                  defaultChecked={initialValues[field.name] ? true : false}
                />
              </Form.Item>
            );
        }
      })}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button danger style={{ marginLeft: "10px" }} onClick={deleteBook}>
          Delete Book
        </Button>
      </Form.Item>
    </Form>
  );
};
