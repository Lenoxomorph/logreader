import React, {useState} from "react";
import './Styles/LogDisplay.css';
import FileString from "./Structures/FileString";
import Dictionary from "./Structures/Dictionary";
import ErrorLog from "./Structures/ErrorLog";

type Props = {
    fileStrings: FileString[];
    configTags: Dictionary<string>;
    configSearch: Dictionary<string>;
    errorList: ErrorLog[];
    updateErrorList: (val: ErrorLog[]) => void;
};

export default function LogDisplay({fileStrings, configTags, configSearch, errorList, updateErrorList}: Props) {
    const regex = /(\d{6}),([\d:.]+)(?: \[(\w*) *])? (.*)/gm;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let nextID = 0;

    const displayDate = (dateString: string) => {
        let year = dateString.substring(0, 2);
        let month = dateString.substring(2, 4);
        let day = dateString.substring(4, 6);

        return `${months[Number(month) - 1]} ${Number(day)} ${year}`;
    };

    const createTag = (match: RegExpMatchArray) => {
        let tagColor: string[];
        let tag = configTags[match[3]];

        if (tag) {
            tagColor = tag.split(',');
        } else {
            tagColor = [match[3], configTags.default];
        }

        let key = Object.keys(configSearch).find(searchKey => (match[4].concat(match[3] ? match[3] : "")).includes(searchKey));
        if (key) {
            tagColor = configSearch[key].split(',');
            nextID++;
            errorList.push({
                date: match[1],
                tag: <td className="tag" style={{backgroundColor: tagColor[1]}}>{tagColor[0]}</td>,
                id: nextID
            })
            updateErrorList(errorList)
            return <td className="tag" style={{backgroundColor: tagColor[1]}} id={nextID.toString()}>{tagColor[0]}</td>;
        }

        //Search the Search keys to add their colors

        //let key = Object.keys(configFiles).find(configFile => entry.filename.startsWith(configFile))


        return <td className="tag" style={{backgroundColor: tagColor[1]}}>{tagColor[0]}</td>;
    };

    const compileList = (fileStrings: FileString[]): JSX.Element[] => {
        if (!fileStrings.length)
            return [<></>];
        let activeFileStrings = fileStrings.filter(fileString => fileString.isActive);
        let colorTable = activeFileStrings.map(fileString => fileString.color);
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
            <td className="date">{displayDate(match[1])}</td>
            <td>{match[2]}</td>
            {createTag(match)}
            <td className={match[5]}>{match[4]}</td>
        </tr>);
    };

    return <table className="LogDisplay">
        <thead>
        <tr>
            <th style={{minWidth: "90px"}}>Date</th>
            <th style={{minWidth: "90px"}}>Time</th>
            <th style={{minWidth: "70px"}}>Tag</th>
            <th>Content</th>
        </tr>
        </thead>
        <tbody>{compileList(fileStrings)}</tbody>
    </table>;
}