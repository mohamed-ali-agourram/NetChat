'use client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToasterContext = () => {
  return (
    <ToastContainer pauseOnFocusLoss={false} toastStyle={{ backgroundColor: "#0000008f", color: "white"}}/>
  );
}

export default ToasterContext;