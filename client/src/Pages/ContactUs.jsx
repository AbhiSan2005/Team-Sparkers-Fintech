import { Routes, Route } from 'react-router-dom';
import React from 'react';
import { Link } from 'lucide-react';
import Navbar from '../Components/Navbar';

export default function ContactUs() {
  return (
    <div className="contactus_cont">
      <Navbar/>
      <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-12">
        <h2 className="text-3xl font-bold text-[#002D72] mb-6">Contact Bank of Maharashtra</h2>
        <p className="mb-4 text-gray-700">
          For general inquiries, complaints, or support, please use the following contact details:
        </p>

        <ul className="mb-4 list-disc list-inside text-gray-700">
          <li><strong>Customer Care Toll-Free Numbers:</strong> 1800 233 4526, 1800 102 2636</li>
          <li><strong>Landline Numbers:</strong> 020-24480797, 020-24504118, 020-24504117</li>
          <li><strong>Email Support:</strong> mahaconnect@mahabank.co.in</li>
          <li><strong>WhatsApp Banking:</strong> Send "Hi" to 70660 36640</li>
        </ul>

        <p className="mb-4 text-gray-700 font-semibold">Head Office Address:</p>
        <address className="mb-6 text-gray-700 not-italic">
          Bank of Maharashtra Central Office, Lokmangal, 1501, Shivajinagar, Pune - 411005<br />
          Phone: 020-25532731, 733, 734, 735, 736<br />
          Fax: 020-25532728
        </address>

        <p className="text-gray-700">
          The bank provides 24/7 support through its customer care and digital platforms helping millions of customers nationwide.
        </p>
      </section>
    </div>
  );
}
