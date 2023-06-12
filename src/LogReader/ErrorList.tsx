import './Styles/ErrorList.css';
import ErrorLog from "./Structures/ErrorLog";
import React from "react";

type Props = {
    errorList: ErrorLog[];
};

export default function ErrorList({errorList}: Props) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const displayDate = (dateString: string) => {
        let year = dateString.substring(0, 2);
        let month = dateString.substring(2, 4);
        let day = dateString.substring(4, 6);

        return `${months[Number(month) - 1]} ${Number(day)} ${year}`;
    };

    return <table className="ErrorList">
        <thead>
        <tr>
            <th style={{minWidth: "90px"}}>Date</th>
            <th style={{minWidth: "90px"}}>Tag</th>
        </tr>
        </thead>
        <tbody>{errorList.map(error => <tr>
            <td className="date">{displayDate(error.date)}</td>
            {error.tag}
        </tr>)}</tbody>
    </table>;

    // error.ref.current.scrollIntoView()
}