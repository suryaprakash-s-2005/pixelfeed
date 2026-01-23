import { useState } from "react";
import API from "../api/axios";
import Modal from "../components/Modal";

export default function Generate() {
  const [activeTab, setActiveTab] = useState("ai");
  const [prompt, setPrompt] = useState("");
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: "", msg: "" });

  const [previewFile, setPreviewFile] = useState(null);

  // Helper to process and compress images (handles both File objects and Base64 strings)
  const processAndCompressImage = (inputSource) => {
    return new Promise((resolve, reject) => {
      const imgElement = new Image();

      // Handle File object (for manual upload) or Data URL (for AI)
      if (inputSource instanceof File) {
        const reader = new FileReader();
        reader.readAsDataURL(inputSource);
        reader.onload = (e) => (imgElement.src = e.target.result);
        reader.onerror = reject;
      } else if (typeof inputSource === 'string') {
        // If it's already a base64 string without prefix, add it. 
        // If it has a prefix, use it as is.
        imgElement.src = inputSource.startsWith('data:')
          ? inputSource
          : `data:image/jpeg;base64,${inputSource}`;
      } else {
        reject(new Error("Invalid input source"));
      }

      imgElement.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1024;

        // Calculate new dimensions (never scale up, only down)
        let width = imgElement.width;
        let height = imgElement.height;

        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(imgElement, 0, 0, width, height);

        // Compress to JPEG with 0.7 quality
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(compressedDataUrl.split(',')[1]); // Return only base64 data
      };

      imgElement.onerror = (e) => reject(e);
    });
  };

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImg(null);
    try {
      const res = await API.post("/posts/generate", { prompt });
      // Compress the AI generated image before setting it to state
      // This ensures we don't upload a massive file later
      const compressed = await processAndCompressImage(res.data.imageBase64);
      setImg(compressed);
    } catch (err) {
      setModal({ isOpen: true, title: "Error", msg: err.response?.data?.message || "Generation failed", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) return alert("File too large (max 10MB)");

      try {
        const compressedBase64 = await processAndCompressImage(file);
        setImg(compressedBase64);
        setPreviewFile(URL.createObjectURL(file));
      } catch (error) {
        console.error("Compression failed", error);
        alert("Failed to process image");
      }
    }
  };

  const sharePost = async () => {
    if (!prompt.trim()) return setModal({ isOpen: true, title: "Missing Caption", msg: "Please add a description!", type: "info" });

    setIsPosting(true);
    try {
      await API.post("/posts/create", { prompt, imageBase64: img });
      setModal({ isOpen: true, title: "Success", msg: "Masterpiece shared to the community feed! 🎨", type: "success" });
      setImg(null);
      setPrompt("");
      setPreviewFile(null);
    } catch (err) {
      setModal({ isOpen: true, title: "Error", msg: "Failed to share post", type: "danger" });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="container center-flex" style={{ minHeight: "calc(100vh - 80px)", flexDirection: "column" }}>
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        type={modal.type}
      >
        {modal.msg}
      </Modal>

      <div className="glass-card" style={{ maxWidth: "800px", width: "100%", textAlign: "center", padding: "0", overflow: "hidden" }}>

        <div style={{ display: "flex", borderBottom: "1px solid var(--glass-border)" }}>
          <button
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "ai" ? "3px solid var(--accent)" : "1px solid transparent",
              color: activeTab === "ai" ? "var(--accent)" : "var(--text-secondary)",
              borderRadius: 0,
              padding: "20px",
              fontWeight: activeTab === "ai" ? "bold" : "normal",
              transition: "all 0.3s"
            }}
            onClick={() => { setActiveTab("ai"); setImg(null); }}
          >
            ✨ AI Dream
          </button>
          <button
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "upload" ? "3px solid var(--accent)" : "1px solid transparent",
              color: activeTab === "upload" ? "var(--accent)" : "var(--text-secondary)",
              borderRadius: 0,
              padding: "20px",
              fontWeight: activeTab === "upload" ? "bold" : "normal",
              transition: "all 0.3s"
            }}
            onClick={() => { setActiveTab("upload"); setImg(null); }}
          >
            📷 Manual Upload
          </button>
        </div>

        <div style={{ padding: "40px" }}>
          {activeTab === "ai" ? (
            <>
              <h1 style={{ fontSize: "2.5rem", marginBottom: "30px" }}>Turn prompts into pixels</h1>
              <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexDirection: "column" }}>
                <textarea
                  placeholder="Describe your imagination in detail..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  style={{ fontSize: "1.2rem", padding: "20px", borderRadius: "12px", resize: "none" }}
                />
                <button
                  onClick={generate}
                  disabled={loading || !prompt.trim()}
                  style={{
                    padding: "15px",
                    fontSize: "1.1rem",
                    background: loading ? "#333" : "var(--accent)",
                    color: loading ? "#888" : "black"
                  }}
                >
                  {loading ? "Dreaming... (This takes a few seconds)" : "Generate Artwork"}
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: "2.5rem", marginBottom: "30px" }}>Share your photography</h1>

              {!img ? (
                <div style={{ border: "2px dashed var(--glass-border)", borderRadius: "12px", padding: "40px", cursor: "pointer", marginBottom: "20px" }}>
                  <label htmlFor="manual-upload" style={{ cursor: "pointer", display: "block" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "4rem", color: "var(--text-secondary)" }}>cloud_upload</span>
                    <p style={{ marginTop: "10px", color: "var(--text-secondary)" }}>Click to upload an image</p>
                  </label>
                  <input id="manual-upload" type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
                </div>
              ) : (
                <div style={{ marginBottom: "20px" }}>
                  <img
                    src={`data:image/jpeg;base64,${img}`}
                    style={{ maxWidth: "100%", maxHeight: "400px", borderRadius: "12px" }}
                    alt="Preview"
                  />
                  <button onClick={() => setImg(null)} style={{ display: "block", margin: "10px auto", background: "transparent", color: "var(--danger)" }}>
                    Change Image
                  </button>
                </div>
              )}

              <textarea
                placeholder="Write a caption for your post..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                style={{ fontSize: "1.1rem", padding: "15px", borderRadius: "12px", resize: "none" }}
              />
            </>
          )}

          {loading && (
            <div style={{ padding: "40px", color: "var(--accent)" }}>
              <div className="loader">Creating your masterpiece...</div>
            </div>
          )}

          {(img && activeTab === "ai") || (img && activeTab === "upload") ? (
            <div style={{ marginTop: "30px", animation: "fadeIn 1s ease" }}>
              {activeTab === "ai" && (
                <div style={{
                  position: "relative",
                  padding: "10px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "16px",
                  display: "inline-block",
                  marginBottom: "20px"
                }}>
                  <img
                    style={{
                      maxWidth: "100%",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                      display: "block"
                    }}
                    src={`data:image/jpeg;base64,${img}`}
                    alt="generated"
                  />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                <button
                  onClick={sharePost}
                  disabled={isPosting}
                  style={{
                    background: isPosting ? "#555" : "var(--accent)",
                    color: isPosting ? "#aaa" : "black",
                    padding: "12px 30px",
                    fontSize: "1.1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: isPosting ? "not-allowed" : "pointer",
                    opacity: isPosting ? 0.7 : 1
                  }}
                >
                  {isPosting ? (
                    <>Posting... <span className="material-symbols-outlined spin">hourglass_empty</span></>
                  ) : (
                    <>Post to Feed <span className="material-symbols-outlined">send</span></>
                  )}
                </button>
                {activeTab === "ai" && !isPosting && (
                  <button
                    onClick={() => setImg(null)}
                    style={{ background: "transparent", border: "1px solid var(--glass-border)", color: "var(--text-secondary)", padding: "12px 30px" }}
                  >
                    Discard
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
