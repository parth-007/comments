import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';

import { Comment } from "../Comment/Comment";

import "./index.css";

export const Comments = () => {
  const [comments, setComments] = useState([]);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [editCommentId, setEditCommentId] = useState("");

  useEffect(() => {
    const comments = localStorage.getItem("comments");
    if (comments) {
      const commentsJson = JSON.parse(comments) || [];
      setComments(commentsJson);
    }
  }, []);

  const sortBy = () => {
    if (sortOrder === "ASC") {
      setSortOrder("DESC");
    } else {
      setSortOrder("ASC");
    }
    const comments = localStorage.getItem("comments");
    const commentsJson = JSON.parse(comments) || [];

    // Sorting the comments array based on the timestamp property
    let sortedComments;
    if (sortOrder === "ASC") {
      sortedComments = commentsJson.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else {
      sortedComments = commentsJson.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    setComments(sortedComments);
  };

  const deleteComment = (id) => {
    console.log(19, id);
    const comments = localStorage.getItem("comments");
    if (comments) {
      const commentsJson = JSON.parse(comments);
      const filteredJSON = commentsJson.filter((c) => c.id !== id);
      localStorage.setItem("comments", JSON.stringify(filteredJSON));
      setComments(filteredJSON);
    }
  };

  const editComment = (id, name, comment) => {
    setEditCommentId(id);
    setCommentForm({
      name, comment
    })
  }

  const saveComment = () => {
    if (commentForm.name === "" || commentForm.comment === "") {
      alert("Name and Comment are required");
      return;
    }

    const comments = localStorage.getItem("comments");
    if (!comments) {
      localStorage.setItem("comments", JSON.stringify([]));
    }
    const commentsJson = JSON.parse(comments) || [];
    if (editCommentId) {
      let storedComment = commentsJson.find(c => c.id === editCommentId);
      storedComment.comment = commentForm.comment;
      storedComment.timestamp = new Date();
      setEditCommentId("");
    }
    else {
      commentsJson.push({
        id: Date.now(),
        timestamp: new Date(),
        ...commentForm,
        replies: [],
      });
    }


    setComments(commentsJson);

    localStorage.setItem("comments", JSON.stringify(commentsJson));

    resetCommentForm();
  };

  const resetCommentForm = () => {
    setCommentForm({
      name: "",
      comment: "",
    });
  };

  const [commentForm, setCommentForm] = useState({
    name: "",
    comment: "",
  });
  return (
    <>
      <div className="comment">
        <h5>Comment</h5>
        <input
          className="form-control"
          disabled={editCommentId}
          placeholder="Name"
          value={commentForm.name}
          type="text"
          onChange={(e) =>
            setCommentForm((prevForm) => {
              const updatedForm = { ...prevForm };
              updatedForm.name = e.target.value;
              return updatedForm;
            })
          }
        ></input>
        <textarea
        className="form-control"
          rows="4"
          placeholder="Comment"
          value={commentForm.comment}
          style={{ marginTop: "12px" }}
          onChange={(e) => {
            setCommentForm((prevForm) => {
              const updatedForm = { ...prevForm };
              updatedForm.comment = e.target.value;
              return updatedForm;
            });
          }}
        ></textarea>
        <Button type="submit" className="post-btn" onClick={() => saveComment()}>
          {editCommentId ? 'Update' : 'Post'}
        </Button>
      </div>

      {comments && comments.length > 0 && (
        <div>
          {
            !editCommentId && (
              <div className="d-flex jcsb w-70 ml-24 aic">
                <span>
                  Comments
                </span>
                <div className="d-flex aic fs-14">
                  <span>Sort By:</span>{" "}
                  <Button variant="secondary" className="d-flex ml-8 aic fs-14" onClick={() => sortBy()}>
                    {" "}
                    <span>Date and Time {sortOrder}</span>
                    <svg
                      className={`sort-btn ${sortOrder === "DESC" ? "rotate-180" : ""}`}
                      fill="#FFFFFF"
                      height="16px"
                      width="16px"
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 330 330"
                    >
                      <path
                        id="XMLID_224_"
                        d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394
                l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393
                C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"
                      />
                    </svg>
                  </Button>
                </div>
              </div>

            )
          }

          {comments.map((c) => c.id !== editCommentId && (
            <Comment editComment={editComment} deleteComment={deleteComment} id={c.id} key={c.id} name={c.name} comment={c.comment} timestamp={c.timestamp} replies={c.replies} />
          ))}
        </div>
      )}
    </>
  );
};
