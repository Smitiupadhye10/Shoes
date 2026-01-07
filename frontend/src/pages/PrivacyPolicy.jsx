import React from "react";
import { Shield, Lock, Eye, FileText, Users, CheckCircle2, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: FileText,
      title: "Introduction",
      content: "At Sole mate, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data."
    },
    {
      icon: Eye,
      title: "Information We Collect",
      content: "We collect the following information:",
      list: [
        "Name, email, phone number, and shipping address",
        "Payment details processed securely via Razorpay",
        "Website usage data via cookies"
      ]
    },
    {
      icon: Shield,
      title: "How We Use Your Information",
      content: "We use your information for the following purposes:",
      list: [
        "To process and fulfill orders",
        "To improve customer service",
        "To communicate promotions and updates"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "We implement advanced security measures to protect your data. Transactions are encrypted and processed securely."
    },
    {
      icon: Users,
      title: "Third-Party Sharing",
      content: "We do not sell your personal data. However, we may share it with trusted partners like payment processors and logistics providers."
    },
    {
      icon: CheckCircle2,
      title: "Your Rights",
      content: "You can request data deletion or modification by contacting us at support@solemate.in."
    },
    {
      icon: Mail,
      title: "Contact Us",
      content: "For privacy concerns, email us at support@solemate.in"
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section className="pt-8 pb-12 md:pt-12 md:pb-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}>
              <Shield className="w-4 h-4" />
              Privacy & Protection
            </div>
            <h1 className="text-optic-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-3 sm:mb-4" style={{ color: 'var(--text-primary)' }}>
              Privacy <span style={{ color: 'var(--accent-yellow)' }}>Policy</span>
            </h1>
            <p className="text-optic-body text-base sm:text-lg md:text-xl mb-3 sm:mb-4" style={{ color: 'var(--text-secondary)' }}>
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="card-optic p-4 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--text-heading)' }}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: 'var(--text-primary)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-optic-heading text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3" style={{ color: 'var(--text-primary)' }}>
                        {index + 1}. {section.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-optic-body text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {section.content}
                  </p>
                  {section.list && (
                    <ul className="space-y-2 sm:space-y-3 ml-2">
                      {section.list.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 sm:gap-3">
                          <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--text-heading)' }}></div>
                          <span className="text-optic-body text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
