import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import "./index.css";

function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/blogs.json")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load blogs");
        return response.json();
      })
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load articles. Please try again.");
        setLoading(false);
      });
  }, []);

  return { blogs, loading, error };
}

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">BlogSpace<span>.</span></Link>
      <nav><Link to="/">Home</Link><a href="#about">About</a></nav>
    </header>
  );
}

function Footer() {
  return (
    <footer id="about">
      <h3>BlogSpace.</h3>
      <p>Ideas, stories and knowledge in one place.</p>
      <p>© 2026 BlogSpace. All rights reserved.</p>
    </footer>
  );
}

function Home() {
  const { blogs, loading, error } = useBlogs();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(blogs.map((blog) => blog.category))];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || blog.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <section className="hero">
        <p className="eyebrow">WELCOME TO BLOGSPACE</p>
        <h1>Ideas worth <span>sharing.</span></h1>
        <p>Discover stories, learn something new and explore technology.</p>
        <a href="#blogs" className="hero-button">Explore Articles</a>
      </section>

      <main className="container" id="blogs">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR LATEST STORIES</p>
            <h2>Explore Articles</h2>
          </div>
          <span>{blogs.length} Articles</span>
        </div>

        <input
          className="search-input"
          type="search"
          placeholder="Search articles..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="categories">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "category active" : "category"}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {loading && <p className="message">Loading articles...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <div className="blog-grid">
            {filteredBlogs.map((blog) => (
              <article className="blog-card" key={blog.id}>
                <Link to={`/blog/${blog.id}`}>
                  <img src={blog.image} alt={blog.title} />
                </Link>
                <div className="card-content">
                  <span className="tag">{blog.category}</span>
                  <h3><Link to={`/blog/${blog.id}`}>{blog.title}</Link></h3>
                  <p>{blog.description}</p>
                  <div className="card-bottom">
                    <span>{blog.author}</span>
                    <Link to={`/blog/${blog.id}`} className="read-more">Read More →</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && filteredBlogs.length === 0 && (
          <p className="message">No articles found.</p>
        )}
      </main>
    </>
  );
}

function BlogDetails() {
  const { id } = useParams();
  const { blogs, loading, error } = useBlogs();

  if (loading) return <p className="message">Loading article...</p>;
  if (error) return <p className="error">{error}</p>;

  const blog = blogs.find((item) => item.id === Number(id));

  if (!blog) {
    return (
      <main className="container not-found">
        <h2>Article Not Found</h2>
        <Link to="/" className="back-button">Back to Home</Link>
      </main>
    );
  }

  return (
    <main className="article-container">
      <Link to="/" className="back-link">← Back to Articles</Link>
      <span className="tag">{blog.category}</span>
      <h1>{blog.title}</h1>
      <p className="article-meta">By {blog.author} · {blog.date}</p>
      <img className="article-image" src={blog.image} alt={blog.title} />
      <p className="article-description">{blog.description}</p>
      <div className="article-content">{blog.content}</div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="*" element={
          <main className="container not-found">
            <h2>Page Not Found</h2>
            <Link to="/">Go Home</Link>
          </main>
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
