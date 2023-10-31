import React from "react";
import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>
          Welcome to <span className="nowrap">FlyTime Repairs!</span>
        </h1>
      </header>
      <main className="public__main">
        <p>
          Located in Beautiful Downtown Lagos City,
          <p>
            Flytime Repairs provides a trained staff ready to meet your tech
            repair needs.
          </p>
        </p>
        <address className="public__addr">
          Flytime Repairs
          <br />
          76 Abayomi Drive
          <br />
          Victoria Island, Lagos
          <br />
          <a href="tel:+15555555555">(555) 555-5555</a>
        </address>
        <br />
        <p>Owner: Ken Hirohito</p>
      </main>
      <footer>
        <Link to="/login">Employee Login</Link>
      </footer>
    </section>
  );
  return content;
};

export default Public;
