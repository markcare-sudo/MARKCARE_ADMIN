import { FaWhatsapp } from "react-icons/fa";

const Whatsapp = () => {
  // wa.me requires full number without '+' or spaces
  const whatsappNumber = "917010421860";
  const customerMessage =
    "Hi! I'm interested in Revisit's Freelance services parter. Please share more details.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customerMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Make the whole widget clickable */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="relative flex items-center"
      >
        {/* Always-visible label */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-full shadow-md whitespace-nowrap">
          Chat with us!
          {/* small pointer */}
          <span className="absolute -right-1 top-1/2 -translate-y-1/2 h-2 w-2 rotate-45 bg-gray-900" />
        </span>

        {/* Floating WhatsApp button */}
        <div className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl flex items-center justify-center transition-transform duration-200 hover:scale-105">
          <FaWhatsapp size={30} />
        </div>
      </a>
    </div>
  );
};

export default Whatsapp;
