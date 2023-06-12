import React from "react";

export default interface ErrorLog {
    date: string;
    tag: JSX.Element;
    ref: React.RefObject<HTMLTableDataCellElement>;
}