import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './TextEditor.scss';

// Define custom toolbar options
const toolbarOptions = [
  [{ 'font': [] }],
  [{ 'size': ['small', false, 'large', 'huge'] }], // Add font size options here
  ['bold', 'italic', 'underline'],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'align': [] }],
  ['link', 'image'],
  ['clean'] // Remove formatting button
];

const TextEditor = ({ value, onChange }) => {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      theme="snow"
      modules={{ toolbar: toolbarOptions }} // Apply custom toolbar
    />
  );
};

TextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TextEditor;
