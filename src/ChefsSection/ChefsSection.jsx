import React from 'react';

const chefsData = [
  {
    id: '1',
    name: 'Robert John',
    title: 'Senior chef',
    image:
      'https://i.ibb.co/4vFbZCV/Whats-App-Image-2025-06-12-at-01-49-58-7237b35a.jpg', // Replace with actual image URL
    socials: {
      facebook: 'https://facebook.com/robertjohn', // Example link
      twitter: 'https://twitter.com/robertjohn', // Example link
      instagram: 'https://instagram.com/robertjohn', // Example link
    },
  },
  {
    id: '2',
    name: 'Harnis Joe',
    title: 'Veg chef',
    image:
      'https://i.ibb.co/DfLgmMJc/Whats-App-Image-2025-06-12-at-01-49-58-6d45a8e4.jpg', // Replace with actual image URL
    socials: {
      facebook: 'https://facebook.com/harnisjoe',
      twitter: 'https://twitter.com/harnisjoe',
      instagram: 'https://instagram.com/harnisjoe',
    },
  },
  {
    id: '3',
    name: 'Merry Joe',
    title: 'Junior chef',
    image:
      'https://i.ibb.co/nqfXhRth/Whats-App-Image-2025-06-12-at-01-49-59-d0cc0e02.jpg', // Replace with actual image URL
    socials: {
      facebook: 'https://facebook.com/merryjoe',
      twitter: 'https://twitter.com/merryjoe',
      instagram: 'https://instagram.com/merryjoe',
    },
  },
  {
    id: '4',
    name: 'Alison Bergt',
    title: 'Supervisor',
    image:
      'https://i.ibb.co/Z4k5jYb/Whats-App-Image-2025-06-12-at-01-50-00-25a0f839.jpg', // Replace with actual image URL
    socials: {
      facebook: 'https://facebook.com/alisonbergt',
      twitter: 'https://twitter.com/alisonbergt',
      instagram: 'https://instagram.com/alisonbergt',
    },
  },
  // You can add more chefs here
];

const ChefsSection = () => {
  return (
    <section className="py-16 shadow-2xl">
      <div className="container mx-auto text-center">
        <h2 className="font-serif text-4xl md:text-5xl  mb-4">Our Chefs</h2>
        <p className=" mb-10">
          Our Chefs are trained specifically to provide quality food.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {chefsData.map(chef => (
            <div key={chef.id} className="flex flex-col items-center">
              {/* Image Container with Social Icons */}
              {/* Added 'group' to this div to enable group-hover effects on children */}
              <div className="relative w-64 h-80 shadow-md rounded-md overflow-hidden group bg-gray-200 ">
                {/* Chef's Image */}
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 "
                  // Added onerror for fallback in case image fails to load
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://placehold.co/300x350/cccccc/ffffff?text=Image+Unavailable';
                  }}
                />

                {/* Social Icons Overlay - Initially transparent, fades in on hover */}
                {/* Changed bg-black to bg-black/50 for a subtle transparency */}
                <div className="absolute inset-0 bg-black/50 flex items-center  justify-center space-x-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ">
                  {chef.socials.facebook && (
                    <a
                      href={chef.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" hover:text-green-400 transition-all duration-300 ease-out transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                    >
                      {/* Facebook SVG Icon */}
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="w-8 h-8"
                      >
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm3 8h-2v2h2v3h-2v7h-3v-7H8V9h2V7.5C10 6.12 10.835 5 13 5h2v3z" />
                      </svg>
                    </a>
                  )}
                  {chef.socials.twitter && (
                    <a
                      href={chef.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" hover:text-green-300 transition-all duration-300 ease-out transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                      // Adding a slight delay for a staggered effect
                      style={{ transitionDelay: '50ms' }}
                    >
                      {/* Twitter SVG Icon */}
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="w-8 h-8"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.791-1.574 2.163-2.723-.951.564-2.005.974-3.127 1.195-.897-.957-2.174-1.555-3.594-1.555-3.409 0-6.173 2.764-6.173 6.172 0 .484.055.955.158 1.408-5.145-.259-9.721-2.729-12.785-6.479-.533.917-.836 1.983-.836 3.13 0 2.146 1.097 4.041 2.766 5.147-.806-.025-1.564-.247-2.228-.616v.081c0 2.986 2.127 5.474 4.93 6.037-.516.136-1.064.208-1.624.208-.398 0-.783-.038-1.157-.113.784 2.443 3.06 4.228 5.757 4.276-2.091 1.64-4.735 2.618-7.58 2.618-.493 0-.976-.029-1.453-.085 2.706 1.738 5.928 2.752 9.39 2.752 11.264 0 17.41-9.351 17.41-17.41 0-.266-.007-.529-.02-.791 1.2-.865 2.247-1.993 3.078-3.256z" />
                      </svg>
                    </a>
                  )}
                  {chef.socials.instagram && (
                    <a
                      href={chef.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" hover:text-green-400 transition-all duration-300 ease-out transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                      // Adding a slight delay for a staggered effect
                      style={{ transitionDelay: '100ms' }}
                    >
                      {/* Instagram SVG Icon */}
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="w-8 h-8"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.071 1.17.055 1.805.249 2.227.415.56.217.96.477 1.385.9.426.425.687.825.903 1.385.166.422.36 1.057.415 2.227.059 1.266.071 1.646.071 4.85s-.012 3.584-.071 4.85c-.055 1.17-.249 1.805-.415 2.227-.217.56-.477.96-.9.9-.425.426-.825.687-1.385.903-.422.166-1.057.36-2.227.415-1.266.059-1.646.071-4.85.071s-3.584-.012-4.85-.071c-1.17-.055-1.805-.249-2.227-.415-.56-.217-.96-.477-1.385-.9-.426-.425-.687-.825-.903-1.385-.166-.422-.36-1.057-.415-2.227-.059-1.266-.071-1.646-.071-4.85s.012-3.584.071-4.85c.055-1.17.249-1.805.415-2.227.217-.56.477-.96.9-.9.425-.426.825-.687 1.385-.903.422-.166 1.057-.36 2.227-.415 1.266-.059 1.646-.071 4.85-.071zm0-2.163c-3.264 0-3.67.012-4.94.071-1.303.061-2.106.275-2.738.514-.645.245-1.187.592-1.742 1.147-.555.555-.902 1.097-1.147 1.742-.239.632-.453 1.435-.514 2.738-.059 1.27-.071 1.676-.071 4.94s.012 3.67.071 4.94c.061 1.303.275 2.106.514 2.738.245.645.592 1.187 1.147 1.742.555.555-.902 1.097-1.147 1.742-.239.632-.453 1.435-.514 2.738-.059 1.27-.071 1.676-.071 4.94s-.012-3.67-.071-4.94c-.061-1.303-.275-2.106-.514-2.738-.245-.645-.592-1.187-1.147-1.742-.555-.555-1.097-.902-1.742-1.147-.632-.239-1.435-.453-2.738-.514-1.27-.059-1.676-.071-4.94-.071zM12 16.5c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5zm0-7.5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm5.724-4.571a1.083 1.083 0 100 2.167 1.083 1.083 0 000-2.167z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-semibold  mt-4">{chef.name}</h3>
              <p className=" text-sm">{chef.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChefsSection;
