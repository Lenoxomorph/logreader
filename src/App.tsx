import React, {useState, Suspense} from "react";
import './App.css';

import FileInput from "./FileInput";
import LogDisplay from "./LogDisplay";

export default function App() {
    const [fileList, updateFileList] = useState<FileList | null>(null); //TODO: Check if the initial State is nessasary
    return (
        <div className="App">
            <FileInput updateFileList={updateFileList}/>
            <Suspense fallback={<h1>Loading posts...</h1>}>
                <LogDisplay fileList={fileList}/>
            </Suspense>
        </div>
    );
}