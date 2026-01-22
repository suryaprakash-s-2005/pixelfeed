import { useState } from "react";
import API from "../api/axios";

export default function ImageCard({ post, onDelete, currentUser }) {
  const [likes, setLikes] = useState(post.likes || []);
  const isLiked = currentUser && likes.includes(currentUser._id);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) return;

    const previousLikes = [...likes];
    if (isLiked) {
      setLikes(likes.filter(id => id !== currentUser._id));
    } else {
      setLikes([...likes, currentUser._id]);
    }

    try {
      await API.put(`/posts/${post._id}/like`);
    } catch (err) {
      setLikes(previousLikes);
    }
  };

  const deletePost = (e) => {
    e.stopPropagation();
    onDelete(post._id);
  };

  const downloadImage = (e) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = `data:image/jpeg;base64,${post.imageBase64}`;
    link.download = `pixelfeed-${post._id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="image-card">
      <img src={`data:image/jpeg;base64,${post.imageBase64}`} alt={post.prompt} loading="lazy" />

      <div className="overlay">
        <p className="prompt">{post.prompt}</p>

        <div className="actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.8rem", color: "#ddd", fontWeight: "bold" }}>@{post.user?.username || "user"}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <button
                onClick={handleLike}
                className={`icon-btn ${isLiked ? "liked" : ""}`}
                title="Like"
              >
                <span className={`material-symbols-outlined ${isLiked ? "filled" : ""}`} style={{ fontSize: "1.2rem" }}>favorite</span>
              </button>
              <span style={{ fontSize: "0.9rem", color: "white" }}>{likes.length}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "5px" }}>
            <button onClick={downloadImage} className="icon-btn" title="Download">
              <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>download</span>
            </button>
            {onDelete && (
              <button onClick={deletePost} className="icon-btn danger" title="Delete">
                <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>delete</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .image-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          transition: transform 0.3s;
          cursor: pointer;
          background: #2a2a2a;
        }
        .image-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }
        .image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .image-card .overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
          padding: 20px;
          opacity: 0;
          transition: opacity 0.3s;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .image-card:hover .overlay {
          opacity: 1;
        }
        .prompt {
          font-size: 0.9rem;
          color: white;
          margin: 0 0 10px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .icon-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          backdrop-filter: blur(5px);
        }
        .icon-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: scale(1.1);
        }
        .icon-btn:active {
          transform: scale(0.95);
        }
        .icon-btn.liked {
          background: rgba(255, 0, 0, 0.2);
          color: #ff4b4b;
        }
        .material-symbols-outlined.filled {
          font-variation-settings: 'FILL' 1;
        }
        .icon-btn {
            color: white; 
        }
        .icon-btn.danger:hover {
          background: rgba(255, 50, 50, 0.4);
        }
      `}</style>
    </div>
  );
}
