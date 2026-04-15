import React, { useState } from "react";
import { MapPin, Menu, Phone, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { Link, useLocation } from "react-router-dom";
import { LOGOS } from "@/constants/branding";
import { CITIES } from "@/utils/data";

const Header = ({ cities = CITIES }) => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const productItems = [
    { name: "Water Treatment", path: "/our-products/water-treatment" },
    { name: "Air Purifiers", path: "/our-products/air-purifiers" },
    { name: "Medical Equipments", path: "/our-products/medical-equipments" },
  ];

  const serviceItems = [
    { name: "Installation", path: "/our-services/installation" },
    { name: "Maintenance", path: "/our-services/maintenance" },
    { name: "Consultation", path: "/our-services/consultation" },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-red-700 text-white text-sm">
        <div className="max-w-7xl mx-auto flex justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <Phone size={14} />
            <a href="tel:+919884927676">+91 98849 27676</a>
            <span>|</span>
            <a href="tel:+917010421860">+91 70104 21860</a>
          </div>

          <div className="hidden sm:flex items-center gap-2 flex-wrap">
            <MapPin size={14} />
            {cities.map((c) => (
              <span key={c} className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black text-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

          <Link to="/">
            <img
              src={LOGOS.Mark_Care_Logo}
              alt="Logo"
              className="w-12 rounded-md"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">

            <Link to="/" className={isActive("/") ? "text-red-500" : "hover:text-red-500"}>
              Home
            </Link>

            <Link to="/about-us" className="hover:text-red-500">
              About Us
            </Link>

            {/* Products */}
            <div
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-red-500">
                Products <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {productsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.25 }}
                    className="absolute top-full left-0 mt-4 w-56 bg-white text-black rounded-xl shadow-xl overflow-hidden"
                  >
                    {productItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-3 hover:bg-red-50 hover:text-red-600"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Services */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-red-500">
                Services <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.25 }}
                    className="absolute top-full left-0 mt-4 w-56 bg-white text-black rounded-xl shadow-xl overflow-hidden"
                  >
                    {serviceItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-3 hover:bg-red-50 hover:text-red-600"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/our-projects" className="hover:text-red-500">
              Projects
            </Link>

            <Link to="/blogs" className="hover:text-red-500">
              Blogs
            </Link>

            <Link to="/contact-us">
              <Button className="rounded-2xl">Get Quote</Button>
            </Link>

          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>

        {/* Mobile Animated Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-black text-white overflow-hidden shadow-lg"
            >
              <div className="px-4 py-4 flex flex-col gap-4 text-sm">

                <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
                <Link to="/about-us" onClick={() => setMobileOpen(false)}>About Us</Link>

                {/* Mobile Products */}
                <div>
                  <button
                    onClick={() => setProductsOpen(!productsOpen)}
                    className="flex justify-between w-full"
                  >
                    Products
                    <motion.div animate={{ rotate: productsOpen ? 180 : 0 }}>
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {productsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4 mt-2 flex flex-col gap-2"
                      >
                        {productItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            className="text-gray-600"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="flex justify-between w-full"
                  >
                    Services
                    <motion.div animate={{ rotate: servicesOpen ? 180 : 0 }}>
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4 mt-2 flex flex-col gap-2"
                      >
                        {productItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            className="text-gray-600"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/blogs" onClick={() => setMobileOpen(false)}>Blogs</Link>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
