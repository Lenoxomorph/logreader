import React from "react";
import './App.css';
import { ZipReader, BlobReader, BlobWriter } from "@zip.js/zip.js";

type MyState = {
    selectedFile: File | null;
    text: string;
};

export default class App extends React.Component<{}, MyState> {
    state: MyState = {
        selectedFile: null,
        text: "",
    };

    async openZipFile(file: File | null) {
        if (!file)
            return;
        let entries = await (new ZipReader(new BlobReader(file))).getEntries();
        if (entries && entries.length) {
            // @ts-ignore
            const data = await entries[2].getData(new BlobWriter());
            alert(data.text)
        }
    }

    // openZipFile(file: File | null) {
    //     if(!file)
    //         return;
    //     let reader = new FileReader();
    //     reader.readAsText(file);
    //     reader.onloadend = (e) => { // @ts-ignore
    //         this.setState((state, props) => ({text: e.target!.result!}))};
    // }

    render() {
        return (
            <div className="App">
                <form>
                    <input
                        type="file"
                        onChange={(e) => {
                            this.openZipFile(e.target.files![0]);
                        }}
                        accept="application/zip"
                    />
                </form>
                <p>space {this.state.text}</p>
            </div>
        );
    }
}