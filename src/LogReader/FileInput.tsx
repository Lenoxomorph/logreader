import React from "react";
import './Styles/FileInput.css';
import {BlobReader, TextWriter, ZipReader} from "@zip.js/zip.js";
import FileString from "./Structures/FileString";
import Dictionary from "./Structures/Dictionary";

const defaultActiveFiles = ["persimmon.log"];

type Props = {
    updateFileStrings: (val: FileString[]) => void;
    configFiles: Dictionary<string>;
};

export default function FileInput({updateFileStrings, configFiles}: Props) {
    const updateFiles = async (fileList: FileList | null) => {
        if (!fileList)
            return;
        let zipFile = fileList[0];
        let entries = await (new ZipReader(new BlobReader(zipFile))).getEntries();

        entries = entries.filter((entry) => entry.filename.startsWith("var/log/persimmon/"));
        entries.forEach((entry) => entry.filename = entry.filename.replace("var/log/persimmon/", ""));

        let returnList: FileString[] = [];
        for (const entry of entries) {
            let key = Object.keys(configFiles).find(configFile => entry.filename.startsWith(configFile))
            if (key) {
                returnList.push({
                    filename: entry.filename,
                    color: configFiles[key],
                    content: await entry.getData!(new TextWriter()),
                    isActive: false
                })
            }
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
