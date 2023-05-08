import React from "react";
import './Styles/LogDisplay.css';
import FileString from "./Structures/FileString";

type Props = {
    fileStrings: FileString[];
};

export default function LogDisplay({fileStrings}: Props) {
    const regex = /(\d{6}),([\d:.]+) \[(\w*) *] (.*)/gm;

    const findColor = (fileName: string) => {
        if (fileName.startsWith("persimmonR"))
            return "red";
        if (fileName.startsWith("persimmonG")) {
            return "green";
        }
        if (fileName.startsWith("persimmonB")) {
            return "blue";
        }
        return "purple";
    };

    const compileList = (fileStrings: FileString[]): JSX.Element[] => {
        if (!fileStrings.length)
            return [<></>];
        let activeFileStrings = fileStrings.filter(fileString => fileString.isActive);
        let colorTable = activeFileStrings.map(fileString => findColor(fileString.filename));
        let matchers = activeFileStrings.map(fileString => fileString.content.matchAll(regex));

        let sortedMatches: RegExpMatchArray[] = [];
        let currentMatches: RegExpMatchArray[] = matchers.map(matcher => matcher.next().value);

        let k: number;
        while (true) {
            k = -1;
            for (let i = 0; i < currentMatches.length; i++) {
                if (currentMatches[i]) {
                    if (k >= 0) {
                        if (currentMatches[k][0].substring(0, 20).localeCompare(currentMatches[i][0].substring(0, 20)) > 0) {
                            k = i;
                        }
                    } else {
                        k = i;
                    }
                }
            }
            if (k >= 0) {
                currentMatches[k].push(colorTable[k]);
                sortedMatches.push(currentMatches[k]);
                currentMatches[k] = matchers[k].next().value;
            } else {
                break;
            }
        }

        return sortedMatches.map(match => <tr>
            <td>{match[1]}</td>
            <td>{match[2]}</td>
            <td>{match[3]}</td>
            <td className={match[5]}>{match[4]}</td>
        </tr>);
    };

    return <table className="LogDisplay">
        <thead>
        <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Tag</th>
            <th>Content</th>
        </tr>
        </thead>
        <tbody>{compileList(fileStrings)}</tbody>
    </table>;
}