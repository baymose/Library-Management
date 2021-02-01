import { db } from "../../../../lib/firebase";
const books = {
  get: async (req, res) => {
    try {
      if (req.query.id) {
        const slug = req.query.id[0];
        const data = await db
          .collection("books")
          .where("slug", "==", slug)
          .get();
        res.status(200).json(data.docs.map((doc) => doc.data())[0]);
      } else {
        const data = await db.collection("books").get();
        res.status(200).json(data.docs.map((doc) => doc.data()));
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  post: async (req, res) => {
    const { title, isbn, description, author, available } = req.body;
    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    try {
      const alreadyExists = await db
        .collection("books")
        .where("slug", "==", slug)
        .get()
        .then(({ size }) => size);
      if (alreadyExists) {
        res.status(500).json({
          status: "error",
          message: `Book already Exists`,
        });
      }
      await db
        .collection("books")
        .doc(slug)
        .set({ slug, title, isbn, description, author, available: true });

      res.status(200).json({
        status: "success",
        url: `/book/${slug}`,
      });
    } catch (e) {
      res.status(500).json({
        status: "error",
        message: e.message,
      });
    }
  },

  delete: async (req, res) => {
    const id = req.query.id[0];
    const book = await (
      await db.collection("books").where("slug", "==", id).get()
    ).docs.map((doc) => doc.data())[0];
    try {
      db.collection("deletedBooks").add(book);
      try {
        db.collection("books").doc(id).delete();
        res.status(200).json({ status: "success", message: "Book Deleted" });
        return;
      } catch (e) {
        res.status(500).json({ status: "error", message: e.message });
        return;
      }
    } catch (e) {
      res.status(500).json({ status: "error", message: e.message });
      return;
    }

    res.status(200).json({ status: "success", message: "Book Deleted" });
    return;
  },
  patch: async (req, res) => {
    try {
      const date = new Date();
      const id = req.query.id[0];
      const book = await (await db.collection("books").doc(id).get()).data();
      const validKeys = ["title", "description", "isbn", "author", "available"];

      let updates = req.body;
      delete updates.slug;

      const updatedKeys = Object.keys(req.body).filter((key) => {
        if (validKeys.includes(key) && book[key] !== req.body[key]) {
          return true;
        }
      });
      const summary =
        updatedKeys
          .map((key, i) => {
            if (i + 1 == updatedKeys.length && updatedKeys.length > 1) {
              return `${updatedKeys.length > 1 && ` and`} ${key}`;
            }
            if (updatedKeys.length > 2) {
              return `${key}, `;
            }
            return `${key}`;
          })
          .join("") + ` updated.`.replace("available", "availability");

      let versions = [
        {
          summary,
          updated: date.toISOString(),
          data: {
            title: book.title,
            description: book.description,
            isbn: book.isbn,
            author: book.author,
          },
        },
      ];

      if (book.versions) {
        versions = [...versions, ...book.versions];
      }

      try {
        const newData = {
          ...updates,
          versions,
        };
        await db.collection("books").doc(id).update(newData);
        res.status(200).json({
          status: "success",
          data: newData,
          summary,
        });
        return;
      } catch (e) {
        res.status(500).json({ error: e.message });
        return;
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
      return;
    }
  },
};

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      books.get(req, res);
      return;
    case "PATCH":
      books.patch(req, res);
      return;
    case "DELETE":
      books.delete(req, res);
      return;
    case "POST":
      books.post(req, res);
      return;
  }
};
