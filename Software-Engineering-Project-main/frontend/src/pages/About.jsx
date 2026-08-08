import { motion } from "framer-motion";
import {
  HiShoppingBag,
  HiLightBulb,
  HiHeart,
  HiUserGroup,
  HiStar,
  HiTrendingUp,
} from "react-icons/hi";
import Footer from "../components/Footer";

const About = () => {
  // const teamMembers = [
  //   {
  //     name: "Jihadul Islam",
  //     role: "Developer",
  //     image: "/jihad.jpg",
  //     bio: "Building innovative e-commerce solutions with cutting-edge technology.",
  //   },
  //   {
  //     name: "MD Fahim Abrar",
  //     role: "Developer",
  //     image: "/fahim.jpg",
  //     bio: "Creating seamless user experiences and robust backend systems.",
  //   },
  //   {
  //     name: "Mohammad Shafayat Karim",
  //     role: "Developer",
  //     image: "/safayat.jpg",
  //     bio: "Developing scalable applications and ensuring code quality.",
  //   },
  // ];

  const stats = [
    { icon: HiUserGroup, value: "500K+", label: "Happy Customers" },
    { icon: HiShoppingBag, value: "1M+", label: "Products Sold" },
    { icon: HiStar, value: "4.8/5", label: "Customer Rating" },
    { icon: HiTrendingUp, value: "150+", label: "Countries Served" },
  ];

  const values = [
    {
      icon: HiHeart,
      title: "Customer First",
      description:
        "We put our customers at the heart of everything we do, ensuring satisfaction and building lasting relationships.",
      color: "from-gray-700 to-gray-900",
    },
    {
      icon: HiLightBulb,
      title: "Innovation",
      description:
        "We constantly innovate to provide the best shopping experience with cutting-edge technology and features.",
      color: "from-gray-700 to-gray-900",
    },
    {
      icon: HiStar,
      title: "Quality Products",
      description:
        "We curate only the finest products from trusted brands, ensuring authenticity and excellence in every purchase.",
      color: "from-gray-700 to-gray-900",
    },
    {
      icon: HiTrendingUp,
      title: "Continuous Growth",
      description:
        "We're committed to continuous improvement, expanding our offerings and enhancing our services every day.",
      color: "from-gray-700 to-gray-900",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <HiShoppingBag className="text-6xl" />
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Cartify
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Your trusted e-commerce partner, delivering exceptional shopping
              experiences since 2020
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <stat.icon className="text-white text-3xl" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
              <p>
                Cartify was born from a simple vision: to create an online
                shopping experience that feels personal, trustworthy, and
                delightful. Founded in 2020, we set out to build more than just
                another e-commerce platform – we wanted to create a shopping
                destination where quality meets convenience.
              </p>
              <p>
                What started as a small team with big dreams has grown into a
                thriving marketplace serving over 500,000 customers across 150
                countries. Our success is built on the foundation of trust,
                innovation, and an unwavering commitment to customer
                satisfaction.
              </p>
              <p>
                Today, Cartify stands as a testament to what's possible when you
                combine cutting-edge technology with genuine care for your
                customers. We're proud of how far we've come, but we're even
                more excited about where we're going.
              </p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
              alt="Our Story"
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl -z-10"></div>
          </motion.div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <HiLightBulb className="text-white text-3xl" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              To revolutionize online shopping by providing a seamless, secure,
              and satisfying experience that exceeds customer expectations. We
              strive to connect people with quality products while building a
              sustainable and ethical e-commerce ecosystem.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <HiStar className="text-white text-3xl" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              To become the world's most loved and trusted e-commerce platform,
              where shopping is not just a transaction but an experience. We
              envision a future where technology and human touch come together
              to create meaningful connections between brands and customers.
            </p>
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
            Our Values
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            The principles that guide everything we do at Cartify
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
              >
                <value.icon className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Team Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
            Meet Our Team
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            The passionate individuals driving Cartify forward
          </p>
        </motion.div> */}

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {member.name}
                </h3>
                <p className="text-gray-800 font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div> */}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white py-16 mb-0"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Experience Cartify?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover a better way to
            shop online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-800 px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all duration-300 inline-block"
            >
              Start Shopping
            </motion.a>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-md text-white border-2 border-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:bg-white/30 transition-all duration-300 inline-block"
            >
              Contact Us
            </motion.a>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default About;
