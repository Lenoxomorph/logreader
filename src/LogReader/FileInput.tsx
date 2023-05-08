import React from "react";
import './Styles/FileInput.css';
import {BlobReader, TextWriter, ZipReader} from "@zip.js/zip.js";
import FileString from "./Structures/FileString";

const defaultActiveFiles = ["persimmon.log"];

type Props = {
    updateFileStrings: (val: FileString[]) => void;
};

export default function FileInput({updateFileStrings}: Props) {
    const updateFiles = async (fileList: FileList | null) => {
        if (!fileList)
            return;
        let zipFile = fileList[0];
        let entries = await (new ZipReader(new BlobReader(zipFile))).getEntries();
        entries = entries.filter((entry) => entry.filename.startsWith("var/log/persimmon/persimmon"));

        let returnList: FileString[] = [];
        for (let i = 0; i < entries.length; i++) {
            returnList[i] = {
                filename: entries[i].filename.replace("var/log/persimmon/", ""),
                content: await entries[i].getData!(new TextWriter()),
                isActive: false
            };
        }
        returnList.sort((a, b) => a.filename.localeCompare(b.filename));

        defaultActiveFiles.forEach(defaultActiveFileName => {
            let match = returnList.find(fileString => fileString.filename === defaultActiveFileName);
            if (match)
                match.isActive = true;
        });

        updateFileStrings(returnList);
    };

    return <form>
        <input
            type="file"
            onChange={(e) => {
                void updateFiles(e.target.files);
            }}
            accept="application/zip"/>
    </form>;
}
