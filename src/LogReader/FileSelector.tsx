import React from "react";
import './Styles/FileSelector.css';
import FileString from "./Structures/FileString";
import ErrorLog from "./Structures/ErrorLog";

type Props = {
    fileStrings: FileString[];
    updateFileStrings: (val: FileString[]) => void;
    updateErrorList: (val: ErrorLog[]) => void;
};

export default function FileSelector({fileStrings, updateFileStrings, updateErrorList}: Props) {
    const handleFileClick = (name: string) => {
        updateErrorList([]);
        const newItems = fileStrings.map(item => {
            if (item.filename === name) {
                return {...item, isActive: !item.isActive};
            } else {
                return item;
            }
        });
        updateFileStrings(newItems);
    };

    if (!fileStrings.length)
        return <p>{"File Not Uploaded"}</p>;
    return <ul className="FileList">
        {fileStrings.map(fileString => (
            <li className={`${fileString.isActive ? "" : "inactive"} ${fileString.color}`}
                onClick={() => handleFileClick(fileString.filename)}>
                {fileString.filename}
            </li>))}
    </ul>;
}