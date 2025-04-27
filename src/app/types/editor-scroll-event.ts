import {editor, IScrollEvent} from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

export interface EditorScrollEvent {
  editor: IStandaloneCodeEditor;
  scrollEvent: IScrollEvent;
}
