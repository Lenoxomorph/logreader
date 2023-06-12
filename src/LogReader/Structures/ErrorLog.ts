import React from "react";

export default interface ErrorLog {
    date: string;
    tag: string;
    ref: React.RefObject<HTMLTableDataCellElement>;
}