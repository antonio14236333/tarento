export default function JobSearchPage() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Job Search</h1>
          <div className="box">
          <img
                src="https://wallpapers.com/images/hd/g-force-hurley-posing-9swvn6j84wh2w0uq.jpg"
                alt="Job Position Illustration"
                style={{ objectFit: "cover", width: "200px", height: "200px" }}
              />
            <h2 className="subtitle">Software Developer at XYZ Corp</h2>
            <p>Location: Remote</p>
            <p><strong>Requirements:</strong> JavaScript, React</p>
            <button className="button is-primary">Apply Now</button>
          </div>
        </div>
      </section>
    );
  }
  