import React, { useRef } from 'react';
import Typewriter from 'typewriter-effect';
import { Link } from 'react-router-dom';

const Home = () => {
  const offersSectionRef = useRef(null);

  const scrollToOffers = () => {
    offersSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      title: "Book Appointments",
      description: "Book appointments with specialists without leaving your home.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      link: "/appointment"
    },
    {
      title: "Find Doctors",
      description: "Search and connect with the best doctors in your area.",
      image: "https://media.istockphoto.com/id/1398828096/photo/portrait-of-a-young-indian-doctor-wearing-a-stethoscope-sitting-in-a-office-writing-a.jpg?s=612x612&w=0&k=20&c=JHRk3XilS2_pzTTcuozuVTX49I7AXuI8vN_NjHJQ04w=",
      link: "/appointment"
    },
    {
      title: "Symptom Checker",
      description: "Get insights about your symptoms before consulting a doctor.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      link: "/symptoms"
    },
    {
      title: "Health Records",
      description: "Store and access your medical records securely from anywhere.",
      image: "https://images.unsplash.com/photo-1573883431205-98b5f10aaedb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      link: "/safety"
    },
    {
      title: "Unfit Mapping",
      description: "Mark areas unfit for travelling during medical emergencies.",
      image: "https://betinasia.zendesk.com/hc/article_attachments/22178895521170",
      link: "/unsafe"
    }
  ];

  return (
    <div className="w-full">
      <section className="relative bottom-16 h-screen flex flex-col md:flex-row pt-20">
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12">
          <h1 className="text-8xl font-bold text-green-800 mb-6">
            Your Health,<br />Our Priority
          </h1>

          <div className="text-xl md:text-2xl lg:text-3xl text-blue-600 font-medium mb-2 h-20">
            <Typewriter
              options={{
                strings: [
                  'Book appointments with top doctors',
                  'Check your symptoms online',
                  'Get medical advice from specialists',
                  'Track your health records'
                ],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30
              }}
            />
          </div>

          <p className="text-2xl text-gray-600 mb-10 max-w-lg">
            <span className='font-semibold'>SAAHAS</span> brings healthcare to your fingertips. Access quality healthcare services anytime, anywhere.
          </p>

          <div className="flex justify-center md:justify-start">
            <button
              onClick={scrollToOffers}
              className="px-10 py-4 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 text-center text-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 h-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&q=80"
            alt="Healthcare professionals"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section ref={offersSectionRef} className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare solutions designed to make your life easier and healthier
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 max-w-7xl mx-auto">
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 left-4 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">{index + 1}</span>
                  </div>
                </div>

                <div className="flex flex-col flex-grow p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 flex-grow">{feature.description}</p>

                  <Link
                    to={feature.link}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            ))}

            <div className="lg:col-span-3 flex flex-col sm:flex-row justify-center gap-8">
              {features.slice(3).map((feature, index) => (
                <div
                  key={index + 3}
                  className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1rem)]"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 left-4 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl font-bold">{index + 4}</span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-6 flex-grow">{feature.description}</p>

                    <Link
                      to={feature.link}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                Coming Soon
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                Experience Healthcare on the Go
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                We're crafting an exceptional mobile experience that will revolutionize how you manage your health. Stay tuned for our upcoming app release.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Easy Appointment Booking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Health Records Access</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Real-time Notifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Emergency Services</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">

              </div>
            </div>

            <div className="w-full md:w-1/2 relative">
              <div className="relative">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-green-200 rounded-full opacity-20"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-200 rounded-full opacity-20"></div>
                <div className="relative z-10">
                  <img
                    src="https://img.freepik.com/free-vector/online-education-concept_52683-8287.jpg?ga=GA1.1.906515664.1738859704&semt=ais_hybrid"
                    alt="Mobile app preview"
                    className="w-full h-auto max-h-[400px] object-contain rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;