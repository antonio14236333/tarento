export default function RegisterPage() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Student Registration</h1>
          <form>
            <div className="field">
              <label className="label">Full Name</label>
              <div className="control">
                <input className="input" type="text" placeholder="Enter your full name" />
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
                <input className="input" type="password" placeholder="Enter your password" />
              </div>
            </div>
            <div className="field">
              <button className="button is-primary">Register</button>
            </div>
          </form>
        </div>
      </section>
    );
  }
  