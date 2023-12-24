import { useState } from "react";
import Button from 'react-bootstrap/Button';

import logo from "../../assets/delete-button-svgrepo-com.svg";
import { formatTimeStamp } from "../../utils/time_format";
import { Reply } from "../Reply/Reply";

import "./index.css";

export const Comment = ({ id, name, comment, timestamp, replies, deleteComment, editComment }) => {
    const [editReplyId, setEditReplyId] = useState("");
    const [replyForm, setReplyForm] = useState({
        name: "",
        reply: "",
    });

    const [sortOrder, setSortOrder] = useState("DESC");

    const [commentReplies, setCommentReplies] = useState(replies);

    const [showReplyForm, setShowReplyForm] = useState(false);

    const saveReply = () => {
        setShowReplyForm(true);
    };

    const sortBy = () => {
        if (sortOrder === "ASC") {
            setSortOrder("DESC");
        } else {
            setSortOrder("ASC");
        }
        const comments = localStorage.getItem("comments");
        const commentsJson = JSON.parse(comments) || [];

        const commentReplies = commentsJson.find((c) => c.id === id);

        const replies = commentReplies.replies;

        // Sorting the comments array based on the timestamp property
        let sortedReplies;
        if (sortOrder === "ASC") {
            sortedReplies = replies.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        } else {
            sortedReplies = replies.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        }
        setCommentReplies(sortedReplies);
    };

    const deleteReply = (commentId, replyId) => {
        const comments = localStorage.getItem("comments");
        if (comments) {
            const commentsJson = JSON.parse(comments);
            const comment = commentsJson.find((c) => c.id === commentId);
            comment.replies = comment.replies.filter((r) => r.id !== replyId);
            localStorage.setItem("comments", JSON.stringify(commentsJson));
            setCommentReplies(comment.replies);
        }
    };

    const editReply = (commentId, id, name, reply) => {
        setShowReplyForm(true);
        setEditReplyId(id);
        setReplyForm({
            name,
            reply,
        });
    };
    const postReply = () => {
        if (replyForm.name === "" || replyForm.reply === "") {
            alert("Name and Reply are required");
            setShowReplyForm(false);
            return;
        }
        const comments = localStorage.getItem("comments");
        const commentsJson = JSON.parse(comments);
        const comment = commentsJson.find((c) => c.id === id);
        if (editReplyId) {
            let storedReply = comment.replies.find((r) => r.id === editReplyId);
            storedReply.reply = replyForm.reply;
            storedReply.timestamp = new Date();
            setEditReplyId("");
        } else {
            const replyObj = {
                id: Date.now(),
                name: replyForm.name,
                reply: replyForm.reply,
                timestamp: new Date(),
            };
            if (comment.replies && comment.replies.length > 0) {
                comment.replies.push(replyObj);
            } else {
                comment.replies = [{ ...replyObj }];
            }
        }
        setCommentReplies(comment.replies);
        localStorage.setItem("comments", JSON.stringify(commentsJson));
        setShowReplyForm(false);
        emptyReplyForm();
    };

    const emptyReplyForm = () => {
        setReplyForm({
            name: "",
            reply: "",
        });
    };
    return (
        <>
            <div className="comment-container">
                <div className="d-flex jcsb">
                    <b>{name}</b>
                    <i className="mt-8 fs-12">{formatTimeStamp(timestamp)}</i>
                </div>
                <i className="mt-8 ellipsis">{comment}</i>


                <div className="btn-container mt-8">
                    <Button variant="primary" onClick={(e) => saveReply()}>Reply</Button>
                    <Button variant="primary" className="ml-8" onClick={() => editComment(id, name, comment)} >Edit</Button>
                    <Button variant="danger" className="del-btn" onClick={() => deleteComment(id)}>
                        <img src={logo} alt="Delete" />
                    </Button>
                </div>
            </div>
            <div>
                {showReplyForm && (
                    <div className="reply">
                        <h6>Reply</h6>
                        <input
                            className="form-control"
                            disabled={editReplyId}
                            placeholder="Name"
                            value={replyForm.name}
                            type="text"
                            onChange={(e) =>
                                setReplyForm((prevForm) => {
                                    const updatedForm = { ...prevForm };
                                    updatedForm.name = e.target.value;
                                    return updatedForm;
                                })
                            }
                        ></input>
                        <textarea
                        className="form-control"
                            placeholder="Comment"
                            value={replyForm.reply}
                            style={{ marginTop: "12px" }}
                            onChange={(e) => {
                                setReplyForm((prevForm) => {
                                    const updatedForm = { ...prevForm };
                                    updatedForm.reply = e.target.value;
                                    return updatedForm;
                                });
                            }}
                        ></textarea>
                        <Button variant="primary" type="submit" className="post-btn" onClick={() => postReply()}>
                            {editReplyId ? 'Update' : 'Post'}
                        </Button>
                    </div>
                )}
                {commentReplies && commentReplies.length > 0 && (
                    <div>
                        {
                            !editReplyId && (
                                <div className="d-flex">
                                    <div className="d-flex jcsb w-70 ml-48 aic">
                                        <span>Replies</span>
                                        <div className="d-flex aic fs-14">
                                            <span>Sort By:</span>
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
                                </div>
                            )
                        }

                        {commentReplies.map(
                            (r) =>
                                r.id !== editReplyId && (
                                    <Reply editReply={editReply} deleteReply={deleteReply} commentId={id} id={r.id} key={r.id} name={r.name} reply={r.reply} timestamp={r.timestamp} />
                                )
                        )}
                    </div>
                )}
            </div>
        </>
    );
};
