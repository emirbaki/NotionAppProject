import { convertFromRaw, EditorState } from "draft-js";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { NoteContentProps } from "../utils/Interfaces";

const Index : React.FC<NoteContentProps> = ({content, onUpdate }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const onEditorStateChange = function (editorState : EditorState) {
      setEditorState(editorState);
      // const { blocks } = convertToRaw(editorState.getCurrentContent());
      /*let text = blocks.reduce((acc, item) => {
        acc = acc + item.text;
        return acc;
      }, "");*/
      const theCurrentText = editorState.getCurrentContent().getPlainText("\u0001");
      // content = text;
      onUpdate(theCurrentText);
    };
    
    useEffect(() => {
      try {
        if (content) {
          const contentState = convertFromRaw(JSON.parse(content));
          setEditorState(EditorState.createWithContent(contentState));
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        // Handle the error, e.g., display a message to the user
      }
    }, [content]);
  
    return (
      <>
        {<div style={{ height: "80px", overflow: "auto" }}>{content}</div>}
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onEditorStateChange}
          mention={{
            separator: " ",
            trigger: "@",
            suggestions: [
              { text: "APPLE", value: "apple" },
              { text: "BANANA", value: "banana", url: "banana" },
              { text: "CHERRY", value: "cherry", url: "cherry" },
              { text: "DURIAN", value: "durian", url: "durian" },
              { text: "EGGFRUIT", value: "eggfruit", url: "eggfruit" },
              { text: "FIG", value: "fig", url: "fig" },
              { text: "GRAPEFRUIT", value: "grapefruit", url: "grapefruit" },
              { text: "HONEYDEW", value: "honeydew", url: "honeydew" }
            ]
          }}
        />
      </>
    );
  }

export default Index;
