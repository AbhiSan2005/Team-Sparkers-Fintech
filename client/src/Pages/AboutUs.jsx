import { Routes, Route } from 'react-router-dom';
import React from 'react';

export default function AboutUs() {
  return (
    <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-12">
      <h2 className="text-3xl font-bold text-[#002D72] mb-6">About Bank of Maharashtra</h2>
      <p className="mb-4 text-gray-700">
        Bank of Maharashtra, a Public Sector Bank headquartered in Pune, Maharashtra, was formally registered on September 16, 1935,
        and commenced business operations on February 8, 1936. It has a rich heritage spanning over nine decades with commitment to
        providing secure, innovative, and customer-centric banking services.
      </p>
      <p className="mb-4 text-gray-700">
        The bank serves over 35 million customers across India through a vast network of branches, ATMs, and digital platforms. With
        strong financials and multiple prestigious industry awards, Bank of Maharashtra continues to grow as a reliable, inclusive,
        and technologically advanced banking institution.
      </p>
      <p className="mb-4 text-gray-700">
        Our products and services cater to diverse requirements including Retail, Agriculture, MSME, Corporate, and NRI customers,
        offering personal and business loans, deposits, digital banking, insurance, and wealth management.
      </p>
      <p className="text-gray-700 font-semibold">
        To know more, visit the official website or contact us directly.
      </p>
    </section>
  );
}
