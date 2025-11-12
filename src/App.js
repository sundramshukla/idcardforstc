// import React, { useRef, useState } from "react";

// function App() {
//   const videoRef = useRef(null);
//   const [stream, setStream] = useState(null);
//   const [photo, setPhoto] = useState(null);
//   const [details, setDetails] = useState({ name: "", post: "", dept: "" });
//   const [loading, setLoading] = useState(false);

//   // ✅ कैमरा चालू करें
//   const startCamera = async () => {
//     try {
//       const s = await navigator.mediaDevices.getUserMedia({
//         video: { width: 1280, height: 720 },
//       });
//       setStream(s);
//       videoRef.current.srcObject = s;
//     } catch (err) {
//       alert("कैमरा चालू नहीं हो सका! " + err.message);
//     }
//   };

//   // ✅ फोटो कैप्चर करें
//   const capturePhoto = () => {
//     if (!videoRef.current) return;
//     const canvas = document.createElement("canvas");
//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(videoRef.current, 0, 0);
//     const imgData = canvas.toDataURL("image/png");
//     setPhoto(imgData);
//     stream.getTracks().forEach((t) => t.stop());
//     setStream(null);
//   };

//   // ✅ Input हैंडल करें
//   const handleChange = (e) => {
//     setDetails({ ...details, [e.target.name]: e.target.value });
//   };

//   // ✅ Backend को डेटा भेजें और Card बनवाएँ
//   const handlePrint = async () => {
//     if (!photo) return alert("पहले फोटो लें!");
//     if (!details.name || !details.post || !details.dept)
//       return alert("सारी जानकारी भरें!");

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("name", details.name);
//       formData.append("post", details.post);
//       formData.append("dept", details.dept);
//       const blob = await fetch(photo).then((r) => r.blob());
//       formData.append("photo", blob, "photo.png");

//       const res = await fetch("http://127.0.0.1:8000/api/print-card/", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       if (res.ok) {
//         const imageUrl = "http://127.0.0.1:8000" + data.card_url;

//         // ✅ Auto print popup
//         const printWindow = window.open("", "_blank");
//         printWindow.document.write(`
//           <html>
//             <head><title>Print ID Photo</title></head>
//             <body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#fff;">
//               <img src="${imageUrl}" style="width:105mm;height:151mm;object-fit:contain;" />
//               <script>
//                 window.onload = function() {
//                   window.print();
//                   setTimeout(() => window.close(), 800);
//                 };
//               </script>
//             </body>
//           </html>
//         `);
//         printWindow.document.close();

//         // ✅ 2 सेकंड बाद auto reset & camera ready
//         setTimeout(() => {
//           setPhoto(null);
//           setDetails({ name: "", post: "", dept: "" });
//           startCamera();
//         }, 2500);
//       } else {
//         alert("Error: " + (data.error || "कुछ गड़बड़ हुई है"));
//       }
//     } catch (err) {
//       alert("Server से संपर्क नहीं हो पाया!");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ दोबारा फोटो लेने का ऑप्शन
//   const retake = () => {
//     setPhoto(null);
//     startCamera();
//   };

//   return (
//     <div style={styles.page}>
//       <h1 style={styles.heading}>🪪 ID Card Generator (React + Django)</h1>

//       {/* Camera / Photo Section */}
//       {!photo ? (
//         <>
//           <video ref={videoRef} autoPlay style={styles.video}></video>
//           <div style={styles.btnGroup}>
//             <button onClick={startCamera} style={styles.btnBlue}>
//               📷 कैमरा चालू करें
//             </button>
//             <button onClick={capturePhoto} style={styles.btnPink}>
//               📸 फोटो लें
//             </button>
//           </div>
//         </>
//       ) : (
//         <>
//           <img src={photo} alt="Preview" style={styles.preview} />
//           <div style={styles.btnGroup}>
//             <button onClick={retake} style={styles.btnOrange}>
//               🔁 दोबारा लें
//             </button>
//           </div>
//         </>
//       )}

//       {/* Input Section */}
//       <div style={styles.inputBox}>
//         <input
//           type="text"
//           name="name"
//           placeholder="नाम"
//           value={details.name}
//           onChange={handleChange}
//           style={styles.input}
//         />
//         <input
//           type="text"
//           name="post"
//           placeholder="पदनाम"
//           value={details.post}
//           onChange={handleChange}
//           style={styles.input}
//         />
//         <input
//           type="text"
//           name="dept"
//           placeholder="विभाग"
//           value={details.dept}
//           onChange={handleChange}
//           style={styles.input}
//         />
//       </div>

//       <button onClick={handlePrint} style={styles.btnGreen} disabled={loading}>
//         {loading ? "प्रिंट हो रहा है..." : "🖨️ Print & Save Card"}
//       </button>

//       <footer style={styles.footer}>
//         © 2025 | Developed by <b>Sundram</b> 
//       </footer>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     textAlign: "center",
//     background: "linear-gradient(135deg, #f5f7fa, #e2e3e5)",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     fontFamily: "'Poppins', sans-serif",
//     padding: 20,
//   },
//   heading: { color: "#222", marginBottom: 20 },
//   video: {
//     width: 320,
//     height: 240,
//     borderRadius: 12,
//     border: "3px solid #007bff",
//     background: "#000",
//     boxShadow: "0 0 15px rgba(0,123,255,0.4)",
//   },
//   preview: {
//     width: 320,
//     height: 240,
//     borderRadius: 12,
//     border: "3px solid #28a745",
//     objectFit: "cover",
//     boxShadow: "0 0 15px rgba(40,167,69,0.4)",
//   },
//   btnGroup: { marginTop: 15, display: "flex", gap: 10, justifyContent: "center" },
//   btnBlue: {
//     padding: "10px 16px",
//     border: "none",
//     borderRadius: 8,
//     background: "#007bff",
//     color: "#fff",
//     fontSize: 16,
//     cursor: "pointer",
//   },
//   btnPink: {
//     padding: "10px 16px",
//     border: "none",
//     borderRadius: 8,
//     background: "#d63384",
//     color: "#fff",
//     fontSize: 16,
//     cursor: "pointer",
//   },
//   btnOrange: {
//     padding: "10px 16px",
//     border: "none",
//     borderRadius: 8,
//     background: "#fd7e14",
//     color: "#fff",
//     fontSize: 16,
//     cursor: "pointer",
//   },
//   btnGreen: {
//     padding: "10px 16px",
//     border: "none",
//     borderRadius: 8,
//     background: "#28a745",
//     color: "#fff",
//     fontSize: 16,
//     cursor: "pointer",
//     marginTop: 15,
//   },
//   inputBox: {
//     marginTop: 15,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 8,
//   },
//   input: {
//     width: 220,
//     padding: "8px 10px",
//     borderRadius: 8,
//     border: "1px solid #ccc",
//     outline: "none",
//     textAlign: "center",
//   },
//   footer: {
//     marginTop: 40,
//     color: "#666",
//     fontSize: 14,
//   },
// };

// export default App;


import React, { useRef, useState, useEffect } from "react";

function App() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [details, setDetails] = useState({ 
    name: "", 
    post: "", 
    dept: "", 
    from_date: "", 
    to_date: "" 
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Camera list states
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  // 🔹 Detect cameras on mount
  useEffect(() => {
    async function loadDevices() {
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Camera detection error:", err);
      }
    }
    loadDevices();
  }, []);

  // ✅ कैमरा चालू करें
  const startCamera = async () => {
    try {
      // पहले से चल रहे stream को बंद करें
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }

      const constraints = {
        video: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const s = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      alert("कैमरा चालू नहीं हो सका! " + err.message);
    }
  };

  // ✅ फोटो कैप्चर करें
  const capturePhoto = () => {
    if (!videoRef.current || !stream) return;
    
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const imgData = canvas.toDataURL("image/png");
    setPhoto(imgData);
    
    // Stream बंद करें
    stream.getTracks().forEach((t) => t.stop());
    setStream(null);
  };

  // ✅ Input हैंडल करें
  const handleChange = (e) => {
    setDetails({ 
      ...details, 
      [e.target.name]: e.target.value 
    });
  };

  // ✅ Backend को डेटा भेजें और Card बनवाएँ
  const handlePrint = async () => {
    if (!photo) {
      alert("पहले फोटो लें!");
      return;
    }
    
    if (!details.name || !details.post || !details.dept) {
      alert("सारी जानकारी भरें!");
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("name", details.name);
      formData.append("post", details.post);
      formData.append("dept", details.dept);
      formData.append("from_date", details.from_date);
      formData.append("to_date", details.to_date);

      // Convert base64 to blob
      const response = await fetch(photo);
      const blob = await response.blob();
      formData.append("photo", blob, "photo.png");

      const res = await fetch("http://127.0.0.1:8000/api/print-card/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Error: " + (errorData.error || "कुछ गड़बड़ हुई है"));
        return;
      }

      const data = await res.json();
      const imageUrl = "http://127.0.0.1:8000" + data.card_url;

      // ✅ Auto print popup
      // 🔹 Step 1: hidden iframe create करो
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";
      document.body.appendChild(iframe);

      // 🔹 Step 2: iframe में HTML inject करो
      iframe.contentDocument.open();
      iframe.contentDocument.write(`
        <html>
          <head>
            <title>ID Card Print</title>
            <style>
              body { 
                margin: 0; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                background: #fff; 
                height: 100vh;
              }
              img { 
                width: 100%; 
                height: auto; 
                object-fit: contain; 
                max-width: 100%;
              }
            </style>
          </head>
          <body>
            <img src="${imageUrl}" alt="ID Card" />
          </body>
        </html>
      `);
      iframe.contentDocument.close();

      // 🔹 Step 3: wait for image to load, then print
      const img = iframe.contentDocument.querySelector("img");
      const waitForImageLoad = new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = resolve; // Continue even if image fails to load
        }
      });

      await waitForImageLoad;

      // Print the iframe
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      // Cleanup after printing
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        resetForm();
      }, 1000);

    } catch (err) {
      console.error("Print error:", err);
      alert("Server से संपर्क नहीं हो पाया!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Form reset function
  const resetForm = () => {
    setPhoto(null);
    setDetails({ 
      name: "", 
      post: "", 
      dept: "", 
      from_date: "", 
      to_date: "" 
    });
    startCamera();
  };

  // ✅ दोबारा फोटो लेने का ऑप्शन
  const retake = () => {
    setPhoto(null);
    startCamera();
  };

  // 🔹 Handle camera switch
  const handleCameraChange = (e) => {
    setSelectedDeviceId(e.target.value);
  };

  // Start camera when component mounts or device changes
  useEffect(() => {
    if (devices.length > 0 && !photo) {
      startCamera();
    }
  }, [devices, selectedDeviceId]);

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>🪪 ID Card Generator</h1>

      {/* 🔹 Camera Selector */}
      <div style={styles.cameraSelector}>
        <label style={styles.label}>Camera चुनें: </label>
        <select
          onChange={handleCameraChange}
          value={selectedDeviceId || ""}
          style={styles.dropdown}
        >
          {devices.map((device, i) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${i + 1}`}
            </option>
          ))}
        </select>
        <button onClick={startCamera} style={styles.btnBlueSmall}>
          ▶️ Start Camera
        </button>
      </div>

      {/* Camera / Photo Section */}
      {!photo ? (
        <div style={styles.cameraSection}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            style={styles.video}
          ></video>
          <div style={styles.btnGroup}>
            <button onClick={capturePhoto} style={styles.btnPink}>
              📸 फोटो लें
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.photoSection}>
          <img src={photo} alt="Preview" style={styles.preview} />
          <div style={styles.btnGroup}>
            <button onClick={retake} style={styles.btnOrange}>
              🔁 दोबारा लें
            </button>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div style={styles.inputBox}>
        <input
          type="text"
          name="name"
          placeholder="नाम"
          value={details.name}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="post"
          placeholder="पदनाम"
          value={details.post}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="dept"
          placeholder="विभाग"
          value={details.dept}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="date"
          name="from_date"
          placeholder="From Date"
          value={details.from_date}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="date"
          name="to_date"
          placeholder="To Date"
          value={details.to_date}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      {/* Print Button */}
      <button 
        onClick={handlePrint} 
        style={styles.btnGreen} 
        disabled={loading}
      >
        {loading ? "प्रिंट हो रहा है..." : "🖨️ Print & Save Card"}
      </button>

      <footer style={styles.footer}>
        © 2025 | Developed by <b>Sundram</b>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    textAlign: "center",
    background: "linear-gradient(135deg, #f5f7fa, #e2e3e5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Poppins', sans-serif",
    padding: 20,
  },
  heading: { 
    color: "#222", 
    marginBottom: 20,
    fontSize: "1.8rem",
    fontWeight: "bold"
  },
  cameraSelector: {
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center"
  },
  label: {
    fontWeight: "bold",
    color: "#333"
  },
  dropdown: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    minWidth: 150
  },
  btnBlueSmall: {
    padding: "8px 16px",
    border: "none",
    borderRadius: 6,
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  },
  cameraSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 15
  },
  photoSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 15
  },
  video: {
    width: 320,
    height: 240,
    borderRadius: 12,
    border: "3px solid #007bff",
    background: "#000",
    boxShadow: "0 0 15px rgba(0,123,255,0.4)",
  },
  preview: {
    width: 320,
    height: 240,
    borderRadius: 12,
    border: "3px solid #28a745",
    objectFit: "cover",
    boxShadow: "0 0 15px rgba(40,167,69,0.4)",
  },
  btnGroup: { 
    display: "flex", 
    gap: 10, 
    justifyContent: "center" 
  },
  btnPink: {
    padding: "12px 20px",
    border: "none",
    borderRadius: 8,
    background: "#d63384",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
    fontWeight: "bold",
    minWidth: 140
  },
  btnOrange: {
    padding: "12px 20px",
    border: "none",
    borderRadius: 8,
    background: "#fd7e14",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
    fontWeight: "bold",
    minWidth: 140
  },
  btnGreen: {
    padding: "12px 24px",
    border: "none",
    borderRadius: 8,
    background: "#28a745",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: 20,
    minWidth: 200,
    opacity: 1,
    transition: "opacity 0.3s"
  },
  inputBox: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    width: "100%",
    maxWidth: 300
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none",
    textAlign: "center",
    fontSize: 14
  },
  footer: {
    marginTop: 40,
    color: "#666",
    fontSize: 14,
  },
};

export default App;











          "https://idcardsundram.pythonanywhere.com/" + data.card_url;