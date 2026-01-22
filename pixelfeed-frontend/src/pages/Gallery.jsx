import { useEffect, useState } from "react";
import API from "../api/axios";
import ImageCard from "../components/ImageCard";
import { ImageModal } from "../components/Modal";
import { useAuth } from "../context/AuthContext";

export default function Gallery() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewPost, setViewPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { isAuth } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsRes = await API.get("/posts");
        setPosts(postsRes.data);
        if (isAuth) {
          const userRes = await API.get("/auth/me");
          setCurrentUser(userRes.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuth]);

  return (
    <div className="container">
      <ImageModal
        isOpen={!!viewPost}
        onClose={() => setViewPost(null)}
        imageSrc={viewPost ? `data:image/jpeg;base64,${viewPost.imageBase64}` : ""}
        prompt={viewPost?.prompt}
        user={viewPost?.user?.username || viewPost?.user?.name}
      />

      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem" }}>Community Feed 🌍</h1>
        <p style={{ color: "var(--text-secondary)" }}>Explore creations from around the world.</p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading inspiration...</p>
      ) : (
        <>
          {posts.length === 0 && <p style={{ textAlign: "center" }}>No posts yet. Be the first to create one!</p>}
          <div className="masonry-grid">
            {posts.map(p => (
              <div key={p._id} className="masonry-item" onClick={() => setViewPost(p)}>
                <ImageCard post={p} currentUser={currentUser} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
