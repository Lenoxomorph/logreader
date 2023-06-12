import React, {useState} from "react";
import './Styles/LogReader.css';

import FileInput from "./FileInput";
import LogDisplay from "./LogDisplay";
import FileString from "./Structures/FileString";
import FileSelector from "./FileSelector";
import config from '../config.json';
import ErrorLog from "./Structures/ErrorLog";
import ErrorList from "./ErrorList";

export default function LogReader() {
    const [fileStrings, updateFileStrings] = useState<FileString[]>([]);
    const [errorList, updateErrorList] = useState<ErrorLog[]>([]);

    return (
        <div className="App">
            <div className="FileInputPanel">
                <FileInput updateFileStrings={updateFileStrings} configFiles={config.files}/>
                <div className="FileListContainer">
                    <FileSelector fileStrings={fileStrings} updateFileStrings={updateFileStrings}/>
                </div>
            </div>
            <div className="LogDisplayPanel">
                <LogDisplay fileStrings={fileStrings} configTags={config.tags} configSearch={config.search} errorList={errorList} updateErrorList={updateErrorList}/>
            </div>
            <div className="ErrorListPanel">
                <ErrorList errorList={errorList}/>
            </div>
        </div>
    );
}