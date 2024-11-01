export default function UploadProjectPage() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Upload Project</h1>
          <form>
            <div className="field">
              <label className="label">Project Title</label>
              <div className="control">
                <input className="input" type="text" placeholder="Enter project title" />
              </div>
            </div>
            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea className="textarea" placeholder="Enter project description"></textarea>
              </div>
            </div>
            <div className="field">
              <button className="button is-primary">Upload</button>
            </div>
          </form>
        </div>
      </section>
    );
  }
  