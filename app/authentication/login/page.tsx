export default function Page() {
    return (
        <section className="section">
          <div className="container">
            <h1 className="title">Login</h1>
            <form>
              <div className="field">
                <label className="label">Username</label>
                <div className="control">
                  <input className="input" type="text" placeholder="Enter username" />
                </div>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input className="input" type="password" placeholder="Enter password" />
                </div>
              </div>
              <div className="field is-grouped">
                <div className="control">
                  <button className="button is-link">Login</button>
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