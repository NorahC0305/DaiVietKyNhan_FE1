import React from "react";
import ContactHeader from "./Components/ContactHeader";
import ContactInfo from "./Components/ContactInfo";
import CommunitySupport from "./Components/CommunitySupport";

const ContactPage = () => {
  return (
    <div className="min-h-screen w-full bg-center bg-fixed relative">
      {/* translucent gray overlay */}
      <div className="min-h-screen w-full">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <ContactHeader />
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-2xl space-y-8">
              <ContactInfo />
              <CommunitySupport />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
