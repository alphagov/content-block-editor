import {ContentBlockEditor} from "../content-block-editor.ts";

declare global {
    interface Window {
        ContentBlockEditor: typeof ContentBlockEditor;
    }
}
