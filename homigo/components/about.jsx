import React from 'react';
import Header from '@/components/header';

const AboutPage = () => {
  return (
    <div className="about-page">
      <Header />
      <div className="container mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold mb-4">About</h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Packages Used</h2>
          <ul className="list-disc pl-5">
            <li>@eslint/eslintrc@3.3.0</li>
            <li>@tailwindcss/postcss@4.0.12</li>
            <li>bcrypt@5.1.1</li>
            <li>bcryptjs@3.0.2</li>
            <li>cloudinary@2.6.0</li>
            <li>datepicker@0.0.0</li>
            <li>eslint-config-next@15.2.1</li>
            <li>eslint@9.22.0</li>
            <li>mongoose@8.12.1</li>
            <li>next-auth@4.24.11</li>
            <li>next@15.2.1</li>
            <li>react-datepicker@8.2.1</li>
            <li>react-dom@19.0.0</li>
            <li>react@19.0.0</li>
            <li>tailwindcss@4.0.14</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">Third-Party</h2>
          <ul className="list-disc pl-5">
            <li>next.js</li>
            <li>react</li>
            <li>mongodb</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;