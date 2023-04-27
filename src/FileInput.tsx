import React, {useState} from "react";
import {ZipReader, BlobReader, BlobWriter, TextWriter} from "@zip.js/zip.js";
import './FileInput.css';

export default function FileInput() {
    const [text, setText] = useState(<p>File Not Uploaded</p>);
    const regex = /(\d{6}),([\d:.]+) \[(\w*) *] (.*)/gm;

    const openZipFile = async (file: File | null) => {
        if (!file)
            return;
        let entries = await (new ZipReader(new BlobReader(file))).getEntries();
        entries = entries.filter((entry) => entry.filename.startsWith("var/log/persimmon/persimmon"));
        let logs = await Promise.all([entries[5], entries[7], entries[10], entries[15]].map(async log => {
            return await log.getData!(new TextWriter());
        }));
        let parsedLogs: RegExpExecArray[][] = [];
        let indexes = [0, 0, 0, 0];

        let m;
        for (let i = 0; i < logs.length; i++) {
            parsedLogs[i] = []
            while ((m = regex.exec(logs[i])) !== null) {
                parsedLogs[i].push(m)
            }
        }



        let returnArr: JSX.Element[] = [];

        let strArray = parsedLogs.map(log => log[0]);
        let tempStr: string | null = "";
        while (tempStr !== null) {
            tempStr = null;
            let k = -1;
            for (let i = 0; i < strArray.length; i++) {
                let line = strArray[i];
                // console.log("i: " + i);
                if (line !== undefined) {
                    // console.log("i: " + i + "Value" + line[0])
                    if (tempStr == null) {
                        tempStr = line[0];
                        k = i;
                    } else {
                        if (tempStr.substring(0, 20).localeCompare(line[0].substring(0, 20)) > 0) {
                            tempStr = line[0];
                            k = i;
                        }
                    }
                } else {
                    // console.log("Line Null")
                }
            }
            // alert(tempStr);
            if (k > -1) {
                indexes[k]++;
                strArray[k] = parsedLogs[k][indexes[k]]
                console.log("Str ARR: " + strArray[k]);
            }
            if (tempStr !== null) {
                console.log(tempStr)
                let color;
                switch(k) {
                    case 0:
                        color = "green"
                        break;
                    case 1:
                        color = "grey"
                        break;
                    case 2:
                        color = "blue"
                        break;
                    default:
                        color = "red"
                }
                returnArr.push(<p><mark className={color}>{tempStr}</mark></p>)
            }
        }
        setText(<>{returnArr}</>);

        // let m = <mark className="red">test</mark>
        // let n = <p>test</p> + m

        // setText(entries.map((entry, i) => i + ". " + entry.filename).join("\n"))
        // setText((await Promise.all(logs.map(log => log.then(value => value, reason => reason)))).join("\n"))
        // while ((m = regex.exec(data)) !== null) {
        //     if (m.index === regex.lastIndex) {
        //         regex.lastIndex++;
        //     }
        // }
    };

    return <>
        <form>
            <input
                type="file"
                onChange={(e) => {
                    openZipFile(e.target.files![0]);
                }}
                accept="application/zip"/>
        </form>
        {text}</>;
}
