import { useState } from "react";
import API from "../api/axios";
import Modal from "../components/Modal";

export default function Generate() {
  const [activeTab, setActiveTab] = useState("ai");
  const [prompt, setPrompt] = useState("");
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: "", msg: "" });

  const [previewFile, setPreviewFile] = useState(null);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImg(null);
    try {
      const res = await API.post("/posts/generate", { prompt });
      setImg(res.data.imageBase64);
    } catch (err) {
      setModal({ isOpen: true, title: "Error", msg: err.response?.data?.message || "Generation failed", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert("File too large (max 5MB)");
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImg(reader.result.split(',')[1]);
        setPreviewFile(reader.result);
      };
    }
  };

  const sharePost = async () => {
    if (!prompt.trim()) return setModal({ isOpen: true, title: "Missing Caption", msg: "Please add a description!", type: "info" });
    try {
      await API.post("/posts/create", { prompt, imageBase64: img });
      setModal({ isOpen: true, title: "Success", msg: "Masterpiece shared to the community feed! 🎨", type: "success" });
      setImg(null);
      setPrompt("");
      setPreviewFile(null);
    } catch (err) {
      setModal({ isOpen: true, title: "Error", msg: "Failed to share post", type: "danger" });
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
                  style={{ background: "var(--accent)", color: "black", padding: "12px 30px", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "10px" }}
                >
                  Post to Feed <span className="material-symbols-outlined">send</span>
                </button>
                {activeTab === "ai" && (
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
      `}</style>
    </div>
  );
}
