import Button from 'react-bootstrap/Button';

import logo from "../../assets/delete-button-svgrepo-com.svg";
import { formatTimeStamp } from "../../utils/time_format";

import "./index.css"

export const Reply = ({ commentId, id, name, reply, timestamp, deleteReply, editReply }) => {
    return (
        <div className="reply-container">
            <div className="d-flex jcsb">
                <b>{name}</b>
                <i className="fs-12">{formatTimeStamp(timestamp)}</i>
            </div>
            <i className="mt-8 ellipsis">{reply}</i>
            <div className="btn-container mt-8">
                <Button variant="primary" onClick={() => editReply(commentId, id, name, reply)}>Edit</Button>
                <Button variant="danger" className="del-btn" onClick={() => deleteReply(commentId, id)}><img src={logo} alt="Delete" /></Button>
            </div>
        </div>
    )
}