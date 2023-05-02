import React, {useState} from "react";
import {ZipReader, BlobReader, BlobWriter, TextWriter} from "@zip.js/zip.js";
import './FileInput.css';

type Props = {
    updateFileList: (val: FileList | null) => void;
};

export default function FileInput({updateFileList}: Props) {
    return <form>
        <input
            type="file"
            onChange={(e) => {
                updateFileList(e.target.files);
            }}
            accept="application/zip"/>
    </form>;
}
