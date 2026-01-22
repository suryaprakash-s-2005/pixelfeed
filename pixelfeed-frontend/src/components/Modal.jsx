import React from "react";

const Modal = ({ isOpen, onClose, title, children, type = "info", onConfirm, confirmText = "Confirm" }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)",
            zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center"
        }} onClick={onClose}>
            <div
                className="glass-card"
                style={{
                    maxWidth: "500px", width: "90%", padding: "30px",
                    position: "relative", animation: "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute", top: "15px", right: "15px",
                        background: "none", border: "none", color: "var(--text-secondary)", fontSize: "1.2rem", padding: "5px"
                    }}
                >
                    ✕
                </button>

                {title && <h2 style={{ marginTop: 0, marginBottom: "20px", color: type === "danger" ? "var(--danger)" : "var(--text-primary)" }}>{title}</h2>}

                <div style={{ marginBottom: "25px", lineHeight: "1.6" }}>
                    {children}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    {onConfirm ? (
                        <>
                            <button
                                onClick={onClose}
                                style={{ background: "transparent", border: "1px solid var(--glass-border)", color: "var(--text-secondary)" }}
                            >
                                Cancel
                            </button>
                            <button
                                className={type === "danger" ? "danger" : ""}
                                onClick={() => { onConfirm(); onClose(); }}
                            >
                                {confirmText}
                            </button>
                        </>
                    ) : (
                        <button onClick={onClose}>OK</button>
                    )}
                </div>
            </div>
            <style>{`
        @keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
      `}</style>
        </div>
    );
};

export const ImageModal = ({ isOpen, onClose, imageSrc, prompt, user }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.9)", zIndex: 1000,
            display: "flex", justifyContent: "center", alignItems: "center", padding: "20px"
        }} onClick={onClose}>

            <button
                onClick={onClose}
                style={{
                    position: "absolute", top: "20px", right: "20px",
                    background: "rgba(255,255,255,0.1)", color: "white", fontSize: "1.5rem", borderRadius: "50%",
                    width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center"
                }}
            >
                ✕
            </button>

            <div style={{ maxWidth: "90%", maxHeight: "90%", textAlign: "center" }} onClick={e => e.stopPropagation()}>
                <img
                    src={imageSrc}
                    alt={prompt}
                    style={{ maxHeight: "80vh", maxWidth: "100%", borderRadius: "8px", boxShadow: "0 0 50px rgba(0,0,0,0.5)" }}
                />
                <div style={{ marginTop: "20px", color: "white" }}>
                    <p style={{ fontSize: "1.2rem", fontWeight: "bold", margin: "0 0 5px 0" }}>{prompt}</p>
                    {user && <p style={{ color: "#aaa", margin: 0 }}>By @{user}</p>}
                </div>
            </div>
        </div>
    );
};

export default Modal;
