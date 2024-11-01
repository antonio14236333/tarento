export default function UploadResumePage() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Upload Resume</h1>
          <form>
            <div className="field">
              <label className="label">Select your resume</label>
              <div className="control">
                <input className="input" type="file" />
              </div>
            </div>
            <div className="field">
              <button className="button is-link">Upload</button>
            </div>
          </form>
        </div>
      </section>
    );
  }
  