import { useEffect, useState } from "react";
import API from "../api/axios";
import ImageCard from "../components/ImageCard";
import Modal, { ImageModal } from "../components/Modal";

export default function Profile() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({ bio: "", age: "", gender: "", profilePic: "" });
    const [preview, setPreview] = useState(null);



    const [deleteId, setDeleteId] = useState(null);
    const [viewPost, setViewPost] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [userRes, postsRes] = await Promise.all([
                API.get("/auth/me"),
                API.get("/posts/user")
            ]);
            setUser(userRes.data);
            setPosts(postsRes.data);
            setEditForm({
                bio: userRes.data.bio || "",
                age: userRes.data.age || "",
                gender: userRes.data.gender || "",
                profilePic: ""
            });
        } catch (err) {
            console.error("Failed to load profile", err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setEditForm({ ...editForm, profilePic: reader.result.split(',')[1] });
                setPreview(reader.result);
            };
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await API.put("/auth/me", editForm);
            setUser(res.data);
            setEditing(false);
        } catch (err) {
            alert("Failed to update profile");
        }
    };

    const confirmDelete = (postId) => {
        setDeleteId(postId);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await API.delete(`/posts/${deleteId}`);
            setPosts(posts.filter(p => p._id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            alert("Failed to delete post");
        }
    };

    if (loading) return <div className="container center-flex"><p>Loading profile...</p></div>;

    return (
        <div className="container">
            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Delete Artwork?"
                type="danger"
                confirmText="Delete"
                onConfirm={handleDelete}
            >
                Are you sure you want to delete this masterpiece? This action cannot be undone.
            </Modal>

            <ImageModal
                isOpen={!!viewPost}
                onClose={() => setViewPost(null)}
                imageSrc={viewPost ? `data:image/jpeg;base64,${viewPost.imageBase64}` : ""}
                prompt={viewPost?.prompt}
                user={user?.username}
            />

            <div className="glass-card" style={{ marginBottom: "40px", textAlign: "center", padding: "40px" }}>

                {editing ? (
                    <form onSubmit={handleUpdate} style={{ maxWidth: "400px", margin: "0 auto", textAlign: "left" }}>
                        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Profile</h3>

                        <div style={{ textAlign: "center", marginBottom: "20px" }}>
                            <label htmlFor="edit-upload" style={{ cursor: "pointer" }}>
                                <div style={{
                                    width: "100px", height: "100px", borderRadius: "50%",
                                    background: preview ? `url(${preview}) center/cover` : (user?.profilePic ? `url(data:image/jpeg;base64,${user.profilePic}) center/cover` : "rgba(255,255,255,0.1)"),
                                    margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center",
                                    border: "2px solid var(--accent)"
                                }}>
                                    {!preview && !user?.profilePic && <span className="material-symbols-outlined" style={{ fontSize: "2rem" }}>photo_camera</span>}
                                </div>
                            </label>
                            <input id="edit-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                        </div>

                        <textarea placeholder="Bio" value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} rows={2} />
                        <div style={{ display: "flex", gap: "10px" }}>
                            <input type="number" placeholder="Age" value={editForm.age} onChange={e => setEditForm({ ...editForm, age: e.target.value })} style={{ flex: 1 }} />
                            <select value={editForm.gender} onChange={e => setEditForm({ ...editForm, gender: e.target.value })} style={{ flex: 1, padding: "10px", background: "var(--bg-secondary)", color: "white", border: "1px solid var(--glass-border)", borderRadius: "8px", marginBottom: "15px" }}>
                                <option value="">Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button type="submit" style={{ flex: 1 }}>Save</button>
                            <button type="button" onClick={() => setEditing(false)} style={{ flex: 1, background: "#333" }}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
                            <div style={{
                                width: "120px", height: "120px", borderRadius: "50%",
                                background: user?.profilePic ? `url(data:image/jpeg;base64,${user.profilePic}) center/cover` : "var(--accent)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "3rem", fontWeight: "bold", color: "#121212",
                                border: "4px solid var(--glass-border)"
                            }}>
                                {!user?.profilePic && user?.name?.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <h1 style={{ marginBottom: "5px" }}>{user?.name || "User"}</h1>
                                <p style={{ color: "var(--accent)", margin: "0 0 5px 0" }}>@{user?.username}</p>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "0 0 10px 0" }}>{user?.email}</p>
                                {user?.bio && <p style={{ maxWidth: "600px", margin: "0 auto", fontStyle: "italic", color: "var(--text-secondary)" }}>"{user.bio}"</p>}

                                <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "10px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                                    {user?.age && <span>🎂 {user.age} years old</span>}
                                    {user?.gender && <span>⚧ {user.gender}</span>}
                                </div>

                                <button onClick={() => setEditing(true)} style={{ marginTop: "20px", padding: "8px 20px", fontSize: "0.9rem", background: "transparent", border: "1px solid var(--accent)", color: "var(--accent)" }}>
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px" }}>
                            <div style={{ background: "rgba(255,255,255,0.05)", padding: "15px 30px", borderRadius: "12px" }}>
                                <span style={{ fontSize: "1.8rem", fontWeight: "bold", display: "block" }}>{posts.length}</span>
                                <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Creations</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <h2 style={{ paddingLeft: "10px", borderLeft: "4px solid var(--accent)" }}>My Gallery</h2>

            {
                posts.length === 0 ? (
                    <p style={{ color: "var(--text-secondary)", marginTop: "20px" }}>You haven't created any images yet.</p>
                ) : (
                    <div className="masonry-grid">
                        {posts.map(p => (
                            <div key={p._id} className="masonry-item" onClick={() => setViewPost(p)}>
                                <ImageCard post={p} onDelete={confirmDelete} currentUser={user} />
                            </div>
                        ))}
                    </div>
                )
            }
        </div >
    );
}
