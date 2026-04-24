import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto p-6">
      {/* About Us Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          We are a foundation dedicated to making a positive impact in our community through various initiatives and programs.
        </p>
      </section>

      {/* Why Our Foundation Has Been Founded Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-4">Why Our Foundation Has Been Founded?</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Our foundation was established to address pressing social issues and to provide support to those in need.
        </p>
      </section>

      {/* Our Missions Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-4">Our Missions</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Our mission is to empower individuals and communities by providing resources, education, and opportunities for growth.
        </p>
      </section>

      {/* Our Vision Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          We envision a world where every person has the opportunity to achieve their full potential.
        </p>
      </section>

      {/* Our Principles Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-4">Our Principles</h2>
        <ul className="list-disc pl-6 text-lg text-gray-700 leading-relaxed">
          <li>Integrity in all our actions</li>
          <li>Commitment to excellence</li>
          <li>Collaboration and partnership</li>
          <li>Respect for diversity</li>
        </ul>
      </section>

      {/* Our Goals Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-4">Our Goals</h2>
        <ul className="list-disc pl-6 text-lg text-gray-700 leading-relaxed">
          <li>Expand our outreach programs</li>
          <li>Increase community engagement</li>
          <li>Promote sustainable practices</li>
          <li>Foster a culture of continuous improvement</li>
        </ul>
      </section>
    </div>
  );
};

export default AboutPage;
