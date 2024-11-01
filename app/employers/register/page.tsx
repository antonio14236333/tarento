export default function EmployerRegistrationPage() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Employer Registration</h1>
          <form>
            <div className="field">
              <label className="label">Company Name</label>
              <div className="control">
                <input className="input" type="text" placeholder="Enter your company name" />
              </div>
            </div>
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input className="input" type="email" placeholder="Enter your email" />
              </div>
            </div>
            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                <input className="input" type="password" placeholder="Enter a password" />
              </div>
            </div>
            <div className="field">
              <label className="label">Company Description</label>
              <div className="control">
                <textarea className="textarea" placeholder="Describe your company"></textarea>
              </div>
            </div>
            <div className="field">
              <label className="label">Website</label>
              <div className="control">
                <input className="input" type="url" placeholder="Enter your company website" />
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button className="button is-primary">Register</button>
              </div>
              <div className="control">
                <button className="button is-light">Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </section>
    );
  }
  