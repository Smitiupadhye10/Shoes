import React from "react";
import { Truck, MapPin, Clock, Package, Route, AlertTriangle, CheckCircle2, Mail, Phone } from "lucide-react";

const ShippingPolicy = () => {
  const sections = [
    {
      icon: MapPin,
      title: "Shipping Areas",
      content: "We currently ship to all major cities and towns across India. We use reliable courier partners to ensure safe and timely delivery of your orders.",
      note: "For remote areas, delivery may take additional time. We will inform you if your location is not serviceable."
    },
    {
      icon: Package,
      title: "Shipping Charges",
      content: "Shipping charges are calculated based on your delivery location and the weight of your order:",
      list: [
        "Free shipping on orders above ₹999",
        "Standard shipping charges apply for orders below ₹999",
        "Express delivery options available at additional cost",
        "Shipping charges will be displayed at checkout before payment"
      ]
    },
    {
      icon: Clock,
      title: "Processing Time",
      content: "Orders are typically processed within 1-2 business days after payment confirmation. Processing time may be extended during:",
      list: [
        "Sale periods or promotional events",
        "Festival seasons",
        "Unforeseen circumstances beyond our control"
      ],
      note: "We will notify you via email if there are any delays in processing your order."
    },
    {
      icon: Route,
      title: "Delivery Time",
      content: "Estimated delivery times vary by location:",
      list: [
        { text: "Metro cities:", value: "3-5 business days" },
        { text: "Tier 2 cities:", value: "5-7 business days" },
        { text: "Other locations:", value: "7-10 business days" }
      ],
      note: "Delivery times are estimates and may vary due to factors beyond our control, such as weather conditions, local holidays, or courier service delays."
    },
    {
      icon: CheckCircle2,
      title: "Order Tracking",
      content: "Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order status in real-time using the tracking number provided. You can also check your order status by logging into your account."
    },
    {
      icon: MapPin,
      title: "Delivery Address",
      content: "Please ensure your delivery address is complete and accurate. We are not responsible for delays or failed deliveries due to incorrect addresses provided by you.",
      note: "If you need to change your delivery address after placing an order, please contact us immediately. Changes may not be possible if the order has already been shipped."
    },
    {
      icon: AlertTriangle,
      title: "Delivery Attempts",
      content: "Our courier partners will make multiple attempts to deliver your order. If delivery fails after all attempts, the package will be returned to us, and you may be charged return shipping fees. Please ensure someone is available to receive the package or provide alternative delivery instructions."
    },
    {
      icon: Truck,
      title: "Damaged or Lost Shipments",
      content: "If your order arrives damaged or is lost in transit, please contact us within 48 hours of delivery (or expected delivery date). We will:",
      list: [
        "Investigate the issue promptly",
        "Replace the damaged/lost items at no additional cost",
        "Process a full refund if replacement is not possible"
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section className="pt-8 pb-12 md:pt-12 md:pb-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: 'var(--accent-yellow)', color: 'var(--text-primary)' }}>
              <Truck className="w-4 h-4" />
              Fast & Reliable
            </div>
            <h1 className="text-optic-heading text-4xl md:text-5xl lg:text-6xl leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Shipping <span style={{ color: 'var(--accent-yellow)' }}>Policy</span>
            </h1>
            <p className="text-optic-body text-lg md:text-xl mb-4" style={{ color: 'var(--text-secondary)' }}>
              Everything you need to know about our shipping and delivery process.
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
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
                <div key={index} className="card-optic p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-yellow)' }}>
                      <Icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: 'var(--text-primary)' }} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-optic-heading text-xl md:text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                        {index + 1}. {section.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-optic-body mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {section.content}
                  </p>
                  {section.note && (
                    <p className="text-optic-body mt-4 p-4 rounded-lg leading-relaxed" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
                      {section.note}
                    </p>
                  )}
                  {section.list && (
                    <ul className="space-y-3 ml-2 mt-4">
                      {section.list.map((item, idx) => {
                        const text = typeof item === 'object' ? item.text : null;
                        const value = typeof item === 'object' ? item.value : item;
                        return (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--accent-yellow)' }}></div>
                            <span className="text-optic-body leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                              {text && <strong>{text}</strong>} {value}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-optic p-8 md:p-10 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--accent-yellow)' }}>
              <Mail className="w-8 h-8" style={{ color: 'var(--text-primary)' }} />
            </div>
            <h2 className="text-optic-heading text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Shipping Questions?
            </h2>
            <p className="text-optic-body text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
              For any shipping-related queries, please contact us at:
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left max-w-xl mx-auto">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: 'var(--accent-yellow)' }} />
                <div>
                  <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Email</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>support@lenslogic.com</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: 'var(--accent-yellow)' }} />
                <div>
                  <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Phone</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>+91 98765 43210</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingPolicy;
